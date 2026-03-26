import json
import os
from datetime import datetime, timezone

import redis
from groq import Groq

from db.database import execute_query, fetch_all, fetch_one

redis_client = redis.Redis(host=os.getenv("REDIS_HOST", "redis"), port=6379, decode_responses=True)
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def _relative_time(ts) -> str:
    if not ts:
        return "No activity"
    if ts.tzinfo is None:
        ts = ts.replace(tzinfo=timezone.utc)
    delta = datetime.now(timezone.utc) - ts
    if delta.total_seconds() < 60:
        return "Just now"
    if delta.total_seconds() < 3600:
        mins = int(delta.total_seconds() // 60)
        return f"{mins} minute{'s' if mins != 1 else ''} ago"
    if delta.total_seconds() < 86400:
        hrs = int(delta.total_seconds() // 3600)
        return f"{hrs} hour{'s' if hrs != 1 else ''} ago"
    days = int(delta.total_seconds() // 86400)
    return f"{days} day{'s' if days != 1 else ''} ago"


def _safe_json_load(value, fallback):
    if value is None:
        return fallback
    if isinstance(value, (dict, list)):
        return value
    try:
        return json.loads(value)
    except Exception:  # noqa: BLE001
        return fallback


def _user_exists(user_id: int) -> bool:
    row = fetch_one("SELECT id FROM users WHERE id=%s", (user_id,))
    return bool(row)


def get_summary(user_id: int) -> dict:
    if not _user_exists(user_id):
        raise ValueError("User not found")

    progress_rows = fetch_all("SELECT * FROM module_progress WHERE user_id=%s", (user_id,))
    modules_completed = sum(1 for row in progress_rows if row.get("status") == "completed")

    lp_row = fetch_one("SELECT jsonb_array_length(path) AS modules_total FROM learning_paths WHERE user_id=%s", (user_id,))
    modules_total = int((lp_row or {}).get("modules_total") or 0)

    total_minutes = sum(int(row.get("time_spent_minutes") or 0) for row in progress_rows)
    hours_spent = round(total_minutes / 60, 1)

    streak_raw = redis_client.get(f"user:{user_id}:streak")
    streak_days = int(streak_raw) if streak_raw and str(streak_raw).isdigit() else 0

    last_activity_row = fetch_one(
        "SELECT created_at FROM activity_logs WHERE user_id=%s ORDER BY created_at DESC LIMIT 1",
        (user_id,),
    )
    last_activity = _relative_time((last_activity_row or {}).get("created_at"))

    return {
        "modules_completed": modules_completed,
        "modules_total": modules_total,
        "hours_spent": hours_spent,
        "streak_days": streak_days,
        "last_activity": last_activity,
    }


def get_progress(user_id: int) -> list:
    rows = fetch_all(
        "SELECT module_index, status, progress_percent, time_spent_minutes, last_accessed "
        "FROM module_progress WHERE user_id=%s ORDER BY module_index ASC",
        (user_id,),
    )
    if rows:
        return [dict(row) for row in rows]

    lp_row = fetch_one("SELECT path FROM learning_paths WHERE user_id=%s", (user_id,))
    if not lp_row:
        return []

    path = _safe_json_load(lp_row.get("path"), [])
    return [
        {
            "module_index": i,
            "status": "not_started",
            "progress_percent": 0,
            "time_spent_minutes": 0,
            "last_accessed": None,
        }
        for i in range(len(path))
    ]


def check_stagnation(user_id: int) -> dict:
    last_activity_row = fetch_one(
        "SELECT created_at FROM activity_logs WHERE user_id=%s ORDER BY created_at DESC LIMIT 1",
        (user_id,),
    )
    if last_activity_row and last_activity_row.get("created_at"):
        ts = last_activity_row["created_at"]
        if ts.tzinfo is None:
            ts = ts.replace(tzinfo=timezone.utc)
        days_inactive = (datetime.now(timezone.utc) - ts).days
    else:
        days_inactive = 999

    failed_row = fetch_one(
        "SELECT COUNT(*) AS cnt FROM activity_logs "
        "WHERE user_id=%s AND event='assessment_failed' "
        "AND created_at >= NOW() - INTERVAL '7 days'",
        (user_id,),
    )
    failed_attempts = int((failed_row or {}).get("cnt") or 0)

    if redis_client.get(f"user:{user_id}:stagnation_dismissed") == "true":
        return {
            "stagnant": False,
            "reason": None,
            "nudge_message": "",
            "days_inactive": days_inactive,
            "failed_attempts": failed_attempts,
        }

    stagnant = days_inactive >= 3 or failed_attempts >= 3
    reason = None
    if days_inactive >= 3:
        reason = "no_activity_3_days"
    elif failed_attempts >= 3:
        reason = "3_failed_attempts"

    if stagnant:
        existing = fetch_one(
            "SELECT id FROM stagnation_alerts WHERE user_id=%s AND dismissed=FALSE ORDER BY updated_at DESC LIMIT 1",
            (user_id,),
        )
        if not existing:
            nudge = generate_nudge(user_id, reason or "unknown", days_inactive, failed_attempts)
            execute_query(
                "INSERT INTO stagnation_alerts (user_id, reason, nudge_message, days_inactive, failed_attempts, dismissed, updated_at) "
                "VALUES (%s, %s, %s, %s, %s, FALSE, NOW()) "
                "ON CONFLICT (user_id) DO UPDATE SET reason=EXCLUDED.reason, "
                "nudge_message=EXCLUDED.nudge_message, days_inactive=EXCLUDED.days_inactive, "
                "failed_attempts=EXCLUDED.failed_attempts, dismissed=FALSE, updated_at=NOW()",
                (user_id, reason, nudge, days_inactive, failed_attempts),
            )
            redis_client.publish(
                "stagnation_alert",
                json.dumps(
                    {
                        "user_id": user_id,
                        "reason": reason,
                        "days_inactive": days_inactive,
                        "failed_attempts": failed_attempts,
                    }
                ),
            )

    nudge_row = fetch_one(
        "SELECT nudge_message, days_inactive, failed_attempts FROM stagnation_alerts "
        "WHERE user_id=%s AND dismissed=FALSE ORDER BY updated_at DESC LIMIT 1",
        (user_id,),
    )

    return {
        "stagnant": stagnant,
        "reason": reason,
        "nudge_message": (nudge_row or {}).get("nudge_message", ""),
        "days_inactive": int((nudge_row or {}).get("days_inactive", days_inactive)),
        "failed_attempts": int((nudge_row or {}).get("failed_attempts", failed_attempts)),
    }


def generate_nudge(user_id: int, reason: str, days: int, fails: int) -> str:
    user = fetch_one("SELECT goal FROM users WHERE id=%s", (user_id,)) or {}
    goal = user.get("goal") or "Full Stack Dev"

    stuck_row = fetch_one(
        "SELECT module_index FROM module_progress WHERE user_id=%s AND status='in_progress' "
        "ORDER BY last_accessed DESC NULLS LAST LIMIT 1",
        (user_id,),
    )
    module_name = "current module"
    if stuck_row:
        lp_row = fetch_one("SELECT path FROM learning_paths WHERE user_id=%s", (user_id,))
        path = _safe_json_load((lp_row or {}).get("path"), [])
        idx = int(stuck_row.get("module_index") or 0)
        if 0 <= idx < len(path):
            module_name = path[idx].get("module_name") or module_name

    prompt = (
        "A developer on a coding platform is stuck. "
        f"Reason: {reason}. Days inactive: {days}. Failed attempts: {fails}. "
        f"Their goal: {goal}. Stuck on: {module_name}. "
        "Write a short, encouraging nudge message (2-3 sentences). "
        "Be specific, practical, not generic. No emojis."
    )

    try:
        resp = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5,
            max_tokens=140,
        )
        msg = (resp.choices[0].message.content or "").strip()
        if msg:
            return msg
    except Exception:  # noqa: BLE001
        pass
    return "You're close - just 20 minutes today can restart your momentum."


def start_module(user_id: int, module_index: int):
    execute_query(
        "INSERT INTO module_progress (user_id, module_index, status, last_accessed) "
        "VALUES (%s, %s, 'in_progress', NOW()) "
        "ON CONFLICT (user_id, module_index) "
        "DO UPDATE SET status='in_progress', last_accessed=NOW()",
        (user_id, module_index),
    )

    execute_query(
        "INSERT INTO activity_logs (user_id, event, module_index) VALUES (%s, 'module_started', %s)",
        (user_id, module_index),
    )

    today = datetime.now(timezone.utc).date().isoformat()
    last_date_key = f"user:{user_id}:last_activity_date"
    streak_key = f"user:{user_id}:streak"
    last_date = redis_client.get(last_date_key)
    if last_date != today:
        redis_client.incr(streak_key)
        redis_client.set(last_date_key, today)
    redis_client.expire(streak_key, 86400 * 4)
    redis_client.expire(last_date_key, 86400 * 4)

    redis_client.publish(
        "progress_updated",
        json.dumps({"user_id": user_id, "module_index": module_index, "status": "in_progress"}),
    )


def complete_module(user_id: int, module_index: int):
    execute_query(
        "UPDATE module_progress SET status='completed', progress_percent=100, "
        "completed_at=NOW(), last_accessed=NOW() WHERE user_id=%s AND module_index=%s",
        (user_id, module_index),
    )

    execute_query(
        "INSERT INTO activity_logs (user_id, event, module_index) VALUES (%s, 'module_completed', %s)",
        (user_id, module_index),
    )

    completed_row = fetch_one(
        "SELECT COUNT(*) AS cnt FROM module_progress WHERE user_id=%s AND status='completed'",
        (user_id,),
    )
    total_row = fetch_one(
        "SELECT jsonb_array_length(path) AS total FROM learning_paths WHERE user_id=%s",
        (user_id,),
    )
    completed = int((completed_row or {}).get("cnt") or 0)
    total = int((total_row or {}).get("total") or 0)
    if total > 0 and completed == total:
        redis_client.set(f"user:{user_id}:progress", "all_complete")

    redis_client.publish(
        "progress_updated",
        json.dumps({"user_id": user_id, "module_index": module_index, "status": "completed"}),
    )


def generate_intervention(user_id: int) -> dict:
    stuck_row = fetch_one(
        "SELECT module_index FROM module_progress WHERE user_id=%s AND status='in_progress' "
        "ORDER BY last_accessed DESC NULLS LAST LIMIT 1",
        (user_id,),
    )
    if not stuck_row:
        raise ValueError("No in-progress module found")

    module_index = int(stuck_row.get("module_index") or 0)
    lp_row = fetch_one("SELECT path FROM learning_paths WHERE user_id=%s", (user_id,))
    path = _safe_json_load((lp_row or {}).get("path"), [])
    module = path[module_index] if 0 <= module_index < len(path) else {}
    skill = module.get("skill", "Python")

    prompt = (
        f"Generate 1 easier coding question for a developer stuck on {skill}. "
        "Difficulty: beginner. Return JSON: "
        "{title, description, starter_code, expected_output}"
    )
    question = {
        "title": f"{skill} Warm-up",
        "description": f"A beginner-friendly {skill} practice problem.",
        "starter_code": "def solution(*args):\n    pass",
        "expected_output": "Depends on test case",
    }
    try:
        resp = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
            max_tokens=300,
        )
        raw = (resp.choices[0].message.content or "").strip()
        start = raw.find("{")
        end = raw.rfind("}")
        if start != -1 and end != -1 and end > start:
            parsed = json.loads(raw[start : end + 1])
            if isinstance(parsed, dict):
                question = parsed
    except Exception:  # noqa: BLE001
        pass

    redis_client.set(f"user:{user_id}:easier_question", json.dumps(question), ex=3600)
    execute_query(
        "INSERT INTO activity_logs (user_id, event, module_index, metadata) "
        "VALUES (%s, 'intervention_triggered', %s, %s::jsonb)",
        (user_id, module_index, json.dumps({"skill": skill})),
    )
    execute_query("UPDATE stagnation_alerts SET dismissed=TRUE, updated_at=NOW() WHERE user_id=%s", (user_id,))

    return {"message": "Easier assessment ready", "redirected_to": "/assessments"}


def dismiss_alert(user_id: int):
    redis_client.set(f"user:{user_id}:stagnation_dismissed", "true", ex=86400)
    execute_query("UPDATE stagnation_alerts SET dismissed=TRUE, updated_at=NOW() WHERE user_id=%s", (user_id,))


def detect_stagnation(user_id: int) -> dict:
    return check_stagnation(user_id)

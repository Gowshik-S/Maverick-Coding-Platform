import json
import os
import re

import redis
from groq import Groq

from db.database import execute_query, fetch_one
from utils.resource_scraper import fetch_resources

redis_client = redis.Redis(host=os.getenv("REDIS_HOST", "redis"), port=6379, decode_responses=True)
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "llama-3.3-70b-versatile"

TARGET_THRESHOLDS = {
    "Python": 0.8,
    "DSA": 0.7,
    "SQL": 0.7,
    "React": 0.7,
    "System Design": 0.6,
    "Docker": 0.5,
    "AWS": 0.5,
}


def extract_json(text) -> str:
    list_match = re.search(r"\[.*?\]", text, re.DOTALL)
    if list_match:
        return list_match.group(0)
    obj_match = re.search(r"\{.*?\}", text, re.DOTALL)
    if obj_match:
        return obj_match.group(0)
    return text


def call_groq(prompt, model=MODEL) -> str:
    resp = groq_client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=2000,
    )
    return resp.choices[0].message.content


def analyze_skill_gaps(skills: dict) -> dict:
    gaps = {}
    for skill, threshold in TARGET_THRESHOLDS.items():
        gap = threshold - float(skills.get(skill, 0.0) or 0.0)
        if gap > 0.1:
            gaps[skill] = round(gap, 4)
    return dict(sorted(gaps.items(), key=lambda item: item[1], reverse=True))


def _fallback_path(gaps) -> list:
    top = list(gaps.keys())[:4]
    while len(top) < 4:
        top.append("Python")
    return [
        {
            "week": i + 1,
            "module_name": f"{s} Core Concepts",
            "skill": s,
            "estimated_hours": 5,
            "priority": i + 1,
            "difficulty_label": "intermediate",
            "why": f"Gap detected in {s}. Covers core fundamentals.",
            "project": f"Build a mini project using {s}",
            "resources": [],
        }
        for i, s in enumerate(top)
    ]


def generate_learning_path(user_id, skill_gaps, user_goal) -> list:
    if not skill_gaps:
        skill_gaps = {"Python": 0.2}
    gaps_str = ", ".join(f"{s}: {g}" for s, g in list(skill_gaps.items())[:4])

    prompt = (
        "You are a senior learning advisor for a coding platform.\n\n"
        f"User goal: {user_goal}\n"
        f"User skill gaps (skill: gap_size, bigger = more urgent): {gaps_str}\n\n"
        "Create a personalized 4-week learning plan.\n"
        "Return ONLY a valid JSON array of exactly 4 modules. No markdown, no explanation.\n\n"
        "Each module must follow this exact shape:\n"
        "[\n"
        "  {\n"
        '    "week": 1,\n'
        '    "module_name": "Specific descriptive title",\n'
        '    "skill": "skill name",\n'
        '    "estimated_hours": 5,\n'
        '    "priority": 1,\n'
        '    "difficulty_label": "beginner|intermediate|intermediate-advanced|advanced",\n'
        '    "why": "You scored X in SKILL below Y target for GOAL. This covers Z for interviews.",\n'
        '    "project": "One concrete hands-on mini project achievable in a weekend"\n'
        "  }\n"
        "]\n\n"
        "Rules:\n"
        "- Exactly 4 modules, sorted by priority (biggest gap = week 1)\n"
        "- difficulty_label must reflect current skill score (low score = beginner)\n"
        "- why must mention user goal and gap context specifically\n"
        "- project must be concrete and achievable in 1-2 days\n"
        "- If fewer than 4 gaps, repeat top skills at higher difficulty or add Docker/AWS\n"
        "- Only use skills: Python, DSA, SQL, React, System Design, Docker, AWS\n"
        "Return ONLY the JSON array."
    )

    try:
        raw = call_groq(prompt, model=MODEL)
        path = json.loads(extract_json(raw))
        if not isinstance(path, list) or len(path) == 0:
            raise ValueError("Empty path")
    except Exception as e:  # noqa: BLE001
        print(f"[RecommenderAgent] LLM failed ({e}), using fallback")
        path = _fallback_path(skill_gaps)

    print(f"[RecommenderAgent] Fetching live resources for {len(path)} modules...")
    for module in path:
        module["resources"] = fetch_resources(
            module.get("skill", "Python"),
            module.get("difficulty_label", "intermediate"),
            module.get("module_name", ""),
        )
    return path


def save_learning_path(user_id, path):
    execute_query(
        "INSERT INTO learning_paths (user_id, path) VALUES (%s, %s::jsonb) "
        "ON CONFLICT (user_id) DO UPDATE SET path=EXCLUDED.path, updated_at=NOW()",
        (user_id, json.dumps(path)),
    )


def cache_and_emit(user_id, path):
    redis_client.set(f"user:{user_id}:learning_path", json.dumps(path), ex=86400)
    redis_client.set(f"user:{user_id}:progress", "path_generated")
    redis_client.publish(
        "user_learning_path",
        json.dumps(
            {
                "user_id": user_id,
                "event": "user_learning_path",
                "modules": len(path),
                "top_priority_skill": path[0]["skill"] if path else "unknown",
            }
        ),
    )


def run_recommender_agent(user_id: int) -> dict:
    user = fetch_one("SELECT id,skills,goal FROM users WHERE id=%s", (user_id,))
    if not user:
        raise ValueError(f"User {user_id} not found")

    skills = user.get("skills") or {}
    if isinstance(skills, str):
        skills = json.loads(skills)

    gaps = analyze_skill_gaps(skills)
    path = generate_learning_path(user_id, gaps, user.get("goal", "Full Stack Dev"))
    save_learning_path(user_id, path)
    cache_and_emit(user_id, path)
    return {
        "user_id": user_id,
        "learning_path": path,
        "skill_gaps": gaps,
        "total_modules": len(path),
        "estimated_total_hours": sum(m.get("estimated_hours", 5) for m in path),
        "top_skill_to_improve": path[0]["skill"] if path else "Python",
        "next": "tracker",
    }


def manual_override(user_id, module_index, action) -> dict:
    row = fetch_one("SELECT path FROM learning_paths WHERE user_id=%s", (user_id,))
    if not row:
        raise ValueError("No learning path found")

    path = row["path"] if isinstance(row["path"], list) else json.loads(row["path"])
    if module_index < 0 or module_index >= len(path):
        raise ValueError("Invalid module index")

    if action == "skip":
        path.pop(module_index)

    if action == "replace":
        user = fetch_one("SELECT skills,goal FROM users WHERE id=%s", (user_id,))
        skills = user.get("skills") or {}
        if isinstance(skills, str):
            skills = json.loads(skills)

        gaps = analyze_skill_gaps(skills)
        current_skills = [m["skill"] for i, m in enumerate(path) if i != module_index]
        replacement_skill = next((s for s in gaps if s not in current_skills), list(gaps.keys())[0])
        new_module_prompt = (
            f"Generate 1 learning module for skill: {replacement_skill}, "
            f"goal: {user.get('goal', 'Full Stack Dev')}. "
            "Return ONLY a single JSON object with: week,module_name,skill,"
            "estimated_hours,priority,difficulty_label,why,project"
        )
        try:
            raw = call_groq(new_module_prompt)
            new_mod = json.loads(extract_json(raw))
        except Exception:  # noqa: BLE001
            new_mod = {
                "week": module_index + 1,
                "module_name": f"{replacement_skill} Fundamentals",
                "skill": replacement_skill,
                "estimated_hours": 5,
                "priority": module_index + 1,
                "difficulty_label": "intermediate",
                "why": f"Replace with {replacement_skill} module.",
                "project": f"Build a project with {replacement_skill}",
            }
        new_mod["resources"] = fetch_resources(
            replacement_skill,
            new_mod.get("difficulty_label", "intermediate"),
            new_mod.get("module_name", ""),
        )
        path[module_index] = new_mod

    for i, m in enumerate(path):
        m["week"] = i + 1

    save_learning_path(user_id, path)
    redis_client.set(f"user:{user_id}:learning_path", json.dumps(path), ex=86400)
    return {"user_id": user_id, "updated_path": path, "action": action}

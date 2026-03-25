import json
import os
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
from groq import Groq

from db.postgres import execute, fetch_all, fetch_one
from db.redis_client import set_progress

load_dotenv()


def _safe_groq_client() -> Optional[Groq]:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key or api_key == "your_key_here":
        return None
    return Groq(api_key=api_key)


def _extract_json(raw: str) -> Dict[str, Any]:
    cleaned = (raw or "").strip()
    if "```" in cleaned:
        parts = cleaned.split("```")
        if len(parts) >= 2:
            cleaned = parts[1].replace("json", "").strip()
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("No JSON found")
    return json.loads(cleaned[start : end + 1])


def _weak_skills(skills: Dict[str, str]) -> List[str]:
    weak = []
    for skill, level in skills.items():
        if str(level).lower() in {"none", "beginner"}:
            weak.append(skill)
    return weak


def build_learning_path(user_id: int) -> Dict[str, Any]:
    user = fetch_one("SELECT id, skills FROM users WHERE id = %s", (user_id,))
    if not user:
        return {"error": "User not found"}

    skills = user.get("skills") or {}
    if isinstance(skills, str):
        try:
            skills = json.loads(skills)
        except Exception:
            skills = {}

    recent = fetch_all(
        "SELECT score, skill_area, feedback FROM assessments WHERE user_id = %s ORDER BY created_at DESC LIMIT 8",
        (user_id,),
    )

    weak = _weak_skills(skills)
    client = _safe_groq_client()

    if client is None:
        # hardcoded/stub: deterministic path if LLM is unavailable.
        focus = weak[0] if weak else "DSA"
        learning_path = [
            {
                "week": 1,
                "topic": f"{focus} Fundamentals",
                "skill_area": focus,
                "estimated_hours": 6,
                "why": "Weakest area identified from profile",
            },
            {
                "week": 2,
                "topic": "Problem Solving Patterns",
                "skill_area": "DSA",
                "estimated_hours": 7,
                "why": "Strengthen interview problem decomposition",
            },
            {
                "week": 3,
                "topic": "System Design Basics",
                "skill_area": "System Design",
                "estimated_hours": 8,
                "why": "Improve architecture communication",
            },
            {
                "week": 4,
                "topic": "Mock Interview Sprint",
                "skill_area": "Mixed",
                "estimated_hours": 5,
                "why": "Consolidate all improvements",
            },
        ]
    else:
        prompt = {
            "skills": skills,
            "weak_skills": weak,
            "recent_assessments": recent,
            "required_format": {
                "learning_path": [
                    {
                        "week": 1,
                        "topic": "string",
                        "skill_area": "string",
                        "estimated_hours": 6,
                        "why": "string",
                    }
                ]
            },
            "constraints": [
                "Return exactly 4 weeks",
                "Week 1 must target weakest area",
                "Return JSON only",
            ],
        }

        try:
            response = client.chat.completions.create(
                model="qwen/qwen3-32b",
                messages=[
                    {
                        "role": "user",
                        "content": "Create a personalized 4-week coding learning plan in JSON only: "
                        + json.dumps(prompt),
                    }
                ],
                max_tokens=1000,
            )
            raw = response.choices[0].message.content or "{}"
            parsed = _extract_json(raw)
            learning_path = parsed.get("learning_path", [])
            if not isinstance(learning_path, list) or not learning_path:
                raise ValueError("Invalid learning_path")
        except Exception:
            # hardcoded/stub: fallback when generation fails.
            focus = weak[0] if weak else "DSA"
            learning_path = [
                {
                    "week": 1,
                    "topic": f"{focus} Refresh",
                    "skill_area": focus,
                    "estimated_hours": 5,
                    "why": "Most critical gap from profile and assessment",
                },
                {
                    "week": 2,
                    "topic": "Core DSA Patterns",
                    "skill_area": "DSA",
                    "estimated_hours": 6,
                    "why": "Build consistent solving speed",
                },
                {
                    "week": 3,
                    "topic": "Backend Design Drills",
                    "skill_area": "System Design",
                    "estimated_hours": 8,
                    "why": "Prepare for round-2 interviews",
                },
                {
                    "week": 4,
                    "topic": "Timed Practice + Review",
                    "skill_area": "Mixed",
                    "estimated_hours": 6,
                    "why": "Reinforce retention with simulation",
                },
            ]

    execute(
        "INSERT INTO learning_paths (user_id, path) VALUES (%s, %s)",
        (user_id, json.dumps(learning_path)),
    )
    set_progress(user_id, "path_ready")
    return {"learning_path": learning_path}

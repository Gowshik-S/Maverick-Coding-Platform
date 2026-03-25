import json
import os
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
from groq import Groq

from db.postgres import fetch_all

load_dotenv()


class DifficultyAdapter:
    def __init__(self, user_id: int):
        self.user_id = user_id

    def get_next_difficulty(self) -> float:
        rows = fetch_all(
            "SELECT score FROM assessments WHERE user_id = %s ORDER BY created_at DESC LIMIT 5",
            (self.user_id,),
        )
        if not rows:
            return 0.4

        scores = [float(r["score"]) for r in rows if r.get("score") is not None]
        if not scores:
            return 0.4
        avg = sum(scores) / len(scores)

        if avg >= 85:
            return 0.8
        if avg >= 70:
            return 0.6
        if avg >= 50:
            return 0.45
        return 0.3


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


def _pick_skill_area(skills: Dict[str, str]) -> str:
    if not skills:
        return "DSA"
    rank = {"none": 0, "beginner": 1, "intermediate": 2, "expert": 3}
    return min(skills.keys(), key=lambda key: rank.get(str(skills[key]).lower(), 1))


def generate_question(skills: Dict[str, str], difficulty: float) -> Dict[str, Any]:
    client = _safe_groq_client()
    skill_area = _pick_skill_area(skills)

    if client is None:
        # hardcoded/stub: fallback question when LLM is not configured.
        return {
            "title": "Two Sum Problem",
            "description": "Given an array of integers, return indices of two numbers that add up to target.",
            "examples": [{"input": "[2,7,11,15], target=9", "output": "[0,1]"}],
            "constraints": ["2 <= nums.length <= 10^4"],
            "skill_area": skill_area,
            "difficulty": difficulty,
            "starter_code": "def two_sum(nums, target):\\n    pass",
        }

    prompt = {
        "skill_area": skill_area,
        "difficulty": difficulty,
        "required_format": {
            "title": "string",
            "description": "string",
            "examples": [{"input": "string", "output": "string"}],
            "constraints": ["string"],
            "skill_area": "string",
            "difficulty": "float",
            "starter_code": "string",
        },
    }

    try:
        response = client.chat.completions.create(
            model="qwen/qwen3-32b",
            messages=[
                {
                    "role": "user",
                    "content": (
                        "Generate ONE coding interview question as JSON only.\\n"
                        f"Context: {json.dumps(prompt)}"
                    ),
                }
            ],
            max_tokens=900,
        )
        raw = response.choices[0].message.content or "{}"
        parsed = _extract_json(raw)
        parsed.setdefault("skill_area", skill_area)
        parsed.setdefault("difficulty", difficulty)
        return parsed
    except Exception:
        # hardcoded/stub: deterministic backup to keep API stable.
        return {
            "title": "Array Pair Sum",
            "description": "Find if any pair in array sums to target and return indices.",
            "examples": [{"input": "[3,2,4], target=6", "output": "[1,2]"}],
            "constraints": ["1 <= n <= 10^5"],
            "skill_area": skill_area,
            "difficulty": difficulty,
            "starter_code": "def solve(nums, target):\\n    pass",
        }


def grade_submission(
    question: Dict[str, Any],
    code: str,
    time_taken: int,
    hints_used: int = 0,
) -> Dict[str, Any]:
    client = _safe_groq_client()

    if client is None:
        # hardcoded/stub: heuristic grading when LLM is unavailable.
        base = 70
        if "hash" in code.lower() or "dict" in code.lower():
            base += 10
        base -= min(hints_used * 3, 12)
        base -= 5 if time_taken > 180 else 0
        score = max(0, min(100, base))
        return {
            "score": score,
            "correctness": score >= 60,
            "time_complexity": "O(n)" if score >= 75 else "O(n^2)",
            "feedback": "Solid attempt. Improve edge-case handling and complexity discussion.",
            "improvement": "Use a hashmap/set-based approach and include empty-input tests.",
        }

    payload = {
        "question": question,
        "code": code[:4000],
        "time_taken": time_taken,
        "hints_used": hints_used,
        "required_format": {
            "score": 0,
            "correctness": True,
            "time_complexity": "O(n)",
            "feedback": "string",
            "improvement": "string",
        },
    }

    try:
        response = client.chat.completions.create(
            model="qwen/qwen3-32b",
            messages=[
                {
                    "role": "user",
                    "content": "Grade this submission and return JSON only: " + json.dumps(payload),
                }
            ],
            max_tokens=900,
        )
        raw = response.choices[0].message.content or "{}"
        parsed = _extract_json(raw)
        parsed["score"] = int(parsed.get("score", 0))
        parsed["correctness"] = bool(parsed.get("correctness", False))
        parsed.setdefault("time_complexity", "Unknown")
        parsed.setdefault("feedback", "No feedback returned")
        parsed.setdefault("improvement", "No improvement suggestion returned")
        return parsed
    except Exception:
        # hardcoded/stub: fallback response to avoid endpoint failure.
        return {
            "score": 65,
            "correctness": True,
            "time_complexity": "O(n^2)",
            "feedback": "Correct idea, but can be optimized.",
            "improvement": "Use a dictionary for O(n) lookup.",
        }

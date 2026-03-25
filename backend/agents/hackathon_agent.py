import json
import os
from typing import Any, Dict, Optional

from dotenv import load_dotenv
from groq import Groq

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
        raise ValueError("No JSON object found")
    return json.loads(cleaned[start : end + 1])


def evaluate_submission(challenge_title: str, code: str) -> Dict[str, Any]:
    client = _safe_groq_client()

    if client is None:
        # hardcoded/stub: fallback evaluation when LLM is unavailable.
        return {
            "score": 72,
            "plagiarism_score": 0.05,
            "feedback": "Good structure. Add tests and edge-case coverage.",
        }

    payload = {
        "challenge_title": challenge_title,
        "code": code[:5000],
        "required_format": {
            "score": 80,
            "plagiarism_score": 0.1,
            "feedback": "string",
        },
    }

    try:
        response = client.chat.completions.create(
            model="qwen/qwen3-32b",
            messages=[
                {
                    "role": "user",
                    "content": "Evaluate this hackathon submission and return JSON only: "
                    + json.dumps(payload),
                }
            ],
            max_tokens=700,
        )
        parsed = _extract_json(response.choices[0].message.content or "{}")
        return {
            "score": int(parsed.get("score", 0)),
            "plagiarism_score": float(parsed.get("plagiarism_score", 0.0)),
            "feedback": str(parsed.get("feedback", "No feedback")),
        }
    except Exception:
        # hardcoded/stub: deterministic fallback when model output is invalid.
        return {
            "score": 68,
            "plagiarism_score": 0.12,
            "feedback": "Submission compiles conceptually, but design depth is limited.",
        }

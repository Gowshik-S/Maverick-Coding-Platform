import json
import os
from typing import Dict, List, Optional

import spacy
from dotenv import load_dotenv
from groq import Groq

from db.postgres import execute
from db.redis_client import set_progress

load_dotenv()


SKILL_KEYWORDS = [
    "python",
    "javascript",
    "typescript",
    "java",
    "c++",
    "c#",
    "golang",
    "rust",
    "react",
    "vue",
    "angular",
    "node",
    "django",
    "fastapi",
    "flask",
    "spring",
    "sql",
    "postgresql",
    "mongodb",
    "redis",
    "elasticsearch",
    "docker",
    "kubernetes",
    "aws",
    "gcp",
    "azure",
    "terraform",
    "machine learning",
    "deep learning",
    "nlp",
    "data science",
    "pandas",
    "numpy",
    "data structures",
    "algorithms",
    "dynamic programming",
    "system design",
    "rest api",
]


def _safe_nlp_model() -> Optional[spacy.language.Language]:
    try:
        return spacy.load("en_core_web_sm")
    except Exception:
        return None


def _safe_groq_client() -> Optional[Groq]:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key or api_key == "your_key_here":
        return None
    return Groq(api_key=api_key)


def extract_raw_skills(resume_text: str) -> List[str]:
    text_lower = resume_text.lower()
    _ = _safe_nlp_model()  # Optional NLP loading; keyword extraction is primary.
    return [skill for skill in SKILL_KEYWORDS if skill in text_lower]


def _extract_json(raw: str) -> Dict[str, str]:
    cleaned = raw.strip()
    if "```" in cleaned:
        parts = cleaned.split("```")
        if len(parts) >= 2:
            cleaned = parts[1].replace("json", "").strip()
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("No JSON object found")
    return json.loads(cleaned[start : end + 1])


def analyze_with_llm(resume_text: str, found_skills: List[str]) -> Dict[str, str]:
    client = _safe_groq_client()
    if client is None:
        # hardcoded/stub: offline fallback when GROQ_API_KEY is missing.
        return {skill.title(): "intermediate" for skill in found_skills[:8]}

    try:
        response = client.chat.completions.create(
            model="qwen/qwen3-32b",
            messages=[
                {
                    "role": "user",
                    "content": (
                        "Analyze this resume and return ONLY a JSON object.\\n"
                        f"Resume: {resume_text[:2000]}\\n"
                        f"Skills found: {found_skills}\\n"
                        "Return format:\\n"
                        "{\\n"
                        '  \"Python\": \"expert\",\\n'
                        '  \"DSA\": \"beginner\",\\n'
                        '  \"System Design\": \"none\"\\n'
                        "}\\n"
                        'Use only these values: \"expert\", \"intermediate\", \"beginner\", \"none\".'
                    ),
                }
            ],
            max_tokens=500,
        )
        raw = response.choices[0].message.content or "{}"
        parsed = _extract_json(raw)
        if isinstance(parsed, dict):
            return {str(k): str(v) for k, v in parsed.items()}
    except Exception:
        pass

    # hardcoded/stub: graceful fallback if LLM call fails or returns invalid JSON.
    return {skill.title(): "intermediate" for skill in found_skills[:8]}


def run_profile_agent(
    resume_text: str,
    user_id: Optional[int] = None,
    dry_run: bool = False,
) -> Dict[str, str]:
    raw_skills = extract_raw_skills(resume_text)
    skills = analyze_with_llm(resume_text, raw_skills)

    if dry_run or user_id is None:
        return skills

    execute("UPDATE users SET skills = %s WHERE id = %s", (json.dumps(skills), user_id))
    set_progress(user_id, "profile_complete")
    return skills

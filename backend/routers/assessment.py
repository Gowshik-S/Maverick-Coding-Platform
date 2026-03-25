import json

from fastapi import APIRouter
from pydantic import BaseModel

from agents.assessment_agent import DifficultyAdapter, generate_question, grade_submission
from agents.recommender_agent import build_learning_path
from db.postgres import execute, fetch_one
from db.redis_client import (
    get_question,
    set_progress,
    set_question,
    update_leaderboard,
)

router = APIRouter()


class SubmitRequest(BaseModel):
    code: str
    time_taken: int
    hints_used: int = 0


@router.get("/assessment/{user_id}")
async def get_assessment_question(user_id: int):
    user = fetch_one("SELECT id, skills FROM users WHERE id = %s", (user_id,))
    if not user:
        return {"error": "User not found"}

    skills = user.get("skills") or {}
    if isinstance(skills, str):
        try:
            skills = json.loads(skills)
        except Exception:
            skills = {}

    difficulty = DifficultyAdapter(user_id).get_next_difficulty()
    question = generate_question(skills, difficulty)

    set_question(user_id, question)
    set_progress(user_id, "assessment_ready")
    return question


@router.post("/submit/{user_id}")
async def submit_code(user_id: int, body: SubmitRequest):
    user = fetch_one("SELECT id FROM users WHERE id = %s", (user_id,))
    if not user:
        return {"error": "User not found"}

    question = get_question(user_id)
    if not question:
        # hardcoded/stub: stable fallback if no cached question exists.
        question = {
            "title": "Warm-up Question",
            "description": "Return sum of two numbers.",
            "skill_area": "DSA",
            "difficulty": 0.3,
            "starter_code": "def solve(a, b):\\n    pass",
        }

    result = grade_submission(
        question=question,
        code=body.code,
        time_taken=body.time_taken,
        hints_used=body.hints_used,
    )

    execute(
        """
        INSERT INTO assessments (
            user_id, question, user_code, score, feedback, improvement,
            skill_area, difficulty, time_taken, hints_used
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (
            user_id,
            question.get("description", ""),
            body.code,
            int(result.get("score", 0)),
            result.get("feedback", ""),
            result.get("improvement", ""),
            question.get("skill_area", "DSA"),
            float(question.get("difficulty", 0.4)),
            body.time_taken,
            body.hints_used,
        ),
    )

    update_leaderboard(user_id, int(result.get("score", 0)))
    set_progress(user_id, "skills_evaluated")
    return result


@router.get("/learning-path/{user_id}")
async def get_learning_path(user_id: int):
    path = build_learning_path(user_id)
    return path

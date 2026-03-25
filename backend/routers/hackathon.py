import json

from fastapi import APIRouter
from pydantic import BaseModel

from agents.hackathon_agent import evaluate_submission
from db.postgres import execute, fetch_all, fetch_one

router = APIRouter()


class HackathonCreate(BaseModel):
    title: str
    theme: str | None = None
    duration_hours: int = 36
    organizer_id: int | None = None


class HackathonSubmit(BaseModel):
    user_id: int
    challenge_title: str
    code: str


@router.post("/hackathon")
async def create_hackathon(body: HackathonCreate):
    hackathon_id = execute(
        """
        INSERT INTO hackathons (title, theme, duration_hours, organizer_id)
        VALUES (%s, %s, %s, %s)
        RETURNING id
        """,
        (body.title, body.theme, body.duration_hours, body.organizer_id),
    )
    return {
        "hackathon_id": hackathon_id,
        "message": "Hackathon created",
    }


@router.get("/hackathon")
async def list_hackathons():
    rows = fetch_all(
        """
        SELECT id, title, theme, duration_hours, status, created_at
        FROM hackathons
        ORDER BY created_at DESC
        """
    )
    return [dict(row) for row in rows]


@router.post("/hackathon/{hackathon_id}/submit")
async def submit_hackathon_solution(hackathon_id: int, body: HackathonSubmit):
    hk = fetch_one("SELECT id FROM hackathons WHERE id = %s", (hackathon_id,))
    if not hk:
        return {"error": "Hackathon not found"}

    evaluation = evaluate_submission(body.challenge_title, body.code)

    submission_id = execute(
        """
        INSERT INTO hackathon_submissions (
            hackathon_id, user_id, code, challenge_title, score,
            plagiarism_score, feedback
        ) VALUES (%s, %s, %s, %s, %s, %s, %s)
        RETURNING id
        """,
        (
            hackathon_id,
            body.user_id,
            body.code,
            body.challenge_title,
            int(evaluation.get("score", 0)),
            float(evaluation.get("plagiarism_score", 0.0)),
            evaluation.get("feedback", ""),
        ),
    )

    return {
        "submission_id": submission_id,
        "hackathon_id": hackathon_id,
        "evaluation": evaluation,
    }


@router.get("/hackathon/{hackathon_id}/submissions")
async def get_hackathon_submissions(hackathon_id: int):
    rows = fetch_all(
        """
        SELECT id, user_id, challenge_title, score, plagiarism_score, feedback, submitted_at
        FROM hackathon_submissions
        WHERE hackathon_id = %s
        ORDER BY submitted_at DESC
        """,
        (hackathon_id,),
    )
    return [dict(row) for row in rows]

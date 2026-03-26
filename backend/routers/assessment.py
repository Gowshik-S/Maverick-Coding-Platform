from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from agents.assessment_agent import handle_assessment_next_step, queue_or_get_assessment, submit_assessment
from db.postgres import fetch_one

router = APIRouter()


class SubmitRequest(BaseModel):
    code: str
    time_taken: int = 0
    hints_used: int = 0


class NextStepRequest(BaseModel):
    action: str


@router.get("/assessment/{user_id}")
async def get_assessment_question(user_id: int):
    result = queue_or_get_assessment(user_id)
    if result.get("error") == "User not found":
        raise HTTPException(status_code=404, detail="User not found")
    return result


@router.post("/submit/{user_id}")
async def submit_code(user_id: int, body: SubmitRequest):
    user = fetch_one("SELECT id FROM users WHERE id = %s", (user_id,))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    result = submit_assessment(
        user_id=user_id,
        user_code=body.code,
        time_taken=body.time_taken,
        hints_used=body.hints_used,
    )
    if result.get("error") == "No active assessment":
        raise HTTPException(status_code=400, detail="No active assessment")
    return result


@router.post("/assessment/{user_id}/next")
async def next_assessment_step(user_id: int, body: NextStepRequest):
    user = fetch_one("SELECT id FROM users WHERE id = %s", (user_id,))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    result = handle_assessment_next_step(user_id=user_id, action=body.action)
    if result.get("error") == "Invalid action":
        raise HTTPException(status_code=400, detail="Invalid action")
    if result.get("error") == "User not found":
        raise HTTPException(status_code=404, detail="User not found")
    return result

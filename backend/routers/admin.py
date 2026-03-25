from fastapi import APIRouter

from agents.tracker_agent import detect_stagnation
from db.postgres import fetch_all, fetch_one

router = APIRouter()


@router.get("/admin/stats")
async def admin_stats():
    users = fetch_one("SELECT COUNT(*) AS count FROM users")
    assessments = fetch_one("SELECT COUNT(*) AS count FROM assessments")
    hackathons = fetch_one("SELECT COUNT(*) AS count FROM hackathons")

    return {
        "users": int(users["count"] if users else 0),
        "assessments": int(assessments["count"] if assessments else 0),
        "hackathons": int(hackathons["count"] if hackathons else 0),
    }


@router.get("/admin/users")
async def admin_users():
    rows = fetch_all(
        "SELECT id, name, email, created_at FROM users ORDER BY created_at DESC"
    )
    return [dict(row) for row in rows]


@router.get("/admin/stagnation/{user_id}")
async def admin_stagnation(user_id: int):
    return detect_stagnation(user_id)

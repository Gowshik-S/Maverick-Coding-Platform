import asyncio
from typing import Dict, List

from fastapi import APIRouter, WebSocket

from db.postgres import fetch_all
from db.redis_client import get_leaderboard as redis_get_leaderboard
from db.redis_client import get_progress

router = APIRouter()


def _badges(rank: int) -> str:
    if rank == 1:
        return "🥇"
    if rank == 2:
        return "🥈"
    if rank == 3:
        return "🥉"
    return ""


@router.get("/leaderboard")
async def get_leaderboard():
    entries = redis_get_leaderboard(top_n=10)
    if not entries:
        # hardcoded/stub: empty-state response before first submissions.
        return []

    user_ids = [int(uid) for uid, _ in entries]
    users = fetch_all(
        "SELECT id, name FROM users WHERE id = ANY(%s)",
        (user_ids,),
    )
    user_map: Dict[int, str] = {int(row["id"]): row["name"] for row in users}

    result: List[Dict[str, object]] = []
    for index, (uid, score) in enumerate(entries, start=1):
        user_id = int(uid)
        result.append(
            {
                "rank": index,
                "name": user_map.get(user_id, f"User {user_id}"),
                "score": int(score),
                "badge": _badges(index),
            }
        )
    return result


@router.websocket("/ws/{user_id}")
async def websocket_progress(websocket: WebSocket, user_id: int):
    await websocket.accept()
    last_progress = None

    while True:
        progress = get_progress(user_id)
        if progress != last_progress:
            await websocket.send_json({"progress": progress, "user_id": user_id})
            last_progress = progress

        if progress == "path_ready":
            await websocket.close()
            break

        await asyncio.sleep(1)

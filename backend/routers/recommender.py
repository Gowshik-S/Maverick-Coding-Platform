import json
import os

import redis
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from agents.recommender_agent import manual_override, run_recommender_agent
from db.database import fetch_one

router = APIRouter()
redis_client = redis.Redis(host=os.getenv("REDIS_HOST", "redis"), port=6379, decode_responses=True)


class OverrideRequest(BaseModel):
    module_index: int
    action: str


class GenerateRequest(BaseModel):
    force: bool = True


@router.get("/api/learning-path/{user_id}")
async def get_learning_path(user_id: int):
    cached = redis_client.get(f"user:{user_id}:learning_path")
    if cached:
        return {"user_id": user_id, "learning_path": json.loads(cached), "source": "cache"}
    try:
        return run_recommender_agent(user_id)
    except ValueError as e:
        detail = str(e)
        if "not found" in detail.lower():
            raise HTTPException(status_code=404, detail=detail)
        raise HTTPException(status_code=500, detail=detail)
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/api/learning-path/{user_id}/status")
async def get_path_status(user_id: int):
    row = fetch_one("SELECT path FROM learning_paths WHERE user_id=%s", (user_id,))
    if not row:
        return {
            "user_id": user_id,
            "generated": False,
            "modules": 0,
            "top_skill": None,
            "progress": redis_client.get(f"user:{user_id}:progress"),
            "path": [],
        }

    path = row["path"] if isinstance(row["path"], list) else json.loads(row["path"])
    return {
        "user_id": user_id,
        "generated": True,
        "modules": len(path),
        "top_skill": path[0]["skill"] if path else None,
        "progress": redis_client.get(f"user:{user_id}:progress"),
        "path": path,
    }


@router.post("/api/learning-path/{user_id}/generate")
async def generate_learning_path(user_id: int, body: GenerateRequest | None = None):
    force = True if body is None else bool(body.force)
    if force:
        redis_client.delete(f"user:{user_id}:learning_path")
    try:
        result = run_recommender_agent(user_id)
        return {**result, "source": "generated"}
    except ValueError as e:
        detail = str(e)
        if "not found" in detail.lower():
            raise HTTPException(status_code=404, detail=detail)
        raise HTTPException(status_code=500, detail=detail)
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/api/learning-path/{user_id}/override")
async def override_module(user_id: int, body: OverrideRequest):
    if body.action not in ["skip", "replace"]:
        raise HTTPException(status_code=400, detail="action must be 'skip' or 'replace'")
    try:
        return manual_override(user_id, body.module_index, body.action)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=str(e))

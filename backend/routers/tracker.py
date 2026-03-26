import json
import os

import redis
from fastapi import APIRouter, HTTPException

from agents.tracker_agent import (
    check_stagnation,
    complete_module,
    dismiss_alert,
    generate_intervention,
    get_progress,
    get_summary,
    start_module,
)
from db.postgres import fetch_one

router = APIRouter()
redis_client = redis.Redis(host=os.getenv("REDIS_HOST", "redis"), port=6379, decode_responses=True)


@router.get("/tracker/{user_id}/summary")
async def tracker_summary(user_id: int):
    try:
        return get_summary(user_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/tracker/{user_id}/progress")
async def tracker_progress(user_id: int):
    return get_progress(user_id)


@router.get("/tracker/{user_id}/stagnation")
async def tracker_stagnation(user_id: int):
    return check_stagnation(user_id)


@router.post("/tracker/{user_id}/module/{module_index}/start")
async def tracker_start_module(user_id: int, module_index: int):
    user = fetch_one("SELECT id FROM users WHERE id=%s", (user_id,))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    start_module(user_id, module_index)
    return {"message": "Module started", "module_index": module_index}


@router.post("/tracker/{user_id}/module/{module_index}/complete")
async def tracker_complete_module(user_id: int, module_index: int):
    user = fetch_one("SELECT id FROM users WHERE id=%s", (user_id,))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    complete_module(user_id, module_index)
    return {"message": "Module completed", "module_index": module_index}


@router.post("/tracker/{user_id}/intervention")
async def tracker_intervention(user_id: int):
    try:
        return generate_intervention(user_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/tracker/{user_id}/dismiss-alert")
async def tracker_dismiss(user_id: int):
    dismiss_alert(user_id)
    return {"message": "Alert dismissed"}


@router.delete("/learning-path/{user_id}/cache")
async def clear_learning_path_cache(user_id: int):
    redis_client.delete(f"user:{user_id}:learning_path")
    redis_client.delete(f"user:{user_id}:progress")
    redis_client.delete(f"user:{user_id}:easier_question")
    return {"message": "Cache cleared"}

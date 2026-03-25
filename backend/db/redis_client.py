import json
import os
from typing import Any, Dict, Optional

import redis
from dotenv import load_dotenv

load_dotenv()

redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
client = redis.Redis.from_url(redis_url, decode_responses=True)


def set_progress(user_id: int, step: str) -> None:
    client.set(f"user:{user_id}:progress", step)


def get_progress(user_id: int) -> Optional[str]:
    return client.get(f"user:{user_id}:progress")


def set_question(user_id: int, question: Dict[str, Any]) -> None:
    client.set(f"user:{user_id}:current_question", json.dumps(question), ex=3600)


def get_question(user_id: int) -> Optional[Dict[str, Any]]:
    data = client.get(f"user:{user_id}:current_question")
    return json.loads(data) if data else None


def update_leaderboard(user_id: int, score: int) -> None:
    client.zadd("leaderboard", {str(user_id): score})


def get_leaderboard(top_n: int = 10):
    return client.zrevrange("leaderboard", 0, top_n - 1, withscores=True)

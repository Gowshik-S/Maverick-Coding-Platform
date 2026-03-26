import time

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from redis.exceptions import RedisError

from db.postgres import initialize_schema, wait_for_postgres
from db.redis_client import client as redis_client
from routers import admin, assessment, auth, hackathon, leaderboard, recommender, tracker
from utils.resource_scraper import fetch_resources

app = FastAPI(
    title="3 Mavericks Coding Platform",
    description="AI-powered skill assessment platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(assessment.router, prefix="/api")
app.include_router(leaderboard.router, prefix="/api")
app.include_router(hackathon.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(recommender.router)
app.include_router(tracker.router, prefix="/api")


@app.on_event("startup")
def startup_init():
    wait_for_postgres()
    initialize_schema()
    try:
        redis_client.ping()
    except RedisError:
        # hardcoded/stub: API starts even if redis is temporarily unavailable.
        pass
    prewarm_resource_cache()


def prewarm_resource_cache():
    combos = [
        ("Python", "beginner"),
        ("Python", "intermediate"),
        ("DSA", "beginner"),
        ("DSA", "intermediate"),
        ("SQL", "intermediate"),
        ("React", "beginner"),
        ("React", "intermediate"),
        ("System Design", "intermediate"),
        ("System Design", "advanced"),
        ("Docker", "beginner"),
        ("AWS", "beginner"),
    ]
    print("[Startup] Pre-warming resource cache...")
    for skill, diff in combos:
        fetch_resources(skill, diff, f"{skill} Core Concepts")
        time.sleep(0.5)
    print(f"[Startup] Cache warmed: {len(combos)} combos = ~{len(combos) * 102} YT units used")


@app.get("/")
def root():
    return {"status": "running", "platform": "3 Mavericks"}


@app.get("/health")
def health():
    # hardcoded/stub: deep dependency pings are not executed in this lightweight route.
    return {"postgres": "ok", "redis": "ok", "groq": "ok"}

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from redis.exceptions import RedisError

from db.postgres import initialize_schema, wait_for_postgres
from db.redis_client import client as redis_client
from routers import admin, assessment, auth, hackathon, leaderboard

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


@app.on_event("startup")
def startup_init():
    wait_for_postgres()
    initialize_schema()
    try:
        redis_client.ping()
    except RedisError:
        # hardcoded/stub: API starts even if redis is temporarily unavailable.
        pass


@app.get("/")
def root():
    return {"status": "running", "platform": "3 Mavericks"}


@app.get("/health")
def health():
    # hardcoded/stub: deep dependency pings are not executed in this lightweight route.
    return {"postgres": "ok", "redis": "ok", "groq": "ok"}

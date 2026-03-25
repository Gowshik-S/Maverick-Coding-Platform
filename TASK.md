# 🚀 TASK.MD — Mavericks Coding Platform
## Revised Build Plan: Routes → DB → Agent → UI → Test → Repeat
> Updated: 25 March 2026 | Deadline: 11:30 Pm Today

---

## 🏗️ PHASE 0 — Project Foundation
**Goal: Folder structure + dependencies + Docker running**
**Time: 1 hr**

### 0.1 Folder Structure
```
coding-platform/
├── backend/
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── profile_agent.py
│   │   ├── assessment_agent.py
│   │   └── recommender_agent.py
│   ├── db/
│   │   ├── __init__.py
│   │   ├── postgres.py
│   │   └── redis_client.py
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── assessment.py
│   │   └── leaderboard.py
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml
└── .env
```

### 0.2 Install Dependencies
```bash
python -m venv venv && source venv/bin/activate
pip install fastapi uvicorn groq spacy psycopg2-binary \
            redis python-multipart python-dotenv crewai asyncpg
python -m spacy download en_core_web_sm
```

### 0.3 .env File
```
GROQ_API_KEY=your_key_here
POSTGRES_URL=postgresql://admin:admin123@localhost:5432/coding_platform
REDIS_URL=redis://localhost:6379
```

### 0.4 Docker Compose
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: coding_platform
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: admin123
    ports: ["5432:5432"]
    volumes: ["pgdata:/var/lib/postgresql/data"]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

volumes:
  pgdata:
```
```bash
docker-compose up -d
```

### ✅ Phase 0 Done When:
- [ ] `docker ps` shows postgres + redis running
- [ ] `uvicorn main:app --reload` starts without error
- [ ] `.env` file has all keys filled

---

## ⚙️ PHASE 1 — FastAPI Skeleton Routes (Stubs Only)
**Goal: All routes defined, return mock data, frontend can connect**
**Time: 1.5 hrs**

> Build ALL routes as stubs first. No agent logic yet.
> Frontend team can connect immediately after this phase.

### 1.1 main.py — App Entry Point
```python
# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, assessment, leaderboard

app = FastAPI(title="3 Mavericks Coding Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth.router, prefix="/api")
app.include_router(assessment.router, prefix="/api")
app.include_router(leaderboard.router, prefix="/api")

@app.get("/")
def root():
    return {"status": "running", "platform": "3 Mavericks"}
```

### 1.2 Auth Router — Stub
```python
# backend/routers/auth.py
from fastapi import APIRouter, UploadFile, File, Form
router = APIRouter()

@router.post("/register")
async def register(
    name: str = Form(...),
    email: str = Form(...),
    resume: UploadFile = File(...)
):
    # STUB — real logic added in Phase 3
    return {
        "user_id": 1,
        "name": name,
        "email": email,
        "skills": {
            "Python": "expert",
            "DSA": "beginner",
            "System Design": "none"
        },
        "message": "Profile created successfully"
    }

@router.get("/user/{user_id}")
async def get_user(user_id: int):
    # STUB
    return {
        "user_id": user_id,
        "name": "Test User",
        "skills": {"Python": "expert", "DSA": "beginner"},
        "progress": "assessment_ready"
    }
```

### 1.3 Assessment Router — Stub
```python
# backend/routers/assessment.py
from fastapi import APIRouter
from pydantic import BaseModel
router = APIRouter()

class SubmitRequest(BaseModel):
    code: str
    time_taken: int
    hints_used: int = 0

@router.get("/assessment/{user_id}")
async def get_question(user_id: int):
    # STUB
    return {
        "title": "Two Sum Problem",
        "description": "Given an array of integers, return indices of two numbers that add up to target.",
        "examples": [{"input": "[2,7,11,15], target=9", "output": "[0,1]"}],
        "constraints": ["2 <= nums.length <= 10^4"],
        "skill_area": "DSA",
        "difficulty": 0.4,
        "starter_code": "def two_sum(nums, target):\n    pass"
    }

@router.post("/submit/{user_id}")
async def submit_code(user_id: int, body: SubmitRequest):
    # STUB
    return {
        "score": 75,
        "correctness": True,
        "time_complexity": "O(n)",
        "feedback": "Good solution! Consider using a hashmap for O(n) time.",
        "improvement": "Use dictionary to reduce time complexity"
    }

@router.get("/learning-path/{user_id}")
async def get_learning_path(user_id: int):
    # STUB
    return {
        "learning_path": [
            {"week": 1, "topic": "Arrays & HashMaps", "skill_area": "DSA",
             "estimated_hours": 5, "why": "Your weakest area based on assessment"},
            {"week": 2, "topic": "Linked Lists & Stacks", "skill_area": "DSA",
             "estimated_hours": 6, "why": "Foundation for advanced DSA"},
            {"week": 3, "topic": "Trees & Graphs", "skill_area": "DSA",
             "estimated_hours": 8, "why": "Most common interview topics"},
            {"week": 4, "topic": "System Design Basics", "skill_area": "System Design",
             "estimated_hours": 10, "why": "Critical gap identified in your profile"}
        ]
    }
```

### 1.4 Leaderboard Router — Stub
```python
# backend/routers/leaderboard.py
from fastapi import APIRouter, WebSocket
import asyncio
router = APIRouter()

@router.get("/leaderboard")
async def get_leaderboard():
    # STUB
    return [
        {"rank": 1, "name": "Alice", "score": 92, "badge": "🥇"},
        {"rank": 2, "name": "Bob", "score": 85, "badge": "🥈"},
        {"rank": 3, "name": "Charlie", "score": 78, "badge": "🥉"},
        {"rank": 4, "name": "Test User", "score": 75, "badge": ""},
    ]

@router.websocket("/ws/{user_id}")
async def websocket_progress(websocket: WebSocket, user_id: int):
    await websocket.accept()
    steps = ["profile_complete", "assessment_ready", "skills_evaluated", "path_ready"]
    for step in steps:
        await websocket.send_json({"progress": step, "user_id": user_id})
        await asyncio.sleep(2)
    await websocket.close()
```

### ✅ Phase 1 Done When:
- [ ] `uvicorn main:app --reload` runs without error
- [ ] `GET http://localhost:8000/` returns `{"status": "running"}`
- [ ] `POST /api/register` returns mock skills JSON
- [ ] `GET /api/assessment/1` returns mock question
- [ ] `POST /api/submit/1` returns mock score
- [ ] `GET /api/learning-path/1` returns mock path
- [ ] `GET /api/leaderboard` returns mock list
- [ ] Frontend team can now connect and test UI

---

## 🗄️ PHASE 2 — Database Layer
**Goal: Real DB connected, schema created, helpers built**
**Time: 1 hr**

### 2.1 DB Helper — postgres.py
```python
# backend/db/postgres.py
import psycopg2
import psycopg2.extras
import os
from dotenv import load_dotenv
load_dotenv()

def get_connection():
    return psycopg2.connect(os.getenv("POSTGRES_URL"))

def fetch_one(query: str, params=None):
    with get_connection() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(query, params)
            return cur.fetchone()

def fetch_all(query: str, params=None):
    with get_connection() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(query, params)
            return cur.fetchall()

def execute(query: str, params=None):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query, params)
            conn.commit()
            if "RETURNING" in query.upper():
                return cur.fetchone()[0]
```

### 2.2 Redis Helper — redis_client.py
```python
# backend/db/redis_client.py
import redis
import os
from dotenv import load_dotenv
load_dotenv()

client = redis.Redis.from_url(os.getenv("REDIS_URL"), decode_responses=True)

def set_progress(user_id: int, step: str):
    client.set(f"user:{user_id}:progress", step)

def get_progress(user_id: int):
    return client.get(f"user:{user_id}:progress")

def set_question(user_id: int, question: dict):
    import json
    client.set(f"user:{user_id}:current_question", json.dumps(question), ex=3600)

def get_question(user_id: int):
    import json
    data = client.get(f"user:{user_id}:current_question")
    return json.loads(data) if data else None

def update_leaderboard(user_id: int, score: int):
    client.zadd("leaderboard", {str(user_id): score})

def get_leaderboard(top_n: int = 10):
    return client.zrevrange("leaderboard", 0, top_n - 1, withscores=True)
```

### 2.3 Run Schema SQL
```sql
-- Run in PostgreSQL
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    resume_text TEXT,
    skills JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE assessments (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    question TEXT,
    user_code TEXT,
    score INT,
    feedback TEXT,
    improvement TEXT,
    skill_area VARCHAR(50),
    difficulty FLOAT DEFAULT 0.5,
    time_taken INT,
    hints_used INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE learning_paths (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    path JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### ✅ Phase 2 Done When:
- [ ] `fetch_one("SELECT 1")` returns without error
- [ ] `redis_client.client.ping()` returns True
- [ ] All 3 tables created in PostgreSQL
- [ ] Insert a test user → verify it saves

---

## 👤 PHASE 3 — Profile Agent + Route Integration
**Goal: Real resume → real skills via Groq → saved to DB**
**Time: 2.5 hrs**

### 3.1 Build Profile Agent
```python
# backend/agents/profile_agent.py
import spacy, os, json
from groq import Groq
from db.postgres import execute, fetch_one
from db.redis_client import set_progress
from dotenv import load_dotenv
load_dotenv()

nlp = spacy.load("en_core_web_sm")
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SKILL_KEYWORDS = [
    "python","javascript","typescript","java","c++","c#","golang","rust",
    "react","vue","angular","node","django","fastapi","flask","spring",
    "sql","postgresql","mongodb","redis","elasticsearch",
    "docker","kubernetes","aws","gcp","azure","terraform",
    "machine learning","deep learning","nlp","data science","pandas","numpy",
    "data structures","algorithms","dynamic programming","system design","rest api"
]

def extract_raw_skills(resume_text: str) -> list:
    text_lower = resume_text.lower()
    return [skill for skill in SKILL_KEYWORDS if skill in text_lower]

def analyze_with_llm(resume_text: str, found_skills: list) -> dict:
    try:
        response = client.chat.completions.create(
            model="qwen/qwen3-32b",
            messages=[{
                "role": "user",
                "content": f"""Analyze this resume. Return ONLY a JSON object.
Resume: {resume_text[:2000]}
Skills found: {found_skills}

Return format (only JSON, no text before or after):
{{
  "Python": "expert",
  "DSA": "beginner",
  "System Design": "none"
}}
Use only: "expert", "intermediate", "beginner", "none"""
            }],
            max_tokens=500
        )
        raw = response.choices[0].message.content.strip()
        # Extract JSON if wrapped in markdown
        if "```" in raw:
            raw = raw.split("```")[1].replace("json","").strip()
        return json.loads(raw)
    except Exception as e:
        # Fallback: assign intermediate to all found skills
        return {skill.title(): "intermediate" for skill in found_skills[:8]}

def run_profile_agent(resume_text: str, user_id: int) -> dict:
    raw_skills = extract_raw_skills(resume_text)
    skills = analyze_with_llm(resume_text, raw_skills)

    execute(
        "UPDATE users SET skills = %s WHERE id = %s",
        (json.dumps(skills), user_id)
    )
    set_progress(user_id, "profile_complete")
    return skills
```

### 3.2 Update Auth Router — Replace Stub with Real Logic
```python
# backend/routers/auth.py — UPDATED (replace stub)
from fastapi import APIRouter, UploadFile, File, Form
from db.postgres import execute, fetch_one
from agents.profile_agent import run_profile_agent
router = APIRouter()

@router.post("/register")
async def register(
    name: str = Form(...),
    email: str = Form(...),
    resume: UploadFile = File(...)
):
    resume_text = (await resume.read()).decode("utf-8", errors="ignore")

    # Save user to DB
    user_id = execute(
        "INSERT INTO users (name, email, resume_text) VALUES (%s, %s, %s) RETURNING id",
        (name, email, resume_text)
    )

    # Run Profile Agent
    skills = run_profile_agent(resume_text, user_id)

    return {
        "user_id": user_id,
        "name": name,
        "skills": skills,
        "message": "Profile created successfully"
    }

@router.get("/user/{user_id}")
async def get_user(user_id: int):
    user = fetch_one("SELECT id, name, email, skills FROM users WHERE id = %s", (user_id,))
    if not user:
        return {"error": "User not found"}
    return dict(user)
```

### 3.3 Test Profile Agent
```bash
# Terminal test
curl -X POST http://localhost:8000/api/register \
  -F "name=Test Dev" \
  -F "email=test@dev.com" \
  -F "resume=@sample_resume.txt"

# Expected response:
# {"user_id": 1, "skills": {"Python": "expert", "DSA": "beginner", ...}}
```

### ✅ Phase 3 Done When:
- [ ] POST /api/register with real resume returns real skills from Qwen3
- [ ] User row created in PostgreSQL with skills JSON populated
- [ ] Redis has `user:1:progress = "profile_complete"`
- [ ] GET /api/user/1 returns real user data from DB
- [ ] Frontend Register page connects + shows extracted skills

---

## 📝 PHASE 4 — Assessment Agent + Route Integration
**Goal: Real adaptive question → real grading → score saved**
**Time: 3 hrs**

### 4.1 Build Assessment Agent
- [ ] `generate_question(skills, difficulty)` → Qwen3 question JSON
- [ ] `grade_submission(question, code, time_taken)` → score + feedback
- [ ] `DifficultyAdapter` class → reads past scores, adjusts difficulty

### 4.2 Update Assessment Router — Replace Stub
- [ ] `GET /api/assessment/{user_id}` → calls generate_question with real skills
- [ ] `POST /api/submit/{user_id}` → calls grade_submission, saves to DB, updates leaderboard

### 4.3 Test Assessment Agent
```bash
# Get real question
curl http://localhost:8000/api/assessment/1
# Expected: Real Qwen3-generated question based on user's skills

# Submit code
curl -X POST http://localhost:8000/api/submit/1 \
  -H "Content-Type: application/json" \
  -d '{"code": "def two_sum(nums, target): return []", "time_taken": 90}'
# Expected: Real score + AI feedback from Qwen3
```

### ✅ Phase 4 Done When:
- [ ] GET /api/assessment/1 returns Qwen3-generated question
- [ ] POST /api/submit/1 returns real AI score + feedback
- [ ] Assessment row saved in PostgreSQL
- [ ] Leaderboard updated in Redis
- [ ] Difficulty increases after high score
- [ ] Frontend Assessment page shows real question + real feedback

---

## 📚 PHASE 5 — Recommender Agent + Route Integration
**Goal: Real personalized learning path from Qwen3 → saved to DB**
**Time: 2 hrs**

### 5.1 Build Recommender Agent
- [ ] Read user skills + past assessment scores from DB
- [ ] Identify weak areas (beginner/none skills)
- [ ] Groq call → 4-week learning path JSON
- [ ] Save to learning_paths table

### 5.2 Update Learning Path Route — Replace Stub
- [ ] `GET /api/learning-path/{user_id}` → calls recommender agent
- [ ] Returns real personalized path based on actual user data

### 5.3 Test Recommender Agent
```bash
curl http://localhost:8000/api/learning-path/1
# Expected: Real 4-week path tailored to user's weak skills
# Week 1 should target the weakest identified skill
```

### ✅ Phase 5 Done When:
- [ ] GET /api/learning-path/1 returns real Qwen3 learning path
- [ ] Weak skills appear in weeks 1-2
- [ ] Path saved to learning_paths table
- [ ] Frontend Dashboard shows real learning path

---

## 🔗 PHASE 6 — Leaderboard + WebSocket (Real)
**Goal: Live leaderboard + real-time progress bar working**
**Time: 1 hr**

### 6.1 Update Leaderboard Route — Replace Stub
- [ ] Read from Redis sorted set (populated by submit route)
- [ ] Join with users table for names
- [ ] Return top 10 with rank + name + score

### 6.2 Update WebSocket — Real Progress
- [ ] Poll Redis `user:{id}:progress` every second
- [ ] Send update to frontend on change
- [ ] Close connection when progress = "path_ready"

### ✅ Phase 6 Done When:
- [ ] GET /api/leaderboard shows real users with real scores
- [ ] Submit code → leaderboard updates within 1 second
- [ ] WebSocket progress bar moves through 4 steps in frontend

---

## 🧪 PHASE 7 — Full Integration Test
**Goal: Complete user journey works end-to-end**
**Time: 1 hr**

### Full Flow Test:
```
Step 1: Register with real resume
        → Skills extracted by Qwen3 ✓
        → Saved to PostgreSQL ✓

Step 2: Get assessment question
        → Adaptive question from Qwen3 ✓
        → Question stored in Redis ✓

Step 3: Submit code
        → Graded by Qwen3 ✓
        → Score saved to DB ✓
        → Leaderboard updated ✓

Step 4: Get learning path
        → Personalized by Qwen3 ✓
        → Based on real weaknesses ✓
        → Saved to DB ✓

Step 5: Check leaderboard
        → Shows real users ✓
        → Real scores ✓

Step 6: Progress bar
        → WebSocket updates ✓
        → 4 nodes light up in order ✓
```

### ✅ Phase 7 Done When:
- [ ] Full journey works without errors
- [ ] All data persists in DB
- [ ] UI reflects real data at every step
- [ ] Tested with 2 different resumes

---

## 📋 BUILD LOOP SUMMARY

```
For each feature:
  1. Build stub route     → frontend can connect
  2. Build DB layer       → data persists
  3. Build agent          → AI logic works
  4. Replace stub route   → wire agent to route
  5. Test end-to-end      → verify in browser
  6. Move to next feature
```

### Loop Order:
```
[Foundation] → [Stub Routes] → [DB Layer]
     → [Profile Agent + Auth Route + Test]
          → [Assessment Agent + Assessment Route + Test]
               → [Recommender Agent + Path Route + Test]
                    → [Leaderboard + WebSocket + Test]
                         → [Full Integration Test]
                              → [Demo Prep]
```

---

## ⏰ TIME BUDGET

| Phase | Task | Time |
|-------|------|------|
| Phase 0 | Foundation | 1 hr |
| Phase 1 | Stub Routes | 1.5 hrs |
| Phase 2 | DB Layer | 1 hr |
| Phase 3 | Profile Agent + Test | 2.5 hrs |
| Phase 4 | Assessment Agent + Test | 3 hrs |
| Phase 5 | Recommender Agent + Test | 2 hrs |
| Phase 6 | Leaderboard + WebSocket | 1 hr |
| Phase 7 | Full Integration Test | 1 hr |
| Buffer | Bugs + Demo Prep | 4 hrs |
| **TOTAL** | | **17 hrs** |

---
*Complete each ✅ checklist before moving forward. Never skip verification.*

# Implementation Plan

## Context Map

### Files to Modify/Create
| File | Purpose | Changes Needed |
|------|---------|----------------|
| TASK.md | Source requirements | Implement phases 0-7 in code |
| backend/main.py | FastAPI app entry | CORS, route registration, health endpoint |
| backend/routers/auth.py | Registration/user APIs | Real DB + profile agent integration |
| backend/routers/assessment.py | Assessment APIs | Real question generation + grading + path |
| backend/routers/leaderboard.py | Leaderboard + WebSocket | Redis-driven leaderboard and progress stream |
| backend/agents/profile_agent.py | Resume skill extraction | Keyword + Groq analysis + DB persistence |
| backend/agents/assessment_agent.py | Adaptive assessment logic | Question gen, grading, difficulty adapter |
| backend/agents/recommender_agent.py | Learning-path generation | Weak-skill analysis + Groq plan generation |
| backend/db/postgres.py | PostgreSQL helper | Safe connection + query helpers |
| backend/db/redis_client.py | Redis helper | Cache/progress/leaderboard helpers |
| backend/requirements.txt | Python dependencies | FastAPI, DB, Redis, Groq, spaCy |
| backend/Dockerfile | Backend container image | Runtime and startup command |
| docker-compose.yml | Infra services | postgres + redis services |
| .env.example | Environment template | Key/value placeholders |
| backend/db/schema.sql | DB schema | users, assessments, learning_paths |
| backend/README.md | Run/test docs | setup and endpoint checks |

### Dependencies
| File | Relationship |
|------|--------------|
| backend/routers/*.py | depend on db helpers + agents |
| backend/agents/*.py | depend on db helpers + env config |
| backend/main.py | imports all routers |

### Test/Verification
| Check | Coverage |
|------|----------|
| uvicorn startup | app wiring and imports |
| curl route checks | endpoint behavior |
| DB ping/select | postgres connectivity |
| redis ping | redis connectivity |

### Risks
- [ ] Breaking API shape vs TASK.md examples
- [ ] LLM JSON parse failures
- [ ] Redis/Postgres unavailable during local run

## Execution Checklist

### Phase 1: Foundation and Skeleton
- [x] Create backend folder structure and init files
- [x] Add requirements, Dockerfile, compose, env example, schema SQL
- [x] Implement main.py with routers and root endpoint
- [x] Implement all routers with initial hardcoded/stub comments where needed
- [x] Verify imports are valid

### Phase 2: Database Layer
- [x] Implement postgres helper with fetch/execute utilities
- [x] Implement redis helper for progress/question/leaderboard
- [x] Ensure schema file matches TASK.md

### Phase 3: Agents
- [x] Implement profile_agent with fallback behavior
- [x] Implement assessment_agent with adaptive generation + grading
- [x] Implement recommender_agent with weak-skill based path generation
- [x] Mark any hardcoded fallback output with comments `# hardcoded/stub`

### Phase 4: Route Integration
- [x] Wire auth routes to DB + profile agent
- [x] Wire assessment routes to assessment/recommender agents + DB + Redis
- [x] Wire leaderboard routes to Redis + DB and WebSocket real progress polling

### Phase 5: Verification
- [x] Run syntax/compile checks
- [x] Run lightweight endpoint import verification
- [x] Summarize implemented phases and known gaps

## Review Notes (to fill after execution)
- `python -m compileall .` passed for all backend modules.
- Lightweight import check `python -c "import main"` was executed and failed due to missing dependency `groq` in the local environment (not a source-code syntax error).
- Full runtime checks (`uvicorn`, DB/Redis live integration, curl flow) are ready but not executed in this run because environment services/package install were not started here.
- Fallback outputs that are intentionally deterministic are marked with `# hardcoded/stub` comments in route/agent code.

## Full Test Execution Plan

- [x] Install backend dependencies
- [x] Start postgres + redis containers
- [x] Apply schema SQL to postgres
- [x] Verify `SELECT 1` and redis ping
- [x] Start FastAPI app
- [x] Run endpoint flow tests (root, register, user, assessment, submit, path, leaderboard)
- [x] Capture pass/fail summary and logs

## Full Test Results

- Resolved host port conflicts by remapping docker services:
	- Postgres host port `5433 -> 5432`
	- Redis host port `6380 -> 6379`
- Updated env URLs accordingly in `.env` and `.env.example`.
- Installed dependencies into existing workspace venv `.venv` (no new venv created).
- Infra status: postgres + redis containers running successfully.
- Health checks:
	- Postgres helper query returned `{'ok': 1}`.
	- Redis ping returned `True`.
- API flow tested for 2 users:
	- `GET /` -> 200
	- `POST /api/register` -> 200 (both users)
	- `GET /api/user/{id}` -> 200
	- `GET /api/assessment/{id}` -> 200
	- `POST /api/submit/{id}` -> 200
	- `GET /api/learning-path/{id}` -> 200
	- `GET /api/leaderboard` -> 200
- WebSocket check:
	- `WS /api/ws/1` connected and received `{"progress": "path_ready", "user_id": 1}` before close.
- Server access logs confirm all endpoint calls completed with 200 responses.

## Refactor Plan: backend.md Full Implementation

### Current State
- Backend has core routes (`auth`, `assessment`, `leaderboard`) and 3 core tables.
- OCR resume parser, completeness checker, hackathon/admin routes, and tracker/hackathon agents are missing.
- Auth flow does not yet support extra completeness prompts or login endpoint.

### Target State
- Backend matches backend.md structure and behavior, including OCR-assisted register flow, completeness checks, expanded schema, and additional routers/agents.
- PostgreSQL remains the primary database, with Redis for progress/cache/leaderboard.

### Affected Files
- Modify: `backend/main.py`, `backend/requirements.txt`, `backend/db/schema.sql`, `backend/agents/profile_agent.py`, `backend/routers/auth.py`
- Create: `backend/utils/__init__.py`, `backend/utils/resume_parser.py`, `backend/utils/completeness_checker.py`
- Create: `backend/agents/tracker_agent.py`, `backend/agents/hackathon_agent.py`
- Create: `backend/routers/hackathon.py`, `backend/routers/admin.py`

### Execution Plan
- [x] Phase 1: Add missing dependencies and utility modules (OCR + completeness)
- [x] Phase 2: Update profile agent and auth flow for dry-run + completeness pipeline
- [x] Phase 3: Expand schema for auth/hackathon/badges entities
- [x] Phase 4: Add tracker/hackathon agents and hackathon/admin routers
- [x] Phase 5: Wire app entrypoint and health route
- [x] Phase 6: Run compile/import checks and summarize

### Review Notes
- `python -m compileall .` passed for all backend modules.
- Runtime import check passed: `import main`.
- Updated schema applied successfully and required tables were confirmed in PostgreSQL.

## Fullstack Integration Plan

### Context Map

### Files to Modify
| File | Purpose | Changes Needed |
|------|---------|----------------|
| frontend/src/pages/Register.tsx | onboarding step 1 | capture identity and pass to resume flow |
| frontend/src/pages/ProfileBuilder.tsx | onboarding step 2 | upload resume and call `/api/register` |
| frontend/src/pages/ProfileManual.tsx | onboarding missing info | submit extras to `/api/register` |
| frontend/src/pages/ProfileSuccess.tsx | post-register state | show extracted skills and continue |
| frontend/src/pages/Login.tsx | auth | call `/api/login` and persist session |
| frontend/src/pages/Dashboard.tsx | app home | fetch user, learning path, leaderboard |
| frontend/src/App.tsx | route guard | protect dashboard route with session |
| frontend/src/lib/api.ts | API client | centralize backend requests |
| frontend/src/lib/session.ts | auth persistence | save/load logged-in user |
| frontend/src/state/onboarding.ts | onboarding memory | keep register + file state between pages |
| frontend/vite.config.ts | dev proxy | forward `/api` and ws to backend |
| frontend/.env.example | frontend env | add backend URL/proxy vars |
| backend/db/postgres.py | startup reliability | add wait + schema init helpers |
| backend/main.py | backend startup | initialize schema on app startup |
| backend/Dockerfile | OCR runtime | install tesseract + poppler packages |
| docker-compose.yml | full stack boot | add backend + frontend services |
| frontend/Dockerfile | frontend container | run vite app in docker |

### Risks
- [ ] Browser cannot reach backend inside docker without proxy config
- [ ] OCR runtime dependencies missing in backend container
- [ ] User session flow breaks on direct navigation without onboarding state

### Execution Checklist
- [x] Build frontend API/session/onboarding modules
- [x] Replace static onboarding/auth/dashboard pages with real API flows
- [x] Add frontend route protection and env/proxy wiring
- [x] Fix backend startup schema init and service readiness behavior
- [x] Add frontend/backend services to docker-compose and Dockerfiles
- [x] Run end-to-end verification for local and docker workflows

### Integration Review Notes
- Frontend now calls backend APIs for register/login/user/path/leaderboard.
- Two-step register (`needs_more_info`) flow was validated: initial incomplete response then successful completion with `extra_*` fields.
- Backend startup now waits for PostgreSQL and auto-applies schema.
- Docker fullstack startup verified with `docker compose up --build -d` and HTTP checks:
	- `http://localhost:3000` -> 200
	- `http://localhost:8000/health` -> 200

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

## Auth Flow Bugfix Plan (Register/Login + Onboarding Resume)

### Context Map

### Files to Modify
| File | Purpose | Changes Needed |
|------|---------|----------------|
| frontend/src/lib/api.ts | API result normalization | surface backend status and error payload consistently |
| frontend/src/pages/ProfileBuilder.tsx | register error UI | show backend root-cause message (`detail`/`error`) |
| frontend/src/pages/ProfileManual.tsx | manual completion errors | same error normalization as register step 1 |
| frontend/src/pages/Login.tsx | login error UI | show precise backend error message for user-not-found/invalid auth |
| backend/routers/auth.py | auth response shape | ensure login/register return clear error semantics and duplicate detection |

### Risks
- [ ] Regression in existing onboarding success path
- [ ] Frontend assumes old API response shape in another page
- [ ] Inconsistent error contract between endpoints

### Execution Checklist
- [x] Verify frontend onboarding resume route calls backend register endpoint
- [x] Normalize backend error payload handling in frontend API layer/pages
- [x] Confirm backend duplicate-email check and status code behavior
- [x] Run targeted runtime tests: duplicate register, valid register, invalid login, valid login
- [x] Document final root cause and fix summary

### Review Notes
- Confirmed route wiring: onboarding resume page posts to `/api/register`.
- Root cause fixed: backend duplicate/login errors were sent as `detail`, while frontend only checked `error` and often showed generic failures.
- Backend now returns HTTP 404 for missing user in login and user lookup, preserving explicit status semantics.
- Frontend API layer now throws non-2xx responses with normalized backend message extraction (`error`/`detail`/`message`) and includes HTTP code in error text.
- Runtime verification against Docker backend on port 8000:
	- valid register (with completion fields) -> 200
	- duplicate register (same email) -> 409 with `{"detail":"Email already registered"}`
	- valid login (existing user) -> 200
	- missing login (non-existent user) -> 404 with `{"detail":"User not found"}`

## Assessment Agent Plan (Spec-Aligned)

### Current State
- `backend/agents/assessment_agent.py` has basic adaptive question generation and grading but does not implement the full event-driven flow from profile vector, sandboxed execution, difficulty persistence, Redis event publish, and submission orchestration requested in the spec.
- `backend/routers/assessment.py` currently wires to partial functions and stores assessment rows directly in router logic.

### Target State
- `assessment_agent.py` becomes the single orchestration layer with these entry points:
	- `run_assessment_agent(user_id)` for question generation.
	- `submit_assessment(user_id, user_code, time_taken, hints_used)` for evaluation, grading, persistence, Redis updates, and event emission.
- `routers/assessment.py` delegates generation/submission to agent methods and keeps path-generation endpoint unchanged.

### Files to Modify
| File | Purpose | Changes Needed |
|------|---------|----------------|
| backend/agents/assessment_agent.py | Full assessment agent implementation | weakness detector, epsilon-greedy difficulty, Groq question/grade, exec sandbox, DB+Redis save, publish event |
| backend/routers/assessment.py | Route wiring | call `run_assessment_agent` and `submit_assessment` instead of inline logic |

### Execution Checklist
- [x] Implement `detect_weakest_skill()` with all-above-0.7 second-lowest behavior
- [x] Implement `get_difficulty()` using last 3 scores + Redis difficulty key
- [x] Implement `generate_question()` with Groq JSON parsing + fallback questions + Redis cache
- [x] Implement `evaluate_code()` using restricted `exec()` and 5s timeout
- [x] Implement `grade_submission()` with score capping and JSON parsing fallback
- [x] Implement `save_assessment()` with DB insert, weighted skill update, progress, leaderboard, and publish
- [x] Implement `run_assessment_agent()` and `submit_assessment()` orchestration
- [x] Rewire `routers/assessment.py` to agent entry points
- [x] Run compile diagnostics + targeted API checks

### Review Notes
- Replaced `backend/agents/assessment_agent.py` with full orchestration-based implementation including:
	- weakest-skill detection from mixed skill representations
	- epsilon-greedy style difficulty adjustment using Redis persisted difficulty
	- Groq-generated adaptive questions with model fallback and hardcoded fallback bank
	- 5-second sandboxed `exec()` evaluation via subprocess
	- LLM-based grading with fallback and failed-evaluation score cap
	- DB persistence, weighted skill update, Redis progress/leaderboard updates, and `user_assessment_done` publish
- Updated `backend/routers/assessment.py` to delegate question generation and submission handling to agent entry points.
- Verification run results (Docker backend on :8000):
	- `GET /api/assessment/7` -> 200 with generated question payload
	- `POST /api/submit/7` -> 200 with score/feedback/complexity/test-case fields and `next: learning_path`
	- second `POST /api/submit/7` without new question -> 400 `No active assessment`
	- Redis checks: `user:7:progress=assessment_complete`, `leaderboard score for 7` updated
	- PostgreSQL check: new `assessments` row inserted for user 7

## Assessment Agent Hotfix Plan (Bug1-Bug4)

### Current Gaps
- First-time users default to `0.5` difficulty instead of resume-based weakest-skill difficulty.
- Question model routing is cost-heavy (`qwen/qwen3-32b`) and question payload lacks structured executable test cases.
- Code evaluator relies primarily on display-style `examples` instead of deterministic `test_cases` input args.
- Grader uses a larger model than needed for text feedback.

### Target Behavior
- First-time difficulty comes from weakest resume skill score; returning users adapt via last assessments.
- Question generation uses `qwen-2.5-coder-32b`, returns `test_cases`, `function_name`, and `difficulty_label`.
- Evaluator executes against `test_cases` with strict safety checks and 5s timeout.
- Grader uses `llama3-8b-8192` with score cap when tests fail.

### Files to Modify
| File | Purpose | Changes Needed |
|------|---------|----------------|
| backend/agents/assessment_agent.py | Hotfix implementation | update difficulty source, model routing, question schema, evaluator, grader, fallback bank |

### Execution Checklist
- [x] Bug1: update `get_difficulty(user_id, resume_skill_score)` and pass weakest-skill resume score from `run_assessment_agent`
- [x] Bug2: switch question generation model to `qwen-2.5-coder-32b` and include executable `test_cases`
- [x] Bug3: update evaluator to use `question.test_cases` with security checks and timeout
- [x] Bug4: switch grading model path to `llama3-8b-8192`
- [x] Validate compile and endpoint behavior for first-time difficulty + submit flow

### Hotfix Review Notes
- `backend/agents/assessment_agent.py` now maps first-time difficulty from weakest resume skill and stores it in Redis with TTL.
- `run_assessment_agent()` now passes weakest-skill resume score into `get_difficulty()`.
- `generate_question()` now uses `qwen-2.5-coder-32b`, enforces required fields, and returns structured `test_cases` + `function_name` + `difficulty_label`.
- `evaluate_code()` now validates security patterns and executes against `test_cases` (max 2) with 5-second timeout per case.
- `grade_submission()` now routes grading to `llama3-8b-8192` and preserves score-cap behavior when tests fail.
- Runtime checks (Docker backend):
	- user 9001 first-time assessment -> `topic=System Design`, `difficulty=0.1`, Redis `user:9001:difficulty=0.1`
	- submit for user 9001 -> 200 with test-case metrics + Redis `progress=assessment_complete` + leaderboard updated

## Piston Evaluation Integration Plan

### Target Behavior
- Code execution/evaluation should run through Piston API instead of local `exec` sandbox.
- Piston base URL must be read from environment variable `PISTON_URL`.
- Environment template should include:
	- `PISTON_URL=https://piston.yourdomain.com/api/v2/piston`

### Files to Modify
| File | Purpose | Changes Needed |
|------|---------|----------------|
| backend/agents/assessment_agent.py | External code execution | replace local test execution path with Piston API evaluation flow using env URL |
| .env.example | Env template | add `PISTON_URL` sample entry |

### Execution Checklist
- [x] Add env-driven Piston endpoint handling in assessment agent
- [x] Route test-case execution through Piston and parse structured result
- [x] Keep security checks and result shape compatible with existing grader flow
- [x] Add `PISTON_URL` entry to `.env.example`
- [x] Run compile checks for backend agent

### Review Notes
- `evaluate_code()` in `backend/agents/assessment_agent.py` now executes submissions through Piston API using `PISTON_URL` from environment.
- Piston integration posts Python harness code with structured test cases and parses a marker-based JSON result from stdout.
- Existing response contract for grader flow is preserved (`passed`, `test_cases_passed`, `test_cases_total`, `errors`, `execution_time_ms`, `error`).
- Environment template now includes `PISTON_URL=https://piston.yourdomain.com/api/v2/piston`.
- Syntax verification passed via `python -m compileall agents/assessment_agent.py`.

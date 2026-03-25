# Coding Platform

## Run Backend Separately

1. Start infrastructure:
   - `docker compose up -d postgres redis`
2. Start backend:
   - `cd backend`
   - `..\\.venv\\Scripts\\python.exe -m uvicorn main:app --reload --host 0.0.0.0 --port 8000`

## Run Frontend Separately

1. Start frontend:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

Frontend runs at `http://localhost:3000` and proxies `/api` requests to backend.

## Run Entire Project with Docker

1. From project root:
   - `docker compose up --build`
2. Open:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:8000`

## Stop Everything

- `docker compose down`

# 3 Mavericks Coding Platform Backend

## Run Backend Separately

1. Start infra from project root:
   - `docker compose up -d postgres redis`
2. Run backend from `backend`:
   - `..\\.venv\\Scripts\\python.exe -m uvicorn main:app --reload --host 0.0.0.0 --port 8000`

Schema creation is automatic on startup.

## Key Endpoints

- `GET /`
- `POST /api/register`
- `GET /api/user/{user_id}`
- `GET /api/assessment/{user_id}`
- `POST /api/submit/{user_id}`
- `GET /api/learning-path/{user_id}`
- `GET /api/leaderboard`
- `WS /api/ws/{user_id}`

## Notes

- If `GROQ_API_KEY` is missing, fallback hardcoded/stub responses are returned and clearly marked in code comments.
- OCR for scanned PDFs/images requires `tesseract` and `poppler` binaries in the runtime environment (already installed in backend Docker image).

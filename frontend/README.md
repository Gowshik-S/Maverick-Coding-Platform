# Frontend

## Run Frontend Separately

1. Install dependencies:
   - `npm install`
2. Start dev server:
   - `npm run dev`

The app runs at `http://localhost:3000`.

## Backend Connection

- By default the frontend uses Vite proxy for `/api` requests.
- Proxy target is configured by `VITE_DEV_PROXY_TARGET` (default: `http://localhost:8000`).
- Optional absolute API base can be set with `VITE_API_BASE_URL`.

## Run with Docker

Use project root compose:

- `docker compose up --build`

import os
import time
from pathlib import Path
from typing import Any, Iterable, Optional

import psycopg2
import psycopg2.extras
from dotenv import load_dotenv

load_dotenv()


def get_connection():
    postgres_url = os.getenv("POSTGRES_URL")
    if not postgres_url:
        raise ValueError("POSTGRES_URL is not configured")
    return psycopg2.connect(postgres_url)


def wait_for_postgres(max_retries: int = 30, delay_seconds: float = 1.0) -> None:
    last_error: Exception | None = None
    for _ in range(max_retries):
        try:
            with get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT 1")
            return
        except Exception as exc:  # noqa: BLE001
            last_error = exc
            time.sleep(delay_seconds)

    if last_error:
        raise last_error


def initialize_schema() -> None:
    schema_path = Path(__file__).resolve().parent / "schema.sql"
    if not schema_path.exists():
        raise FileNotFoundError(f"schema.sql not found at {schema_path}")

    schema_sql = schema_path.read_text(encoding="utf-8")
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(schema_sql)
        conn.commit()


def fetch_one(query: str, params: Optional[Iterable[Any]] = None):
    with get_connection() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(query, params)
            return cur.fetchone()


def fetch_all(query: str, params: Optional[Iterable[Any]] = None):
    with get_connection() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(query, params)
            return cur.fetchall()


def execute(query: str, params: Optional[Iterable[Any]] = None):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query, params)
            conn.commit()
            if "RETURNING" in query.upper():
                row = cur.fetchone()
                return row[0] if row else None
    return None

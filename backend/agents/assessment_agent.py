import ast
import builtins
import json
import multiprocessing
import os
import re
import time
from typing import Any, Dict, Iterable, List, Optional, Tuple

from dotenv import load_dotenv
from groq import Groq

from db.postgres import execute, fetch_all, fetch_one
from db.redis_client import (
    client as redis_client,
    get_question,
    set_progress,
    set_question,
    update_leaderboard,
)

load_dotenv()


FALLBACK_QUESTIONS: Dict[str, Dict[str, Any]] = {
    "Python": {
        "title": "Two Sum",
        "description": "Given an array of integers, return indices of two numbers that add up to a target.",
        "examples": [{"input": "nums=[2,7,11,15], target=9", "output": "[0,1]"}],
        "constraints": ["Time limit: 2 seconds", "Memory: 256MB"],
        "starter_code": "def two_sum(nums, target):\\n    pass",
        "expected_output_hint": "Use a hashmap for O(n) lookup.",
        "topic": "Python",
        "difficulty": 0.5,
    },
    "DSA": {
        "title": "Reverse a Linked List",
        "description": "Reverse a singly linked list and return the new head.",
        "examples": [{"input": "1->2->3->4->5", "output": "5->4->3->2->1"}],
        "constraints": ["Time limit: 2 seconds", "Memory: 256MB"],
        "starter_code": "def reverse_list(head):\\n    pass",
        "expected_output_hint": "Iteratively reverse next pointers.",
        "topic": "DSA",
        "difficulty": 0.5,
    },
    "SQL": {
        "title": "Top Customer by Spend",
        "description": "Write a query to return the customer with highest total order amount.",
        "examples": [{"input": "orders(customer_id, amount)", "output": "customer_id=2"}],
        "constraints": ["Time limit: 2 seconds", "Memory: 256MB"],
        "starter_code": "-- Write SQL query here",
        "expected_output_hint": "Use GROUP BY and ORDER BY SUM(amount) DESC.",
        "topic": "SQL",
        "difficulty": 0.5,
    },
    "React": {
        "title": "Debounced Search Input",
        "description": "Build a React component that debounces API calls while typing.",
        "examples": [{"input": "user types quickly", "output": "single API call after delay"}],
        "constraints": ["Time limit: 2 seconds", "Memory: 256MB"],
        "starter_code": "function SearchBox() {\\n  return null;\\n}",
        "expected_output_hint": "Use useEffect cleanup and setTimeout.",
        "topic": "React",
        "difficulty": 0.5,
    },
    "System Design": {
        "title": "Design URL Shortener",
        "description": "Design a scalable URL shortener service.",
        "examples": [{"input": "long URL", "output": "short URL key"}],
        "constraints": ["Time limit: 2 seconds", "Memory: 256MB"],
        "starter_code": "# Describe core components and APIs",
        "expected_output_hint": "Discuss key generation, caching, and database choice.",
        "topic": "System Design",
        "difficulty": 0.5,
    },
}


def _log(event: str) -> None:
    print(f"[AssessmentAgent] {event}")


def _safe_groq_client() -> Optional[Groq]:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key or api_key == "your_key_here":
        return None
    return Groq(api_key=api_key)


def call_groq(prompt: str, model: str = "llama3-8b-8192") -> str:
    client = _safe_groq_client()
    if client is None:
        raise RuntimeError("GROQ_API_KEY not configured")

    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=2048,
    )
    return response.choices[0].message.content or ""


def _extract_json(raw: str) -> Dict[str, Any]:
    cleaned = (raw or "").strip()
    if "```" in cleaned:
        parts = cleaned.split("```")
        if len(parts) >= 2:
            cleaned = parts[1].replace("json", "").strip()
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("No JSON object found")
    return json.loads(cleaned[start : end + 1])


def _to_numeric(value: Any) -> float:
    if isinstance(value, (int, float)):
        numeric = float(value)
        if numeric > 1.0:
            numeric = numeric / 100.0
        return max(0.0, min(1.0, numeric))

    mapping = {
        "none": 0.1,
        "beginner": 0.3,
        "intermediate": 0.6,
        "expert": 0.9,
    }
    return mapping.get(str(value).strip().lower(), 0.5)


def _normalize_skill_vector(skills: Dict[str, Any]) -> Dict[str, float]:
    normalized: Dict[str, float] = {}
    for skill, score in (skills or {}).items():
        normalized[str(skill)] = _to_numeric(score)
    return normalized


def detect_weakest_skill(skills: Dict[str, Any]) -> str:
    vector = _normalize_skill_vector(skills)
    if not vector:
        return "DSA"

    ranked = sorted(vector.items(), key=lambda pair: pair[1])
    all_above_threshold = all(score > 0.7 for _, score in ranked)
    if all_above_threshold and len(ranked) > 1:
        return ranked[1][0]
    return ranked[0][0]


def get_difficulty(user_id: int) -> float:
    rows = fetch_all(
        "SELECT score FROM assessments WHERE user_id = %s ORDER BY created_at DESC LIMIT 3",
        (user_id,),
    )
    current_raw = redis_client.get(f"user:{user_id}:difficulty")
    current = float(current_raw) if current_raw else 0.5

    if not rows:
        difficulty = 0.5
    else:
        last_score = int(rows[0]["score"] or 0)
        if last_score >= 80:
            difficulty = min(1.0, current + 0.1)
        elif last_score <= 40:
            difficulty = max(0.1, current - 0.1)
        else:
            difficulty = current

    difficulty = round(difficulty, 2)
    redis_client.set(f"user:{user_id}:difficulty", difficulty)
    _log(f"difficulty user={user_id} value={difficulty}")
    return difficulty


def _question_prompt(skill: str, difficulty: float) -> str:
    return (
        "You are an expert coding interviewer. Generate a coding challenge for the topic: "
        f"{skill}.\\n"
        f"Difficulty level: {difficulty} (0.0=easiest, 1.0=hardest).\\n\\n"
        "Return ONLY a JSON object with these exact fields:\\n"
        "{\\n"
        "  'title': 'Short problem title',\\n"
        "  'description': 'Full problem description with examples',\\n"
        "  'examples': [{'input': '...', 'output': '...'}],\\n"
        "  'constraints': ['Time limit: 2 seconds', 'Memory: 256MB'],\\n"
        "  'starter_code': 'def solution():\\n    pass',\\n"
        "  'expected_output_hint': 'Brief hint about the approach',\\n"
        f"  'topic': '{skill}',\\n"
        f"  'difficulty': {difficulty}\\n"
        "}\\n\\n"
        "Make it a real coding problem with proper examples. No explanations, just JSON."
    )


def generate_question(skill: str, difficulty: float, user_id: int) -> Dict[str, Any]:
    prompt = _question_prompt(skill, difficulty)

    try:
        raw = call_groq(prompt, model="qwen/qwen3-32b")
        parsed = _extract_json(raw)
    except Exception:
        try:
            raw = call_groq(prompt, model="llama3-8b-8192")
            parsed = _extract_json(raw)
        except Exception:
            parsed = dict(FALLBACK_QUESTIONS.get(skill, FALLBACK_QUESTIONS["Python"]))

    parsed.setdefault("topic", skill)
    parsed.setdefault("difficulty", difficulty)
    parsed.setdefault("examples", [])
    parsed.setdefault("constraints", ["Time limit: 2 seconds", "Memory: 256MB"])
    parsed.setdefault("starter_code", "def solution():\\n    pass")
    set_question(user_id, parsed)
    _log(f"question_generated user={user_id} topic={parsed.get('topic')}")
    return parsed


def _strip_unsafe_imports(user_code: str) -> str:
    blocked = ("import os", "import sys", "import subprocess", "from os", "from sys", "from subprocess")
    safe_lines: List[str] = []
    for line in (user_code or "").splitlines():
        if any(token in line for token in blocked):
            continue
        safe_lines.append(line)
    return "\n".join(safe_lines)


def _split_top_level(text: str, delimiter: str = ",") -> List[str]:
    chunks: List[str] = []
    current: List[str] = []
    depth = 0
    pairs = {"[": "]", "(": ")", "{": "}"}
    closing = set(pairs.values())

    for char in text:
        if char in pairs:
            depth += 1
        elif char in closing and depth > 0:
            depth -= 1

        if char == delimiter and depth == 0:
            part = "".join(current).strip()
            if part:
                chunks.append(part)
            current = []
            continue

        current.append(char)

    part = "".join(current).strip()
    if part:
        chunks.append(part)
    return chunks


def _parse_literal(value: str) -> Any:
    try:
        return ast.literal_eval(value)
    except Exception:
        return value.strip()


def _parse_example_input(raw_input: Any) -> Tuple[List[Any], Dict[str, Any]]:
    if not isinstance(raw_input, str):
        return [raw_input], {}

    text = raw_input.strip()
    if not text:
        return [], {}

    if "=" in text:
        kwargs: Dict[str, Any] = {}
        for part in _split_top_level(text):
            if "=" not in part:
                continue
            key, value = part.split("=", 1)
            kwargs[key.strip()] = _parse_literal(value)
        if kwargs:
            return list(kwargs.values()), kwargs

    if text.startswith("(") and text.endswith(")"):
        parsed = _parse_literal(text)
        if isinstance(parsed, tuple):
            return list(parsed), {}

    return [_parse_literal(text)], {}


def _normalize_output(value: Any) -> Any:
    if isinstance(value, str):
        return re.sub(r"\s+", "", value)
    return value


def _allowed_builtins() -> Dict[str, Any]:
    allowed_names: Iterable[str] = (
        "abs",
        "all",
        "any",
        "bool",
        "dict",
        "enumerate",
        "float",
        "int",
        "len",
        "list",
        "max",
        "min",
        "print",
        "range",
        "set",
        "str",
        "sum",
        "tuple",
        "zip",
    )
    return {name: getattr(builtins, name) for name in allowed_names}


def _select_solution_callable(namespace: Dict[str, Any]):
    preferred = ("solution", "solve", "two_sum", "reverse_list")
    for name in preferred:
        fn = namespace.get(name)
        if callable(fn):
            return fn
    for name, value in namespace.items():
        if callable(value) and not str(name).startswith("__"):
            return value
    raise ValueError("No callable solution function found in submission")


def _evaluate_worker(user_code: str, examples: List[Dict[str, Any]], queue: multiprocessing.Queue) -> None:
    start = time.perf_counter()
    try:
        namespace: Dict[str, Any] = {}
        safe_globals: Dict[str, Any] = {"__builtins__": _allowed_builtins()}
        exec(user_code, safe_globals, namespace)
        fn = _select_solution_callable(namespace)

        passed = 0
        total = len(examples)
        for ex in examples:
            raw_input = ex.get("input")
            raw_expected = ex.get("output")
            args, kwargs = _parse_example_input(raw_input)
            expected = _parse_literal(raw_expected) if isinstance(raw_expected, str) else raw_expected

            if kwargs:
                result = fn(**kwargs)
            elif args:
                result = fn(*args)
            else:
                result = fn()

            if _normalize_output(result) == _normalize_output(expected):
                passed += 1

        elapsed_ms = (time.perf_counter() - start) * 1000.0
        queue.put(
            {
                "passed": total > 0 and passed == total,
                "test_cases_passed": passed,
                "test_cases_total": total,
                "execution_time_ms": round(elapsed_ms, 3),
                "error": None,
            }
        )
    except Exception as exc:  # noqa: BLE001
        elapsed_ms = (time.perf_counter() - start) * 1000.0
        queue.put(
            {
                "passed": False,
                "test_cases_passed": 0,
                "test_cases_total": len(examples),
                "execution_time_ms": round(elapsed_ms, 3),
                "error": str(exc),
            }
        )


def evaluate_code(user_code: str, question: Dict[str, Any]) -> Dict[str, Any]:
    cleaned_code = _strip_unsafe_imports(user_code)
    examples = question.get("examples") or []

    if not cleaned_code.strip():
        return {
            "passed": False,
            "test_cases_passed": 0,
            "test_cases_total": len(examples),
            "execution_time_ms": 0.0,
            "error": "No code submitted",
        }

    queue: multiprocessing.Queue = multiprocessing.Queue()
    process = multiprocessing.Process(target=_evaluate_worker, args=(cleaned_code, examples, queue))
    process.start()
    process.join(timeout=5)

    if process.is_alive():
        process.terminate()
        process.join()
        return {
            "passed": False,
            "test_cases_passed": 0,
            "test_cases_total": len(examples),
            "execution_time_ms": 5000.0,
            "error": "Execution timed out (5 seconds)",
        }

    if queue.empty():
        return {
            "passed": False,
            "test_cases_passed": 0,
            "test_cases_total": len(examples),
            "execution_time_ms": 0.0,
            "error": "Evaluation process did not return a result",
        }

    return queue.get()


def _fallback_grade(eval_result: Dict[str, Any]) -> Dict[str, Any]:
    passed = bool(eval_result.get("passed", False))
    ratio = 0.0
    total = int(eval_result.get("test_cases_total") or 0)
    done = int(eval_result.get("test_cases_passed") or 0)
    if total > 0:
        ratio = done / total

    score = int(100 * ratio) if passed else int(30 * ratio)
    score = max(0, min(100, score))
    return {
        "score": score,
        "feedback": "Good progress. Improve edge-case handling and code clarity.",
        "improvement": "Add robust test coverage and optimize algorithm choice.",
        "time_complexity": "O(n)",
        "space_complexity": "O(n)",
    }


def grade_submission(user_code: str, question: Dict[str, Any], eval_result: Dict[str, Any]) -> Dict[str, Any]:
    if not user_code.strip():
        return {
            "score": 0,
            "feedback": "No code submitted.",
            "improvement": "Submit a working attempt to receive detailed feedback.",
            "time_complexity": "N/A",
            "space_complexity": "N/A",
        }

    prompt = (
        "You are a senior code reviewer. Grade this code submission.\\n\\n"
        f"Problem: {question.get('title', 'Unknown Problem')}\\n"
        f"Topic: {question.get('topic') or question.get('skill_area', 'Unknown')}\\n\\n"
        "User's Code:\\n"
        f"{user_code[:5000]}\\n\\n"
        f"Test Results: {eval_result.get('test_cases_passed', 0)}/{eval_result.get('test_cases_total', 0)} passed\\n"
        f"Execution Time: {eval_result.get('execution_time_ms', 0)}ms\\n\\n"
        "Return ONLY this JSON:\\n"
        "{\\n"
        "  'score': <integer 0-100>,\\n"
        "  'feedback': '<2-3 sentence explanation of what was good/bad>',\\n"
        "  'improvement': '<specific suggestion to improve the code>',\\n"
        "  'time_complexity': '<e.g., O(n), O(n^2)>',\\n"
        "  'space_complexity': '<e.g., O(1), O(n)>'\\n"
        "}"
    )

    parsed: Dict[str, Any]
    try:
        raw = call_groq(prompt, model="qwen/qwen3-32b")
        parsed = _extract_json(raw)
    except Exception:
        try:
            raw = call_groq(prompt, model="llama3-8b-8192")
            parsed = _extract_json(raw)
        except Exception:
            parsed = _fallback_grade(eval_result)

    parsed.setdefault("score", 0)
    parsed.setdefault("feedback", "No feedback returned")
    parsed.setdefault("improvement", "No improvement suggestion returned")
    parsed.setdefault("time_complexity", "Unknown")
    parsed.setdefault("space_complexity", "Unknown")

    parsed["score"] = int(max(0, min(100, int(parsed.get("score", 0)))))
    if not bool(eval_result.get("passed", False)):
        parsed["score"] = min(parsed["score"], 30)

    return parsed


def save_assessment(
    user_id: int,
    question: Dict[str, Any],
    user_code: str,
    grade_result: Dict[str, Any],
    eval_result: Dict[str, Any],
    difficulty: float,
    time_taken: int = 0,
    hints_used: int = 0,
) -> Dict[str, float]:
    score = int(grade_result.get("score", 0))
    skill_area = str(question.get("topic") or question.get("skill_area") or "DSA")

    execute(
        """
        INSERT INTO assessments (
            user_id, question, user_code, score, feedback, improvement,
            skill_area, difficulty, time_taken, hints_used
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (
            user_id,
            json.dumps(question),
            user_code,
            score,
            str(grade_result.get("feedback", "")),
            str(grade_result.get("improvement", "")),
            skill_area,
            float(difficulty),
            int(time_taken),
            int(hints_used),
        ),
    )

    row = fetch_one("SELECT skills FROM users WHERE id = %s", (user_id,))
    current_skills = row.get("skills") if row else {}
    if isinstance(current_skills, str):
        try:
            current_skills = json.loads(current_skills)
        except Exception:
            current_skills = {}

    normalized = _normalize_skill_vector(current_skills or {})
    old_score = normalized.get(skill_area, 0.5)
    new_score = round(0.7 * old_score + 0.3 * (score / 100.0), 4)
    normalized[skill_area] = new_score

    execute("UPDATE users SET skills = %s WHERE id = %s", (json.dumps(normalized), user_id))
    redis_client.set(f"user:{user_id}:profile", json.dumps(normalized))
    set_progress(user_id, "assessment_complete")
    update_leaderboard(user_id, score)

    event_payload = {
        "user_id": user_id,
        "event": "user_assessment_done",
        "skill_assessed": skill_area,
        "score": score,
        "feedback": grade_result.get("feedback", ""),
        "updated_skills": normalized,
    }
    redis_client.publish("user_assessment_done", json.dumps(event_payload))
    _log(f"assessment_saved user={user_id} score={score} skill={skill_area}")
    return normalized


def _get_user_skills(user_id: int) -> Optional[Dict[str, Any]]:
    raw = redis_client.get(f"user:{user_id}:profile")
    if raw:
        try:
            parsed = json.loads(raw)
            if isinstance(parsed, dict):
                return parsed
        except Exception:
            pass

    user = fetch_one("SELECT skills FROM users WHERE id = %s", (user_id,))
    if not user:
        return None

    skills = user.get("skills") or {}
    if isinstance(skills, str):
        try:
            skills = json.loads(skills)
        except Exception:
            skills = {}
    return skills if isinstance(skills, dict) else {}


def run_assessment_agent(user_id: int) -> Dict[str, Any]:
    skills = _get_user_skills(user_id)
    if skills is None:
        return {"error": "User not found"}

    topic = detect_weakest_skill(skills)
    difficulty = get_difficulty(user_id)
    question = generate_question(topic, difficulty, user_id)
    set_progress(user_id, "assessment_ready")
    _log(f"assessment_ready user={user_id} topic={topic}")
    return question


def submit_assessment(
    user_id: int,
    user_code: str,
    time_taken: int = 0,
    hints_used: int = 0,
) -> Dict[str, Any]:
    question = get_question(user_id)
    if not question:
        return {"error": "No active assessment"}

    eval_result = evaluate_code(user_code, question)
    grade_result = grade_submission(user_code, question, eval_result)

    topic = str(question.get("topic") or question.get("skill_area") or "DSA")
    difficulty = float(question.get("difficulty") or 0.5)
    save_assessment(
        user_id=user_id,
        question=question,
        user_code=user_code,
        grade_result=grade_result,
        eval_result=eval_result,
        difficulty=difficulty,
        time_taken=time_taken,
        hints_used=hints_used,
    )

    redis_client.delete(f"user:{user_id}:current_question")
    _log(f"assessment_submitted user={user_id} score={grade_result.get('score', 0)}")

    return {
        "score": int(grade_result.get("score", 0)),
        "feedback": str(grade_result.get("feedback", "")),
        "improvement": str(grade_result.get("improvement", "")),
        "time_complexity": str(grade_result.get("time_complexity", "Unknown")),
        "space_complexity": str(grade_result.get("space_complexity", "Unknown")),
        "test_cases_passed": int(eval_result.get("test_cases_passed", 0)),
        "test_cases_total": int(eval_result.get("test_cases_total", 0)),
        "topic": topic,
        "difficulty": difficulty,
        "next": "learning_path",
    }

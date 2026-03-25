import json
import os
import re
import time
import urllib.error
import urllib.request
from typing import Any, Dict, List, Optional

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
        "description": "Given a list of integers and a target, return the indices of two numbers that add up to the target.",
        "examples": [
            {
                "input": "nums=[2,7,11,15], target=9",
                "output": "[0,1]",
                "explanation": "2+7=9",
            }
        ],
        "test_cases": [
            {"input_args": [[2, 7, 11, 15], 9], "expected_output": [0, 1]},
            {"input_args": [[3, 2, 4], 6], "expected_output": [1, 2]},
        ],
        "constraints": ["2 <= nums.length <= 10^4", "Time limit: 2 seconds"],
        "starter_code": "def solution(nums, target):\\n    pass",
        "function_name": "solution",
        "topic": "Python",
        "difficulty": 0.4,
        "difficulty_label": "intermediate",
    },
    "DSA": {
        "title": "Reverse a String",
        "description": "Write a function that reverses a string. The input string is given as a list of characters.",
        "examples": [
            {
                "input": "s=['h','e','l','l','o']",
                "output": "['o','l','l','e','h']",
                "explanation": "reversed",
            }
        ],
        "test_cases": [
            {"input_args": [["h", "e", "l", "l", "o"]], "expected_output": ["o", "l", "l", "e", "h"]},
            {"input_args": [["A", "n", "n", "a"]], "expected_output": ["a", "n", "n", "A"]},
        ],
        "constraints": ["1 <= s.length <= 10^5"],
        "starter_code": "def solution(s):\\n    pass",
        "function_name": "solution",
        "topic": "DSA",
        "difficulty": 0.3,
        "difficulty_label": "beginner",
    },
    "SQL": {
        "title": "Find Duplicates",
        "description": "Write a Python function that finds duplicate values in a list and returns them.",
        "examples": [
            {
                "input": "nums=[1,2,3,2,4,3]",
                "output": "[2,3]",
                "explanation": "2 and 3 appear more than once",
            }
        ],
        "test_cases": [
            {"input_args": [[1, 2, 3, 2, 4, 3]], "expected_output": [2, 3]},
            {"input_args": [[1, 1, 1, 2]], "expected_output": [1]},
        ],
        "constraints": ["Return duplicates in order of first occurrence"],
        "starter_code": "def solution(nums):\\n    pass",
        "function_name": "solution",
        "topic": "SQL",
        "difficulty": 0.3,
        "difficulty_label": "beginner",
    },
    "React": {
        "title": "Count Elements",
        "description": "Given a list and a value, return how many times the value appears.",
        "examples": [
            {
                "input": "arr=[1,2,2,3], val=2",
                "output": "2",
                "explanation": "2 appears twice",
            }
        ],
        "test_cases": [
            {"input_args": [[1, 2, 2, 3], 2], "expected_output": 2},
            {"input_args": [[5, 5, 5, 5], 5], "expected_output": 4},
        ],
        "constraints": ["Return integer count"],
        "starter_code": "def solution(arr, val):\\n    pass",
        "function_name": "solution",
        "topic": "React",
        "difficulty": 0.2,
        "difficulty_label": "beginner",
    },
    "System Design": {
        "title": "FizzBuzz",
        "description": "Return a list where multiples of 3 are 'Fizz', multiples of 5 are 'Buzz', both are 'FizzBuzz', else the number.",
        "examples": [
            {
                "input": "n=5",
                "output": "['1','2','Fizz','4','Buzz']",
                "explanation": "standard FizzBuzz",
            }
        ],
        "test_cases": [
            {"input_args": [5], "expected_output": ["1", "2", "Fizz", "4", "Buzz"]},
            {
                "input_args": [15],
                "expected_output": [
                    "1",
                    "2",
                    "Fizz",
                    "4",
                    "Buzz",
                    "Fizz",
                    "7",
                    "8",
                    "Fizz",
                    "Buzz",
                    "11",
                    "Fizz",
                    "13",
                    "14",
                    "FizzBuzz",
                ],
            },
        ],
        "constraints": ["1 <= n <= 10^4"],
        "starter_code": "def solution(n):\\n    pass",
        "function_name": "solution",
        "topic": "System Design",
        "difficulty": 0.2,
        "difficulty_label": "beginner",
    },
}


def _log(event: str) -> None:
    print(f"[AssessmentAgent] {event}")


def _safe_groq_client() -> Optional[Groq]:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key or api_key == "your_key_here":
        return None
    return Groq(api_key=api_key)


def call_groq(prompt: str, model: str = "llama-3.1-8b-instant") -> str:
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
    # Strip model reasoning wrappers (for example <think>...</think>) before parsing.
    cleaned = re.sub(r"<think>.*?</think>", "", cleaned, flags=re.DOTALL | re.IGNORECASE).strip()
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


def get_difficulty(user_id: int, resume_skill_score: Optional[float] = None) -> float:
    """
    First-time user  -> map resume skill score directly to difficulty.
    Returning user   -> RL adaptive from last 3 DB scores.
    """
    cached = redis_client.get(f"user:{user_id}:difficulty")
    if cached:
        return float(cached)

    rows = fetch_all(
        "SELECT score FROM assessments WHERE user_id = %s ORDER BY created_at DESC LIMIT 3",
        (user_id,),
    )

    if rows:
        avg_score = sum(int(r["score"] or 0) for r in rows) / len(rows)
        old_diff = float(redis_client.get(f"user:{user_id}:difficulty") or 0.5)

        if avg_score >= 80:
            difficulty = min(1.0, old_diff + 0.1)
        elif avg_score <= 40:
            difficulty = max(0.1, old_diff - 0.1)
        else:
            difficulty = old_diff
    elif resume_skill_score is not None:
        if resume_skill_score >= 0.8:
            difficulty = 0.8
        elif resume_skill_score >= 0.6:
            difficulty = 0.6
        elif resume_skill_score >= 0.4:
            difficulty = 0.4
        elif resume_skill_score >= 0.2:
            difficulty = 0.2
        else:
            difficulty = 0.1
    else:
        difficulty = 0.5

    difficulty = round(float(difficulty), 2)
    redis_client.set(f"user:{user_id}:difficulty", difficulty, ex=86400)
    source = "db_history" if rows else "resume_score" if resume_skill_score is not None else "default"
    _log(f"user:{user_id} difficulty={difficulty} source={source}")
    return difficulty


def generate_question(skill: str, difficulty: float, user_id: int) -> Dict[str, Any]:
    difficulty_label = (
        "beginner"
        if difficulty <= 0.3
        else "intermediate"
        if difficulty <= 0.5
        else "intermediate-advanced"
        if difficulty <= 0.7
        else "advanced"
    )

    prompt = f"""You are a coding interviewer. Generate a {difficulty_label} coding problem for topic: {skill}.

Return ONLY valid JSON, no markdown fences, no explanation:
{{
  "title": "Short problem title",
  "description": "Full problem statement with context and examples",
  "examples": [
    {{"input": "describe input 1", "output": "expected output 1", "explanation": "why"}},
    {{"input": "describe input 2", "output": "expected output 2", "explanation": "why"}}
  ],
  "test_cases": [
    {{"input_args": [<actual python arg1>, <actual arg2>], "expected_output": <python value>}},
    {{"input_args": [<actual python arg1>, <actual arg2>], "expected_output": <python value>}}
  ],
  "constraints": ["Constraint 1", "Time limit: 2 seconds"],
  "starter_code": "def solution(...):\\n    pass",
  "function_name": "solution",
  "topic": "{skill}",
  "difficulty": {difficulty},
  "difficulty_label": "{difficulty_label}"
}}"""

    try:
        raw = call_groq(prompt, model="qwen/qwen3-32b")
        question = _extract_json(raw)

        required = ["title", "description", "test_cases", "starter_code", "function_name"]
        for field in required:
            if field not in question:
                raise ValueError(f"Missing field: {field}")
    except Exception as exc:
        _log(f"Groq failed ({exc}), using fallback question for {skill}")
        question = dict(FALLBACK_QUESTIONS.get(skill, FALLBACK_QUESTIONS["Python"]))

    question["topic"] = skill
    question["difficulty"] = difficulty
    question["difficulty_label"] = difficulty_label
    question.setdefault("test_cases", FALLBACK_QUESTIONS.get(skill, FALLBACK_QUESTIONS["Python"]).get("test_cases", [])[:2])
    question.setdefault("function_name", "solution")
    question.setdefault("starter_code", "def solution(*args):\\n    pass")
    set_question(user_id, question)
    _log(
        f"Question generated title={question.get('title', 'Unknown')} "
        f"topic={skill} difficulty={question.get('difficulty_label', difficulty_label)}"
    )
    return question


def _post_json(url: str, payload: Dict[str, Any], timeout: int = 20) -> Dict[str, Any]:
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=timeout) as response:  # noqa: S310
        raw = response.read().decode("utf-8", errors="ignore")
    return json.loads(raw)


def _run_python_in_piston(code: str) -> Dict[str, Any]:
    base_url = os.getenv("PISTON_URL", "https://piston.yourdomain.com/api/v2/piston").strip()
    candidates = [base_url]
    if not base_url.endswith("/execute"):
        candidates.append(base_url.rstrip("/") + "/execute")

    payload = {
        "language": "python",
        "version": "3.10.0",
        "files": [{"content": code}],
    }

    last_error: Optional[Exception] = None
    for url in candidates:
        try:
            return _post_json(url, payload)
        except Exception as exc:  # noqa: BLE001
            last_error = exc

    if last_error:
        raise last_error
    raise RuntimeError("PISTON_URL is not reachable")


def evaluate_code(user_code: str, question: Dict[str, Any]) -> Dict[str, Any]:
    """
    Runs user code against structured test cases.
    Uses threading timeout with a 5 second cap per test case.
    """
    blocked_patterns = [
        "import os",
        "import sys",
        "import subprocess",
        "import shutil",
        "import socket",
        "import importlib",
        "os.system",
        "subprocess.run",
        "subprocess.call",
        "__import__",
        "open(",
        "exec(",
        "eval(",
    ]
    for pattern in blocked_patterns:
        if pattern in user_code:
            return {
                "passed": False,
                "error": f"Security violation: '{pattern}' is not allowed",
                "test_cases_passed": 0,
                "test_cases_total": 2,
                "execution_time_ms": 0,
                "errors": [f"Security violation: '{pattern}' is not allowed"],
            }

    fn_name = question.get("function_name", "solution")
    test_cases = (question.get("test_cases") or [])[:2]

    if not test_cases:
        return {
            "passed": True,
            "test_cases_passed": 0,
            "test_cases_total": 0,
            "error": "No test cases available",
            "execution_time_ms": 0,
            "errors": ["No test cases available"],
        }

    if not user_code.strip():
        return {
            "passed": False,
            "test_cases_passed": 0,
            "test_cases_total": len(test_cases),
            "execution_time_ms": 0,
            "error": "No code submitted",
            "errors": ["No code submitted"],
        }

    start_time = time.time()
    harness = [
        user_code,
        "",
        "import json",
        f"fn_name = {json.dumps(fn_name)}",
        f"test_cases = {json.dumps(test_cases)}",
        "fn = globals().get(fn_name)",
        "if fn is None:",
        "    print('__ASSESSMENT_RESULT__=' + json.dumps({'error': f\"Function {fn_name!r} not found\", 'test_cases_passed': 0, 'test_cases_total': len(test_cases), 'errors': [f\"Function {fn_name!r} not found\"], 'passed': False}))",
        "else:",
        "    passed = 0",
        "    errors = []",
        "    for idx, tc in enumerate(test_cases, start=1):",
        "        try:",
        "            output = fn(*tc.get('input_args', []))",
        "            expected = tc.get('expected_output')",
        "            if output == expected:",
        "                passed += 1",
        "            else:",
        "                errors.append(f\"TC{idx}: got {output!r}, expected {expected!r}\")",
        "        except Exception as e:",
        "            errors.append(f\"TC{idx} error: {str(e)}\")",
        "    result = {'passed': passed == len(test_cases), 'test_cases_passed': passed, 'test_cases_total': len(test_cases), 'errors': errors}",
        "    print('__ASSESSMENT_RESULT__=' + json.dumps(result))",
    ]
    script = "\n".join(harness)

    try:
        piston_response = _run_python_in_piston(script)
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, json.JSONDecodeError, Exception) as exc:  # noqa: BLE001
        return {
            "passed": False,
            "test_cases_passed": 0,
            "test_cases_total": len(test_cases),
            "errors": [f"Piston execution failed: {str(exc)}"],
            "execution_time_ms": round((time.time() - start_time) * 1000, 2),
            "error": f"Piston execution failed: {str(exc)}",
        }

    run_data = piston_response.get("run", {}) if isinstance(piston_response, dict) else {}
    stdout = str(run_data.get("stdout", ""))
    stderr = str(run_data.get("stderr", ""))
    runtime_ms = run_data.get("time")
    try:
        runtime_ms = round(float(runtime_ms) * 1000, 2) if runtime_ms is not None else None
    except Exception:  # noqa: BLE001
        runtime_ms = None

    marker = "__ASSESSMENT_RESULT__="
    parsed: Optional[Dict[str, Any]] = None
    for line in stdout.splitlines()[::-1]:
        if line.startswith(marker):
            try:
                parsed = json.loads(line[len(marker) :])
            except Exception:  # noqa: BLE001
                parsed = None
            break

    if not parsed:
        err = stderr or "No structured result returned from piston run"
        return {
            "passed": False,
            "test_cases_passed": 0,
            "test_cases_total": len(test_cases),
            "errors": [err],
            "execution_time_ms": runtime_ms or round((time.time() - start_time) * 1000, 2),
            "error": err,
        }

    parsed.setdefault("passed", False)
    parsed.setdefault("test_cases_passed", 0)
    parsed.setdefault("test_cases_total", len(test_cases))
    parsed.setdefault("errors", [])
    parsed["execution_time_ms"] = runtime_ms or round((time.time() - start_time) * 1000, 2)
    parsed["error"] = None if parsed.get("passed") else "; ".join(parsed.get("errors", []))
    return parsed


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

    prompt = f"""You are a senior code reviewer. Grade this submission briefly.

Problem: {question.get('title', 'Unknown Problem')} (Topic: {question.get('topic', 'Unknown')}, Level: {question.get('difficulty_label', 'medium')})
Test Results: {eval_result.get('test_cases_passed', 0)}/{eval_result.get('test_cases_total', 0)} test cases passed
Errors: {eval_result.get('errors', [])}

User Code:
{user_code[:1000]}

Return ONLY this JSON (no markdown, no explanation):
{{
  "score": <integer 0-100>,
  "feedback": "<2 sentences: what was good and what was wrong>",
  "improvement": "<1 specific actionable tip>",
  "time_complexity": "<e.g. O(n)>",
  "space_complexity": "<e.g. O(1)>"
}}"""

    parsed: Dict[str, Any]
    try:
        raw = call_groq(prompt, model="llama-3.1-8b-instant")
        parsed = _extract_json(raw)
    except Exception:
        parsed = {
            "score": 30 if int(eval_result.get("test_cases_passed", 0)) > 0 else 0,
            "feedback": (
                f"Passed {eval_result.get('test_cases_passed', 0)}/"
                f"{eval_result.get('test_cases_total', 0)} test cases."
            ),
            "improvement": "Review your logic for edge cases.",
            "time_complexity": "Not evaluated",
            "space_complexity": "Not evaluated",
        }

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
    resume_skill_score = _normalize_skill_vector(skills).get(topic, 0.5)
    difficulty = get_difficulty(user_id, resume_skill_score)
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

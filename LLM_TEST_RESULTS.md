# LLM Basic Response Test

- Timestamp (UTC): 2026-03-25T21:11:21.254195+00:00
- Execution mode: direct call_groq (fallback bypassed for this test)

## Test 1: Question Model Smoke Test

- Model: qwen/qwen3-32b
- Prompt: Return ONLY valid JSON with keys ok, model, task where ok=true and task='question_generation_smoke'.
- Status: SUCCESS

### JSON Response
```
{
  "ok": true,
  "model": "",
  "task": "question_generation_smoke"
}
```

## Test 2: Grader Model Smoke Test

- Model: llama-3.1-8b-instant
- Prompt: Return ONLY valid JSON with keys ok, model, task where ok=true and task='grading_smoke'.
- Status: SUCCESS

### JSON Response
```
{
  "ok": true,
  "model": "grading_model",
  "task": "grading_smoke"
}
```

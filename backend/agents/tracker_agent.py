from typing import Dict, List

from db.postgres import fetch_all


def detect_stagnation(user_id: int) -> Dict[str, object]:
    rows = fetch_all(
        "SELECT score FROM assessments WHERE user_id = %s ORDER BY created_at DESC LIMIT 5",
        (user_id,),
    )
    scores: List[int] = [int(row["score"]) for row in rows if row.get("score") is not None]

    if len(scores) < 3:
        return {
            "stagnant": False,
            "reason": "Not enough assessments yet",
            "scores": scores,
        }

    delta = max(scores) - min(scores)
    stagnant = delta <= 8

    if stagnant:
        return {
            "stagnant": True,
            "reason": "Scores have not improved significantly across recent attempts",
            "scores": scores,
            "recommendation": "Switch topic and focus on fundamentals for one week",
        }

    return {
        "stagnant": False,
        "reason": "Learning progression detected",
        "scores": scores,
    }

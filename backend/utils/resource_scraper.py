import json
import os
import re
import time
from datetime import datetime, timezone

import redis
from duckduckgo_search import DDGS
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


TRUSTED_CHANNELS = [
    "Traversy Media",
    "freeCodeCamp.org",
    "Fireship",
    "Tech With Tim",
    "NeetCode",
    "Corey Schafer",
    "The Net Ninja",
    "Programming with Mosh",
    "ByteByteGo",
    "ArjanCodes",
    "Web Dev Simplified",
    "Hussein Nasser",
    "Academind",
    "Kevin Powell",
    "Sentdex",
    "CS Dojo",
    "TechWorld with Nana",
]

SKILL_QUERY_MAP = {
    "Python": "{d} python programming tutorial",
    "DSA": "{d} data structures algorithms python",
    "SQL": "{d} sql tutorial for developers",
    "React": "{d} react tutorial hooks 2024",
    "System Design": "system design {d} concepts explained",
    "Docker": "{d} docker tutorial for developers",
    "AWS": "{d} aws cloud tutorial beginners",
}

DIFFICULTY_WORDS = {
    "beginner": "beginner",
    "intermediate": "intermediate",
    "intermediate-advanced": "advanced",
    "advanced": "advanced",
}

FALLBACK_URLS = {
    "Python": "https://www.freecodecamp.org/learn/scientific-computing-with-python/",
    "DSA": "https://www.geeksforgeeks.org/data-structures/",
    "SQL": "https://www.w3schools.com/sql/",
    "React": "https://react.dev/learn",
    "System Design": "https://github.com/donnemartin/system-design-primer",
    "Docker": "https://docs.docker.com/get-started/",
    "AWS": "https://aws.amazon.com/getting-started/",
}

redis_client = redis.Redis(host=os.getenv("REDIS_HOST", "redis"), port=6379, decode_responses=True)

YT_API_KEYS = [
    os.getenv("YOUTUBE_API_KEY_1", "").strip(),
    os.getenv("YOUTUBE_API_KEY_2", "").strip(),
    os.getenv("YOUTUBE_API_KEY_3", "").strip(),
    os.getenv("YOUTUBE_API_KEY", "").strip(),
    os.getenv("YT_SEARCH_API_KEY", "").strip(),
]
YT_API_KEYS = [k for k in YT_API_KEYS if k]

key_index = 0


def get_yt_client():
    global key_index
    keys = [k for k in YT_API_KEYS if k]
    if not keys:
        raise ValueError("No YouTube API keys configured")
    key = keys[key_index % len(keys)]
    key_index += 1
    return build("youtube", "v3", developerKey=key)


def _fmt_count(n_str: str) -> str:
    n = int(n_str or 0)
    if n >= 1_000_000:
        return f"{n / 1_000_000:.1f}M"
    if n >= 1_000:
        return f"{n / 1_000:.0f}K"
    return str(n)


def _format_duration(iso: str) -> str:
    match = re.match(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", iso or "")
    if not match:
        return "N/A"

    hours = int(match.group(1) or 0)
    minutes = int(match.group(2) or 0)
    seconds = int(match.group(3) or 0)

    if hours > 0:
        return f"{hours}:{minutes:02d}:{seconds:02d}"
    return f"{minutes}:{seconds:02d}"


def _years_since(published_at: str) -> float:
    try:
        dt = datetime.fromisoformat((published_at or "").replace("Z", "+00:00"))
        now = datetime.now(timezone.utc)
        return (now - dt).days / 365
    except Exception:  # noqa: BLE001
        return 999


def compute_trust_score(
    channel_name: str,
    subscriber_count: int,
    video_view_count: int,
    like_count: int,
    published_at: str,
) -> dict:
    score = 0
    trust_reasons = []

    if subscriber_count >= 500_000:
        score += 50
        trust_reasons.append(f"500K+ subscribers ({_fmt_count(str(subscriber_count))})")
    elif subscriber_count >= 100_000:
        score += 30
        trust_reasons.append(f"100K+ subscribers ({_fmt_count(str(subscriber_count))})")
    elif subscriber_count >= 10_000:
        score += 10
        trust_reasons.append(f"10K+ subscribers ({_fmt_count(str(subscriber_count))})")

    ratio = None
    if video_view_count > 0:
        ratio = like_count / video_view_count
        if ratio >= 0.02:
            score += 10
            trust_reasons.append(f"Good engagement ({ratio * 100:.1f}% like ratio)")

    if video_view_count >= 200_000:
        score += 20
        trust_reasons.append(f"200K+ views on this video ({_fmt_count(str(video_view_count))})")
    elif video_view_count >= 50_000:
        score += 10
        trust_reasons.append(f"50K+ views on this video ({_fmt_count(str(video_view_count))})")

    if any(tc.lower() in channel_name.lower() for tc in TRUSTED_CHANNELS):
        score += 10
        trust_reasons.append("Known trusted educator channel")

    age = _years_since(published_at)
    if age <= 2:
        score += 10
        trust_reasons.append("Published within last 2 years")
    if age > 5:
        score -= 10
        trust_reasons.append("Published over 5 years ago - may be outdated")

    score = max(0, min(100, score))

    if score >= 70:
        trust_label = "Highly Trusted"
    elif score >= 40:
        trust_label = "Trusted"
    else:
        trust_label = "Unverified"

    return {
        "trust_score": int(score),
        "trust_label": trust_label,
        "trust_reasons": trust_reasons,
        "subscribers": _fmt_count(str(subscriber_count)),
        "like_count": _fmt_count(str(like_count)),
        "like_view_ratio": f"{ratio * 100:.1f}%" if ratio is not None else "N/A",
    }


def _search_youtube_once(yt, query: str, max_results: int) -> list:
    search_resp = (
        yt.search()
        .list(
            q=query,
            part="id,snippet",
            maxResults=max_results + 4,
            type="video",
            videoDuration="medium",
            relevanceLanguage="en",
            order="relevance",
        )
        .execute()
    )
    items = search_resp.get("items", [])
    if not items:
        return []

    video_ids = [i["id"]["videoId"] for i in items if i.get("id", {}).get("videoId")]
    channel_ids = [i["snippet"]["channelId"] for i in items if i.get("snippet", {}).get("channelId")]
    if not video_ids or not channel_ids:
        return []

    videos_resp = yt.videos().list(part="statistics,contentDetails", id=",".join(video_ids)).execute()
    video_stats = {v["id"]: v for v in videos_resp.get("items", [])}

    channels_resp = yt.channels().list(part="statistics", id=",".join(sorted(set(channel_ids)))).execute()
    channel_stats = {c["id"]: c for c in channels_resp.get("items", [])}

    results = []
    for item in items:
        vid_id = item.get("id", {}).get("videoId")
        if not vid_id:
            continue

        snip = item.get("snippet", {})
        channel_id = snip.get("channelId", "")
        channel_name = snip.get("channelTitle", "")

        v_data = video_stats.get(vid_id, {})
        c_data = channel_stats.get(channel_id, {})

        view_count = int(v_data.get("statistics", {}).get("viewCount", "0") or "0")
        like_count = int(v_data.get("statistics", {}).get("likeCount", "0") or "0")
        sub_count = int(c_data.get("statistics", {}).get("subscriberCount", "0") or "0")
        published = snip.get("publishedAt", "")
        duration = v_data.get("contentDetails", {}).get("duration", "PT0S")

        trust = compute_trust_score(
            channel_name=channel_name,
            subscriber_count=sub_count,
            video_view_count=view_count,
            like_count=like_count,
            published_at=published,
        )

        thumb = snip.get("thumbnails", {}).get("high", {}).get("url")
        if not thumb:
            thumb = snip.get("thumbnails", {}).get("medium", {}).get("url", "")

        results.append(
            {
                "type": "video",
                "title": snip.get("title", "Untitled"),
                "channel": channel_name,
                "url": f"https://youtube.com/watch?v={vid_id}",
                "thumbnail": thumb,
                "duration": _format_duration(duration),
                "published": published[:10],
                "views": _fmt_count(str(view_count)),
                "likes": _fmt_count(str(like_count)),
                "subscribers": trust["subscribers"],
                "like_view_ratio": trust["like_view_ratio"],
                "trust_score": trust["trust_score"],
                "trust_label": trust["trust_label"],
                "trust_reasons": trust["trust_reasons"],
                "trusted": trust["trust_label"] in {"Highly Trusted", "Trusted"},
            }
        )

    results.sort(key=lambda x: x.get("trust_score", 0), reverse=True)
    return results[:max_results]


def search_youtube(query: str, max_results: int = 2) -> list:
    try:
        if not YT_API_KEYS:
            return []

        attempts = 0
        max_attempts = len(YT_API_KEYS)
        while attempts < max_attempts:
            try:
                yt = get_yt_client()
                results = _search_youtube_once(yt, query, max_results)
                print(f"[YT] '{query}' -> {len(results)} results")
                for v in results:
                    print(f"  [{v['trust_score']} {v['trust_label']}] {v['channel']} - {v['title'][:50]}")
                return results
            except HttpError as err:
                status = getattr(getattr(err, "resp", None), "status", None)
                if status == 403:
                    attempts += 1
                    print(f"[YT] quota/403 on key attempt {attempts}/{max_attempts}, rotating key")
                    continue
                print(f"[YT] HttpError: {err}")
                return []

        print("[YT] all configured YouTube API keys exhausted")
        return []
    except Exception as err:  # noqa: BLE001
        print(f"[YT] search error: {err}")
        return []


def search_articles(query: str, max_results: int = 1) -> list:
    trusted_domains = [
        "freecodecamp.org",
        "developer.mozilla.org",
        "react.dev",
        "docs.python.org",
        "realpython.com",
        "docs.docker.com",
        "geeksforgeeks.org",
        "dev.to",
        "digitalocean.com",
    ]
    try:
        with DDGS() as ddg:
            results = list(ddg.text(query, max_results=max_results + 4))

        arts = [
            {
                "type": "article",
                "title": r.get("title", "Untitled"),
                "url": r.get("href", ""),
                "snippet": str(r.get("body", ""))[:200],
                "trusted": any(d in r.get("href", "") for d in trusted_domains),
            }
            for r in results
        ]
        arts.sort(key=lambda x: not x["trusted"])
        return arts[:max_results]
    except Exception as err:  # noqa: BLE001
        print(f"[DDG] error: {err}")
        return []


def fetch_resources(skill: str, difficulty_label: str, module_name: str) -> list:
    cache_key = f"resources:{skill}:{difficulty_label}"
    cached = redis_client.get(cache_key)
    if cached:
        print(f"[Cache] HIT {cache_key}")
        return json.loads(cached)

    d = DIFFICULTY_WORDS.get(difficulty_label, "intermediate")
    yt_query = SKILL_QUERY_MAP.get(skill, f"{d} {skill} tutorial").replace("{d}", d)
    ddg_q = f"{d} {skill} tutorial {module_name}"

    videos = search_youtube(yt_query, max_results=2)
    articles = search_articles(ddg_q, max_results=1)
    result = videos + articles

    if not result:
        result = [
            {
                "type": "article",
                "title": f"{skill} Official Documentation",
                "url": FALLBACK_URLS.get(skill, "https://www.freecodecamp.org"),
                "snippet": f"Official learning resource for {skill}",
                "trusted": True,
            }
        ]

    redis_client.set(cache_key, json.dumps(result), ex=86400)
    print(f"[Cache] SET {cache_key} ({len(result)} resources, TTL 24hr)")
    time.sleep(0.3)
    return result

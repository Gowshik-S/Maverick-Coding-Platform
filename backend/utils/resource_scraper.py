import json
import os
import re
import time

import redis
from duckduckgo_search import DDGS
from googleapiclient.discovery import build


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
]

SKILL_QUERY_MAP = {
    "Python": "beginner python programming tutorial",
    "DSA": "beginner data structures algorithms python",
    "SQL": "beginner sql tutorial for developers",
    "React": "beginner react tutorial hooks 2024",
    "System Design": "system design beginner concepts explained",
    "Docker": "beginner docker tutorial for developers",
    "AWS": "beginner aws cloud tutorial",
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

FALLBACK_VIDEO_URLS = {
    "Python": "https://www.youtube.com/watch?v=rfscVS0vtbw",
    "DSA": "https://www.youtube.com/watch?v=8hly31xKli0",
    "SQL": "https://www.youtube.com/watch?v=HXV3zeQKqGY",
    "React": "https://www.youtube.com/watch?v=bMknfKXIFA8",
    "System Design": "https://www.youtube.com/watch?v=MbjObHmDbZo",
    "Docker": "https://www.youtube.com/watch?v=3c-iBn73dDE",
    "AWS": "https://www.youtube.com/watch?v=ulprqHHWlng",
}

redis_client = redis.Redis(host=os.getenv("REDIS_HOST", "redis"), port=6379, decode_responses=True)
YOUTUBE_API_KEYS = [
    os.getenv("YOUTUBE_API_KEY_1", "").strip(),
    os.getenv("YOUTUBE_API_KEY_2", "").strip(),
    os.getenv("YOUTUBE_API_KEY_3", "").strip(),
    os.getenv("YOUTUBE_API_KEY", "").strip(),
    os.getenv("YT_SEARCH_API_KEY", "").strip(),
]
YOUTUBE_API_KEYS = [k for k in YOUTUBE_API_KEYS if k]


def _format_duration(iso: str) -> str:
    if not iso:
        return "0:00"
    match = re.match(r"^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$", iso)
    if not match:
        return "0:00"

    h = int(match.group(1) or 0)
    m = int(match.group(2) or 0)
    s = int(match.group(3) or 0)
    if h > 0:
        return f"{h}:{m:02d}:{s:02d}"
    return f"{m}:{s:02d}"


def _fmt_views(v: str) -> str:
    try:
        n = int(v or 0)
    except Exception:  # noqa: BLE001
        return "0"

    if n >= 1_000_000:
        return f"{n / 1_000_000:.1f}M"
    if n >= 1_000:
        return f"{n / 1_000:.1f}K"
    return str(n)


def search_youtube(query, max_results=2) -> list:
    try:
        if not YOUTUBE_API_KEYS:
            return []
        yt = build("youtube", "v3", developerKey=YOUTUBE_API_KEYS[0])
        search_resp = (
            yt.search()
            .list(
                q=query,
                part="id,snippet",
                maxResults=max_results + 3,
                type="video",
                videoDuration="medium",
                relevanceLanguage="en",
                order="relevance",
            )
            .execute()
        )

        items = search_resp.get("items", [])
        ids = [i.get("id", {}).get("videoId") for i in items if i.get("id", {}).get("videoId")]
        if not ids:
            return []

        stats_resp = yt.videos().list(part="statistics,contentDetails", id=",".join(ids)).execute()
        stats = {i.get("id"): i for i in stats_resp.get("items", [])}

        out = []
        for i in items:
            vid_id = i.get("id", {}).get("videoId")
            snip = i.get("snippet", {})
            channel = snip.get("channelTitle", "")
            stat_item = stats.get(vid_id, {})
            details = stat_item.get("contentDetails", {})
            statistics = stat_item.get("statistics", {})
            out.append(
                {
                    "type": "video",
                    "title": snip.get("title", "Untitled"),
                    "channel": channel,
                    "url": f"https://youtube.com/watch?v={vid_id}",
                    "duration": _format_duration(details.get("duration", "")),
                    "views": _fmt_views(statistics.get("viewCount", "0")),
                    "thumbnail": snip.get("thumbnails", {}).get("high", {}).get("url", ""),
                    "published": str(snip.get("publishedAt", ""))[:10],
                    "trusted": any(t.lower() in channel.lower() for t in TRUSTED_CHANNELS),
                }
            )

        out.sort(key=lambda x: (not x.get("trusted", False), x.get("title", "")))
        return out[:max_results]
    except Exception:  # noqa: BLE001
        return []


def search_articles(query, max_results=1) -> list:
    trusted_domains = [
        "freecodecamp.org",
        "developer.mozilla.org",
        "react.dev",
        "docs.python.org",
        "realpython.com",
        "geeksforgeeks.org",
        "dev.to",
        "digitalocean.com",
        "docs.docker.com",
    ]
    try:
        with DDGS() as ddg:
            results = list(ddg.text(query, max_results=max_results + 4))

        out = []
        for r in results:
            href = r.get("href", "")
            out.append(
                {
                    "type": "article",
                    "title": r.get("title", "Untitled"),
                    "url": href,
                    "snippet": str(r.get("body", ""))[:200],
                    "trusted": any(d in href for d in trusted_domains),
                }
            )
        out.sort(key=lambda x: (not x.get("trusted", False), x.get("title", "")))
        return out[:max_results]
    except Exception:  # noqa: BLE001
        return []


def fetch_resources(skill, difficulty_label, module_name) -> list:
    cache_key = f"resources:{skill}:{difficulty_label}"
    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)

    d = DIFFICULTY_WORDS.get(difficulty_label, "intermediate")
    base_query = SKILL_QUERY_MAP.get(skill, f"{d} {skill} tutorial")
    yt_query = base_query.replace("beginner", d)
    ddg_query = f"{d} {skill} tutorial {module_name}"

    videos = search_youtube(yt_query, 2) if YOUTUBE_API_KEYS else []
    articles = search_articles(ddg_query, 1)
    if not videos:
        videos = [
            {
                "type": "video",
                "title": f"{skill} Quickstart Video",
                "channel": "freeCodeCamp.org",
                "url": FALLBACK_VIDEO_URLS.get(skill, "https://www.youtube.com/@freecodecamp"),
                "duration": "0:00",
                "views": "N/A",
                "thumbnail": "",
                "published": "",
                "trusted": True,
            }
        ]

    result = videos + articles

    if not result:
        result = [
            {
                "type": "article",
                "title": f"{skill} Official Docs",
                "url": FALLBACK_URLS.get(skill, "https://www.freecodecamp.org"),
                "snippet": f"Official resource for {skill}",
                "trusted": True,
            }
        ]

    redis_client.set(cache_key, json.dumps(result), ex=86400)
    time.sleep(0.3)
    return result

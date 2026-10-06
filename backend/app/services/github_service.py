"""GitHub data service. Not on the critical path: the frontend does not call it yet.

Wire it to a router when you want live repo cards. The token stays server-side,
responses are cached in memory, and any failure returns None instead of raising.
"""
import logging
import time

import httpx

from app.core.config import get_settings

log = logging.getLogger(__name__)
_CACHE: dict[str, tuple[float, list[dict]]] = {}
_TTL_SECONDS = 600


def get_repos() -> list[dict] | None:
    s = get_settings()
    if not s.github_username:
        return None
    hit = _CACHE.get(s.github_username)
    if hit and time.time() - hit[0] < _TTL_SECONDS:
        return hit[1]
    headers = {"Accept": "application/vnd.github+json"}
    if s.github_token:
        headers["Authorization"] = f"Bearer {s.github_token}"
    try:
        r = httpx.get(
            f"https://api.github.com/users/{s.github_username}/repos",
            params={"sort": "updated", "per_page": 12},
            headers=headers,
            timeout=5,
        )
        r.raise_for_status()
    except httpx.HTTPError as exc:
        log.warning("GitHub request failed: %s", exc)
        return None
    repos = [
        {"name": x["name"], "description": x["description"], "url": x["html_url"], "stars": x["stargazers_count"], "language": x["language"]}
        for x in r.json()
        if not x.get("fork")
    ]
    _CACHE[s.github_username] = (time.time(), repos)
    return repos

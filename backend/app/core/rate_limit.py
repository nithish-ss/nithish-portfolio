from slowapi import Limiter
from slowapi.util import get_remote_address

# Per-IP limiter. Behind a proxy, run uvicorn with --proxy-headers so the real client IP is used.
limiter = Limiter(key_func=get_remote_address)

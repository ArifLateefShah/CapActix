"""JWT helpers for email-only authentication."""

import os
from datetime import datetime, timezone, timedelta
from typing import Optional

import jwt
from fastapi import HTTPException, Request

JWT_ALGORITHM = "HS256"


def _secret() -> str:
    secret = os.environ.get("JWT_SECRET")
    if not secret:
        raise RuntimeError("JWT_SECRET not configured")
    return secret


def _expiry_days() -> int:
    try:
        return int(os.environ.get("JWT_EXPIRY_DAYS", "7"))
    except ValueError:
        return 7


def create_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(days=_expiry_days()),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, _secret(), algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, _secret(), algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def extract_bearer_token(request: Request) -> Optional[str]:
    auth = request.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        return auth[7:].strip() or None
    return None


def admin_emails() -> list[str]:
    emails = []
    for key in ("ADMIN_EMAIL_1", "ADMIN_EMAIL_2", "ADMIN_EMAIL_3"):
        v = (os.environ.get(key) or "").strip().lower()
        if v:
            emails.append(v)
    return emails


def is_admin(email: str) -> bool:
    return (email or "").strip().lower() in admin_emails()


def derive_full_name(email: str) -> str:
    """Convert akshara.karikalan@ideas2it.com → 'Akshara Karikalan'."""
    if not email or "@" not in email:
        return email or ""
    local = email.split("@", 1)[0]
    parts = [p for p in local.replace("_", ".").replace("-", ".").split(".") if p]
    if not parts:
        return local
    return " ".join(p.capitalize() for p in parts)

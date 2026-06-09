"""CapActix-PMS backend — auth, access tracking, admin usage."""

import logging
import os
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import List, Optional

from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

from fastapi import APIRouter, BackgroundTasks, Depends, FastAPI, HTTPException, Request  # noqa: E402
from motor.motor_asyncio import AsyncIOMotorClient  # noqa: E402
from pydantic import BaseModel, ConfigDict, EmailStr, Field  # noqa: E402
from starlette.middleware.cors import CORSMiddleware  # noqa: E402

from auth import (  # noqa: E402
    admin_emails,
    create_token,
    decode_token,
    derive_full_name,
    extract_bearer_token,
    is_admin,
)
from email_service import send_login_email, send_registration_email  # noqa: E402

# ---------------------------------------------------------------------------
# DB / app setup
# ---------------------------------------------------------------------------
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class AuthRequest(BaseModel):
    email: EmailStr


class UserPublic(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    created_at: str
    last_login_at: Optional[str] = None
    is_admin: bool = False


class AuthResponse(BaseModel):
    token: str
    user: UserPublic


class AccessLogEntry(BaseModel):
    id: str
    user_id: str
    full_name: str
    email: EmailStr
    access_type: str
    timestamp: str


class UsageRow(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    created_at: str
    last_login_at: Optional[str] = None
    login_count: int
    login_history: List[str]


class UsageResponse(BaseModel):
    total_users: int
    total_logins: int
    active_last_24h: int
    rows: List[UsageRow]


# ---------------------------------------------------------------------------
# DB helpers
# ---------------------------------------------------------------------------
def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _user_public(doc: dict) -> UserPublic:
    return UserPublic(
        id=doc["id"],
        full_name=doc["full_name"],
        email=doc["email"],
        created_at=doc["created_at"],
        last_login_at=doc.get("last_login_at"),
        is_admin=is_admin(doc["email"]),
    )


async def _log_access(user_doc: dict, access_type: str) -> dict:
    entry = {
        "id": str(uuid.uuid4()),
        "user_id": user_doc["id"],
        "full_name": user_doc["full_name"],
        "email": user_doc["email"],
        "access_type": access_type,
        "timestamp": _now_iso(),
    }
    await db.user_access_log.insert_one(entry)
    entry.pop("_id", None)
    return entry


# ---------------------------------------------------------------------------
# Auth dependency
# ---------------------------------------------------------------------------
async def get_current_user(request: Request) -> dict:
    token = extract_bearer_token(request)
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    payload = decode_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if not is_admin(user["email"]):
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


# ---------------------------------------------------------------------------
# Routes — base
# ---------------------------------------------------------------------------
@api_router.get("/")
async def root():
    return {"message": "CapActix-PMS API", "version": "1.0.0"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(payload: StatusCheckCreate):
    obj = StatusCheck(**payload.model_dump())
    doc = obj.model_dump()
    doc["timestamp"] = doc["timestamp"].isoformat()
    await db.status_checks.insert_one(doc)
    return obj


@api_router.get("/status", response_model=List[StatusCheck])
async def list_status_checks():
    docs = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for d in docs:
        if isinstance(d.get("timestamp"), str):
            d["timestamp"] = datetime.fromisoformat(d["timestamp"])
    return docs


# ---------------------------------------------------------------------------
# Routes — auth
# ---------------------------------------------------------------------------
@api_router.post("/auth/register", response_model=AuthResponse)
async def register(payload: AuthRequest, background: BackgroundTasks):
    email = payload.email.strip().lower()
    existing = await db.users.find_one({"email": email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered. Please log in instead.")

    now = _now_iso()
    user_doc = {
        "id": str(uuid.uuid4()),
        "full_name": derive_full_name(email),
        "email": email,
        "created_at": now,
        "last_login_at": now,
    }
    await db.users.insert_one(user_doc)
    user_doc.pop("_id", None)
    await _log_access(user_doc, "register")

    background.add_task(send_registration_email, user_doc["full_name"], user_doc["email"], now)

    token = create_token(user_doc["id"], user_doc["email"])
    return AuthResponse(token=token, user=_user_public(user_doc))


@api_router.post("/auth/login", response_model=AuthResponse)
async def login(payload: AuthRequest, background: BackgroundTasks):
    email = payload.email.strip().lower()
    user_doc = await db.users.find_one({"email": email}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=404, detail="No account found for this email. Please sign up first.")

    now = _now_iso()
    await db.users.update_one({"id": user_doc["id"]}, {"$set": {"last_login_at": now}})
    user_doc["last_login_at"] = now
    await _log_access(user_doc, "login")

    background.add_task(send_login_email, user_doc["full_name"], user_doc["email"], now)

    token = create_token(user_doc["id"], user_doc["email"])
    return AuthResponse(token=token, user=_user_public(user_doc))


@api_router.get("/auth/me", response_model=UserPublic)
async def me(user: dict = Depends(get_current_user)):
    return _user_public(user)


# ---------------------------------------------------------------------------
# Routes — admin
# ---------------------------------------------------------------------------
@api_router.get("/admin/usage", response_model=UsageResponse)
async def admin_usage(_: dict = Depends(require_admin)):
    users = await db.users.find({}, {"_id": 0}).sort("created_at", -1).to_list(2000)
    rows: List[UsageRow] = []
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(hours=24)
    active_24h = 0
    total_logins = 0
    for u in users:
        login_logs = (
            await db.user_access_log.find(
                {"user_id": u["id"], "access_type": "login"}, {"_id": 0, "timestamp": 1}
            )
            .sort("timestamp", -1)
            .to_list(50)
        )
        history = [entry["timestamp"] for entry in login_logs]
        total_logins += len(history)
        last_login = u.get("last_login_at")
        if last_login:
            try:
                if datetime.fromisoformat(last_login) >= cutoff:
                    active_24h += 1
            except ValueError:
                pass
        rows.append(
            UsageRow(
                id=u["id"],
                full_name=u["full_name"],
                email=u["email"],
                created_at=u["created_at"],
                last_login_at=last_login,
                login_count=len(history),
                login_history=history,
            )
        )
    return UsageResponse(
        total_users=len(rows),
        total_logins=total_logins,
        active_last_24h=active_24h,
        rows=rows,
    )


@api_router.get("/admin/access-log", response_model=List[AccessLogEntry])
async def admin_access_log(_: dict = Depends(require_admin)):
    logs = (
        await db.user_access_log.find({}, {"_id": 0}).sort("timestamp", -1).to_list(500)
    )
    return logs


# ---------------------------------------------------------------------------
# App wire-up
# ---------------------------------------------------------------------------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    try:
        await db.users.create_index("email", unique=True)
        await db.user_access_log.create_index("user_id")
        await db.user_access_log.create_index("timestamp")
        logger.info("MongoDB indexes ensured. Admin emails configured: %s", admin_emails())
    except Exception:  # noqa: BLE001
        logger.exception("Index creation failed")


@app.on_event("shutdown")
async def on_shutdown():
    client.close()

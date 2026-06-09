"""Backend tests for CapActix-PMS auth + admin access tracking + email fallback."""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "http://localhost:8001").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "akshara.karikalan@ideas2it.com"
NON_ADMIN_EMAIL = f"qa.tester.{uuid.uuid4().hex[:6]}@example.com"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def admin_token(session):
    # try register first; if 409, fall back to login
    r = session.post(f"{API}/auth/register", json={"email": ADMIN_EMAIL})
    if r.status_code == 409:
        r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL})
    assert r.status_code == 200, f"admin login failed: {r.status_code} {r.text}"
    data = r.json()
    assert data["user"]["is_admin"] is True
    return data["token"]


@pytest.fixture(scope="module")
def non_admin_token(session):
    r = session.post(f"{API}/auth/register", json={"email": NON_ADMIN_EMAIL})
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["user"]["is_admin"] is False
    return data["token"]


# ---------- Auth ----------
class TestRegister:
    def test_register_new_user_returns_token_and_derived_name(self, session):
        email = f"new.user.{uuid.uuid4().hex[:6]}@example.com"
        r = session.post(f"{API}/auth/register", json={"email": email})
        assert r.status_code == 200, r.text
        data = r.json()
        assert "token" in data and isinstance(data["token"], str)
        u = data["user"]
        assert u["email"] == email.lower()
        # derived: "new.user.xxx" -> "New User Xxxxxx"
        assert u["full_name"].split()[0] == "New"
        assert u["is_admin"] is False
        assert u["created_at"] and u["last_login_at"]

    def test_register_admin_email_marks_is_admin(self, session):
        # idempotent via login path
        r = session.post(f"{API}/auth/register", json={"email": ADMIN_EMAIL})
        if r.status_code == 409:
            r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL})
        assert r.status_code == 200
        u = r.json()["user"]
        assert u["is_admin"] is True
        assert u["full_name"] == "Akshara Karikalan"

    def test_register_duplicate_returns_409(self, session):
        email = f"dup.{uuid.uuid4().hex[:6]}@example.com"
        r1 = session.post(f"{API}/auth/register", json={"email": email})
        assert r1.status_code == 200
        r2 = session.post(f"{API}/auth/register", json={"email": email})
        assert r2.status_code == 409
        assert "already registered" in r2.json().get("detail", "").lower()

    def test_email_normalized_lowercase(self, session):
        email = f"MixedCase.{uuid.uuid4().hex[:6]}@Example.COM"
        r = session.post(f"{API}/auth/register", json={"email": email})
        assert r.status_code == 200
        assert r.json()["user"]["email"] == email.lower()


class TestLogin:
    def test_login_unknown_email_404(self, session):
        r = session.post(f"{API}/auth/login", json={"email": f"never.{uuid.uuid4().hex}@nowhere.tld"})
        assert r.status_code == 404
        assert "no account" in r.json().get("detail", "").lower()

    def test_login_updates_last_login(self, session, non_admin_token):
        # login again -> last_login should update
        r1 = session.post(f"{API}/auth/login", json={"email": NON_ADMIN_EMAIL})
        assert r1.status_code == 200
        first = r1.json()["user"]["last_login_at"]
        time.sleep(1.1)
        r2 = session.post(f"{API}/auth/login", json={"email": NON_ADMIN_EMAIL})
        assert r2.status_code == 200
        second = r2.json()["user"]["last_login_at"]
        assert second > first


class TestMe:
    def test_me_requires_token(self, session):
        r = session.get(f"{API}/auth/me")
        assert r.status_code == 401

    def test_me_with_token(self, session, non_admin_token):
        r = session.get(f"{API}/auth/me", headers={"Authorization": f"Bearer {non_admin_token}"})
        assert r.status_code == 200
        assert r.json()["email"] == NON_ADMIN_EMAIL


# ---------- Admin gating ----------
class TestAdminGating:
    def test_usage_non_admin_403(self, session, non_admin_token):
        r = session.get(f"{API}/admin/usage", headers={"Authorization": f"Bearer {non_admin_token}"})
        assert r.status_code == 403
        assert "admin access required" in r.json().get("detail", "").lower()

    def test_usage_no_token_401(self, session):
        r = session.get(f"{API}/admin/usage")
        assert r.status_code == 401

    def test_usage_admin_shape(self, session, admin_token):
        r = session.get(f"{API}/admin/usage", headers={"Authorization": f"Bearer {admin_token}"})
        assert r.status_code == 200, r.text
        data = r.json()
        for k in ("total_users", "total_logins", "active_last_24h", "rows"):
            assert k in data
        assert isinstance(data["rows"], list)
        if data["rows"]:
            row = data["rows"][0]
            for k in ("id", "full_name", "email", "created_at", "last_login_at", "login_count", "login_history"):
                assert k in row, f"missing {k}"

    def test_access_log_admin_only_and_contains_register_and_login(self, session, admin_token, non_admin_token):
        r = session.get(f"{API}/admin/access-log", headers={"Authorization": f"Bearer {admin_token}"})
        assert r.status_code == 200
        logs = r.json()
        assert isinstance(logs, list) and logs
        types = {e["access_type"] for e in logs}
        assert "register" in types
        assert "login" in types
        # validate fields
        sample = logs[0]
        for k in ("id", "user_id", "full_name", "email", "access_type", "timestamp"):
            assert k in sample

    def test_access_log_forbidden_for_non_admin(self, session, non_admin_token):
        r = session.get(f"{API}/admin/access-log", headers={"Authorization": f"Bearer {non_admin_token}"})
        assert r.status_code == 403


# ---------- Email console fallback ----------
class TestEmailFallback:
    def _read_logs(self):
        out = ""
        for p in ("/var/log/supervisor/backend.err.log", "/var/log/supervisor/backend.out.log"):
            try:
                with open(p, "r") as f:
                    out += f.read()
            except Exception:
                pass
        return out

    def test_register_triggers_console_fallback(self, session):
        email = f"fallback.reg.{uuid.uuid4().hex[:6]}@example.com"
        r = session.post(f"{API}/auth/register", json={"email": email})
        assert r.status_code == 200
        # Background task — give it a moment
        time.sleep(2)
        logs = self._read_logs()
        assert "[email:CONSOLE-FALLBACK]" in logs
        # Must contain all three admin recipients
        for adm in ("akshara.karikalan@ideas2it.com", "pramodh@ideas2it.com", "selvakumar.rayappan@ideas2it.com"):
            assert adm in logs, f"admin {adm} missing from email logs"
        assert "New User Registration" in logs

    def test_login_triggers_console_fallback_with_login_subject(self, session):
        email = f"fallback.login.{uuid.uuid4().hex[:6]}@example.com"
        # register then login
        assert session.post(f"{API}/auth/register", json={"email": email}).status_code == 200
        assert session.post(f"{API}/auth/login", json={"email": email}).status_code == 200
        time.sleep(2)
        logs = self._read_logs()
        assert "User Login Notification" in logs

"""SendGrid email service with graceful console-log fallback."""

import logging
import os
from typing import List

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

logger = logging.getLogger(__name__)


def _admin_recipients() -> List[str]:
    recipients = []
    for key in ("ADMIN_EMAIL_1", "ADMIN_EMAIL_2", "ADMIN_EMAIL_3"):
        v = (os.environ.get(key) or "").strip()
        if v:
            recipients.append(v)
    return recipients


def _send_via_sendgrid(api_key: str, from_email: str, recipients: List[str], subject: str, body: str) -> bool:
    """Returns True if at least one accepted (HTTP 202) response was received."""
    client = SendGridAPIClient(api_key)
    sent_any = False
    for to in recipients:
        try:
            message = Mail(
                from_email=from_email,
                to_emails=to,
                subject=subject,
                plain_text_content=body,
            )
            resp = client.send(message)
            if resp.status_code in (200, 202):
                sent_any = True
                logger.info("SendGrid accepted email to %s (status %s)", to, resp.status_code)
            else:
                logger.warning("SendGrid responded %s for %s: %s", resp.status_code, to, getattr(resp, "body", b""))
        except Exception as exc:  # noqa: BLE001
            logger.exception("SendGrid send failed for %s: %s", to, exc)
    return sent_any


def send_admin_notification(subject: str, body: str) -> dict:
    """Send `subject`/`body` to all configured admin recipients.

    If SENDGRID_API_KEY or SENDGRID_FROM_EMAIL is missing, logs the payload
    to stdout instead of erroring. Designed to be safe in BackgroundTasks.
    Returns a small dict for testing/audit purposes.
    """
    recipients = _admin_recipients()
    api_key = (os.environ.get("SENDGRID_API_KEY") or "").strip()
    from_email = (os.environ.get("SENDGRID_FROM_EMAIL") or "").strip()

    if not recipients:
        logger.warning("[email] No admin recipients configured (ADMIN_EMAIL_1/2/3 empty). Skipping.")
        return {"mode": "skipped-no-recipients", "recipients": [], "subject": subject}

    if not api_key or not from_email:
        # Console-log fallback so the rest of the flow stays functional.
        banner = "=" * 72
        logger.info(
            "\n%s\n[email:CONSOLE-FALLBACK] (SendGrid not configured)\nTO: %s\nFROM: %s\nSUBJECT: %s\n\n%s\n%s",
            banner,
            ", ".join(recipients),
            from_email or "(SENDGRID_FROM_EMAIL unset)",
            subject,
            body,
            banner,
        )
        return {"mode": "console-fallback", "recipients": recipients, "subject": subject}

    sent = _send_via_sendgrid(api_key, from_email, recipients, subject, body)
    return {"mode": "sendgrid" if sent else "sendgrid-failed", "recipients": recipients, "subject": subject}


def send_registration_email(full_name: str, email: str, timestamp_iso: str) -> dict:
    subject = "New User Registration"
    body = (
        "A new user has registered.\n\n"
        f"Name: {full_name}\n"
        f"Email: {email}\n"
        f"Timestamp: {timestamp_iso}\n"
    )
    return send_admin_notification(subject, body)


def send_login_email(full_name: str, email: str, timestamp_iso: str) -> dict:
    subject = "User Login Notification"
    body = (
        "A user has logged into the application.\n\n"
        f"Name: {full_name}\n"
        f"Email: {email}\n"
        f"Timestamp: {timestamp_iso}\n"
    )
    return send_admin_notification(subject, body)

import httpx

from app.core.config import get_settings


def send_contact_email(
    name: str,
    email: str,
    message: str,
) -> None:
    settings = get_settings()

    if not settings.resend_api_key or not settings.contact_email:
        return

    payload = {
        "from": "Portfolio Contact <onboarding@resend.dev>",
        "to": [settings.contact_email],
        "subject": f"New portfolio message from {name}",
        "reply_to": email,
        "text": (
            f"You received a new message from your portfolio.\n\n"
            f"Name: {name}\n"
            f"Email: {email}\n\n"
            f"Message:\n{message}\n"
        ),
    }

    response = httpx.post(
        "https://api.resend.com/emails",
        headers={
            "Authorization": f"Bearer {settings.resend_api_key}",
            "Content-Type": "application/json",
        },
        json=payload,
        timeout=10,
    )

    response.raise_for_status()
from sqlalchemy.orm import Session

from app.models import ContactMessage
from app.schemas.contact import ContactIn


def save_message(db: Session, data: ContactIn, ip: str | None) -> ContactMessage:
    row = ContactMessage(name=data.name, email=str(data.email), message=data.message, ip_address=ip)
    db.add(row)
    db.commit()
    return row

from app.services.email_service import send_contact_email
import logging

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.rate_limit import limiter
from app.database.session import get_db
from app.schemas.contact import ContactIn, ContactOut
from app.schemas.content import BlogPostOut, ProjectOut
from app.services import contact_service, content_service

log = logging.getLogger(__name__)
router = APIRouter(prefix="/api")


@router.get("/health")
def health(db: Session = Depends(get_db)) -> dict:
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ok", "database": "up"}
    except SQLAlchemyError:
        return {"status": "degraded", "database": "down"}


@router.post("/contact", response_model=ContactOut, status_code=201)
@limiter.limit(get_settings().contact_rate_limit)
def contact(request: Request, payload: ContactIn, db: Session = Depends(get_db)) -> ContactOut:
    if payload.website:  # honeypot filled: pretend success, store nothing
        return ContactOut()

    ip = request.client.host if request.client else None

    try:
        contact_service.save_message(db, payload, ip)
        send_contact_email(
            name=payload.name,
            email=str(payload.email),
            message=payload.message,
        )
    except SQLAlchemyError:
        log.exception("Failed to store contact message")
        raise HTTPException(
            status_code=503,
            detail="Messages can't be saved right now. Please email me directly.",
        )

    return ContactOut()


@router.get("/projects", response_model=list[ProjectOut])
def projects(db: Session = Depends(get_db)):
    return content_service.list_projects(db)


@router.get("/projects/{slug}", response_model=ProjectOut)
def project(slug: str, db: Session = Depends(get_db)):
    row = content_service.get_project(db, slug)
    if not row:
        raise HTTPException(status_code=404, detail="Project not found")
    return row


@router.get("/blog", response_model=list[BlogPostOut])
def blog(db: Session = Depends(get_db)):
    return content_service.list_posts(db)


@router.get("/blog/{slug}", response_model=BlogPostOut)
def blog_post(slug: str, db: Session = Depends(get_db)):
    row = content_service.get_post(db, slug)
    if not row:
        raise HTTPException(status_code=404, detail="Post not found")
    return row

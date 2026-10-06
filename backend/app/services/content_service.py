from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import BlogPost, Project


def list_projects(db: Session) -> list[Project]:
    return list(db.scalars(select(Project).order_by(Project.created_at)))


def get_project(db: Session, slug: str) -> Project | None:
    return db.scalar(select(Project).where(Project.slug == slug))


def list_posts(db: Session) -> list[BlogPost]:
    return list(db.scalars(select(BlogPost).order_by(BlogPost.published_on.desc())))


def get_post(db: Session, slug: str) -> BlogPost | None:
    return db.scalar(select(BlogPost).where(BlogPost.slug == slug))

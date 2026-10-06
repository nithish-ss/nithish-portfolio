from datetime import date

from pydantic import BaseModel, ConfigDict


class ProjectOut(BaseModel):
    """Mirrors `Project` in frontend/src/data/types.ts (camelCase there, snake_case here)."""

    model_config = ConfigDict(from_attributes=True)
    slug: str
    title: str
    category: str
    year: str
    summary: str
    tags: list[str]
    github_url: str | None = None
    live_url: str | None = None
    ml_demo_url: str | None = None
    case_study: dict


class BlogPostOut(BaseModel):
    """Mirrors `BlogPost` in frontend/src/data/types.ts."""

    model_config = ConfigDict(from_attributes=True)
    slug: str
    title: str
    published_on: date
    reading_minutes: int
    tags: list[str]
    description: str
    body: list[str]

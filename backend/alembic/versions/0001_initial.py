"""initial tables

Revision ID: 0001
Revises:
"""
import sqlalchemy as sa
from alembic import op

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "projects",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("slug", sa.String(120), nullable=False),
        sa.Column("title", sa.String(200), nullable=False),
        sa.Column("category", sa.String(80), nullable=False),
        sa.Column("year", sa.String(10), nullable=False),
        sa.Column("summary", sa.Text, nullable=False),
        sa.Column("tags", sa.JSON, nullable=False),
        sa.Column("github_url", sa.String(300)),
        sa.Column("live_url", sa.String(300)),
        sa.Column("ml_demo_url", sa.String(300)),
        sa.Column("case_study", sa.JSON, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_projects_slug", "projects", ["slug"], unique=True)
    op.create_table(
        "blog_posts",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("slug", sa.String(120), nullable=False),
        sa.Column("title", sa.String(200), nullable=False),
        sa.Column("published_on", sa.Date, nullable=False),
        sa.Column("reading_minutes", sa.Integer, nullable=False),
        sa.Column("tags", sa.JSON, nullable=False),
        sa.Column("description", sa.Text, nullable=False),
        sa.Column("body", sa.JSON, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_blog_posts_slug", "blog_posts", ["slug"], unique=True)
    op.create_table(
        "contact_messages",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("email", sa.String(254), nullable=False),
        sa.Column("message", sa.Text, nullable=False),
        sa.Column("ip_address", sa.String(64)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table("contact_messages")
    op.drop_index("ix_blog_posts_slug", "blog_posts")
    op.drop_table("blog_posts")
    op.drop_index("ix_projects_slug", "projects")
    op.drop_table("projects")

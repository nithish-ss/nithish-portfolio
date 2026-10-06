import os

os.environ["DATABASE_URL"] = "sqlite:///./test.db"
os.environ["CONTACT_RATE_LIMIT"] = "3/minute"

from fastapi.testclient import TestClient  # noqa: E402
from sqlalchemy import text  # noqa: E402

from app.database.session import Base, SessionLocal, engine  # noqa: E402
from app.main import app  # noqa: E402
from app import models  # noqa: E402,F401

Base.metadata.create_all(engine)
client = TestClient(app)
good = {"name": "Ada", "email": "ada@example.com", "message": "Hello, this is a test message."}


def test_health():
    assert client.get("/api/health").json()["database"] == "up"


def test_contact_stores_row_and_sanitizes():
    with SessionLocal() as db:
        db.execute(text("DELETE FROM contact_messages")); db.commit()
    r = client.post("/api/contact", json={**good, "message": "<script>alert(1)</script> hi there"})
    assert r.status_code == 201
    with SessionLocal() as db:
        row = db.execute(text("SELECT message FROM contact_messages")).scalar_one()
    assert "<script>" not in row


def test_contact_validation():
    r = client.post("/api/contact", json={**good, "email": "nope"})
    assert r.status_code == 422 and "detail" in r.json()


def test_honeypot_stores_nothing():
    with SessionLocal() as db:
        before = db.execute(text("SELECT COUNT(*) FROM contact_messages")).scalar_one()
    assert client.post("/api/contact", json={**good, "website": "http://spam"}).status_code in (201, 429)
    with SessionLocal() as db:
        after = db.execute(text("SELECT COUNT(*) FROM contact_messages")).scalar_one()
    assert before == after


def test_missing_project_is_404():
    assert client.get("/api/projects/nope").status_code == 404


def test_rate_limit():
    codes = [client.post("/api/contact", json=good).status_code for _ in range(6)]
    assert 429 in codes

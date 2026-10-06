"""Interactive demo endpoints: GET /api/projects/{slug}/demo and POST /api/projects/{slug}/predict."""
import importlib.util
import os
import sys
from pathlib import Path

os.environ.setdefault("DATABASE_URL", "sqlite:///./test.db")

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app.core.config import get_settings  # noqa: E402
from app.main import app  # noqa: E402
from app.services.demos import olist_demo  # noqa: E402
from olist_synthetic import write_synthetic_olist  # noqa: E402

pytest.importorskip("imblearn", reason="training needs imbalanced-learn (ml/requirements.txt)")

SLUG = "olist-customer-satisfaction"
ML_DIR = Path(__file__).resolve().parents[2] / "ml"
client = TestClient(app)


def _train(argv: list[str]) -> int:
    sys.path.insert(0, str(ML_DIR))  # train_olist imports olist_features from its own folder
    spec = importlib.util.spec_from_file_location("train_olist", ML_DIR / "train_olist.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.main(argv)


@pytest.fixture(scope="session")
def artifacts(tmp_path_factory) -> Path:
    data, out = tmp_path_factory.mktemp("data"), tmp_path_factory.mktemp("artifacts")
    write_synthetic_olist(data)
    assert _train(["--data-dir", str(data), "--out-dir", str(out)]) == 0
    return out


def use_artifacts(monkeypatch, path: Path) -> None:
    monkeypatch.setenv("ML_ARTIFACTS_DIR", str(path))
    get_settings.cache_clear()
    olist_demo._load.cache_clear()


@pytest.fixture()
def demo(monkeypatch, artifacts):
    use_artifacts(monkeypatch, artifacts)
    yield
    get_settings.cache_clear()
    olist_demo._load.cache_clear()


def predict(**inputs):
    return client.post(f"/api/projects/{SLUG}/predict", json={"inputs": inputs})


def test_training_without_data_explains_what_to_do(tmp_path, capsys):
    assert _train(["--data-dir", str(tmp_path), "--out-dir", str(tmp_path / "o")]) == 2
    assert "Olist data not found" in capsys.readouterr().out


def test_schema_lists_the_three_inputs_and_measured_metrics(demo):
    body = client.get(f"/api/projects/{SLUG}/demo").json()
    assert [f["key"] for f in body["fields"]] == ["delay_days", "payment_installments", "payment_value"]
    assert all(f["min"] < f["max"] and f["min"] <= f["default"] <= f["max"] for f in body["fields"])
    assert set(body["model"]["metrics"]) >= {"accuracy", "balanced_accuracy", "roc_auc", "baseline_accuracy"}


def test_predict_returns_label_confidence_and_effects(demo):
    body = predict(delay_days=0, payment_installments=2, payment_value=120).json()
    assert body["prediction"] in {"satisfied", "unsatisfied"}
    assert 0.5 <= body["confidence"] <= 1
    assert len(body["details"]) == 4 and body["explanation"]


def test_late_delivery_lowers_satisfaction_in_the_model(demo):
    """Sanity check of the whole chain on synthetic data where lateness hurts by construction."""
    delay = next(f for f in client.get(f"/api/projects/{SLUG}/demo").json()["fields"] if f["key"] == "delay_days")

    def p_sat(d):
        r = predict(delay_days=d, payment_installments=1, payment_value=100)
        assert r.status_code == 200, r.text
        b = r.json()
        return b["confidence"] if b["prediction"] == "satisfied" else 1 - b["confidence"]
    assert p_sat(delay["min"]) > p_sat(delay["max"])


def test_predict_rejects_bad_input(demo):
    assert predict(delay_days=9999).status_code == 422
    assert predict(payment_installments=2.5).status_code == 422
    assert predict(nonsense=1).status_code == 422


def test_project_without_demo_is_404(demo):
    assert client.get("/api/projects/dannys-diner-sql/demo").status_code == 404
    assert client.post("/api/projects/dannys-diner-sql/predict", json={"inputs": {}}).status_code == 404


def test_missing_model_gives_friendly_503_without_internals(monkeypatch, tmp_path):
    use_artifacts(monkeypatch, tmp_path)  # empty folder: no model.joblib
    try:
        for r in (client.get(f"/api/projects/{SLUG}/demo"), predict()):
            assert r.status_code == 503
            assert r.json() == {"detail": "Interactive demo is temporarily unavailable."}
    finally:
        get_settings.cache_clear()
        olist_demo._load.cache_clear()


def test_existing_project_route_is_unchanged():
    r = client.get("/api/projects/nope")
    assert r.status_code == 404 and r.json()["detail"] == "Project not found"

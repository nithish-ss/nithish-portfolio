"""Interactive demo for the Olist customer-satisfaction project.

Serves the model trained by ml/train_olist.py (artifacts: model.joblib + metrics.json), the same model the
Streamlit app uses. Everything shown to visitors (metrics, ranges, probabilities) is read from those
artifacts or computed by the model. Nothing is hard-coded.
"""
import json
import math
from functools import lru_cache
from typing import Any

from app.core.config import get_settings
from app.schemas.demo import DemoDetail, DemoField, DemoSchema, FieldValue, ModelInfo, PredictResponse
from app.services.demos.base import DemoInputError, DemoUnavailable

INPUTS = ["delay_days", "payment_installments", "payment_value"]
LABELS = {"delay_days": "Delivery vs estimated date", "payment_installments": "Payment installments", "payment_value": "Order value"}
HELP = {
    "delay_days": "Negative = delivered early, positive = delivered late.",
    "payment_installments": "Number of installments the customer paid in.",
    "payment_value": "Total paid for the order, in Brazilian reais (R$).",
}
UNITS = {"delay_days": "days", "payment_installments": None, "payment_value": "R$"}


@lru_cache(maxsize=1)
def _load() -> tuple[dict[str, Any], dict[str, Any]]:
    path = get_settings().artifacts_path
    try:
        import joblib  # imported lazily so the API starts even without the ML dependencies

        bundle = joblib.load(path / "model.joblib")
        metrics = json.loads((path / "metrics.json").read_text())
        if bundle.get("kind") != "olist":
            raise ValueError("artifacts were not produced by train_olist.py")
    except Exception as exc:  # missing files, missing packages, version mismatch...
        raise DemoUnavailable(str(exc)) from exc
    return bundle, metrics


def _features(bundle: dict[str, Any], v: dict[str, float]) -> dict[str, float]:
    """Engineered features, derived exactly as in ml/olist_features.py."""
    expected = float(bundle["expected_days"])
    return {
        "delivery_days": max(expected + v["delay_days"], 0.0),
        "expected_days": expected,
        "delay_days": v["delay_days"],
        "payment_installments": v["payment_installments"],
        "payment_value": v["payment_value"],
        "cost_per_installment": v["payment_value"] / v["payment_installments"],
    }


def _p_satisfied(bundle: dict[str, Any], v: dict[str, float]) -> float:
    import pandas as pd  # lazy, like joblib above

    model = bundle["model"]
    row = pd.DataFrame([_features(bundle, v)])[list(bundle["features"])]
    try:
        proba = model.predict_proba(row)[0]
        return float(proba[list(model.classes_).index(1)])
    except Exception as exc:
        raise DemoUnavailable(str(exc)) from exc


class OlistDemo:
    slug = "olist-customer-satisfaction"

    def schema(self) -> DemoSchema:
        bundle, metrics = _load()
        fields = []
        for key in INPUTS:
            r = bundle["input_ranges"][key]
            fields.append(DemoField(key=key, label=LABELS[key], kind="number", help=HELP[key], unit=UNITS[key],
                                    min=r["min"], max=r["max"], step=r["step"], default=r["default"]))
        return DemoSchema(
            slug=self.slug,
            title="Olist customer satisfaction",
            intro="Set the delivery timing and payment details of an order. The model estimates the chance that the customer leaves a 4 or 5 star review.",
            submit_label="Run prediction",
            fields=fields,
            model=ModelInfo(
                name=str(metrics["chosen_model"]),
                dataset=f'{metrics["dataset"]} ({metrics["n_orders"]:,} delivered orders, {metrics["share_satisfied"]:.0%} satisfied)',
                validation=str(metrics["validation"]),
                metrics={k: float(v) for k, v in metrics["test"].items()},
                notes=list(metrics.get("notes", [])),
            ),
        )

    def _validate(self, bundle: dict[str, Any], inputs: dict[str, FieldValue]) -> dict[str, float]:
        unknown = set(inputs) - set(INPUTS)
        if unknown:
            raise DemoInputError(f"Unknown input: {sorted(unknown)[0]}")
        values: dict[str, float] = {}
        for key in INPUTS:
            r = bundle["input_ranges"][key]
            raw = inputs.get(key, r["default"])
            if isinstance(raw, (list, str)):
                raise DemoInputError(f"{LABELS[key]} must be a number.")
            v = float(raw)
            if not math.isfinite(v) or not r["min"] <= v <= r["max"]:
                raise DemoInputError(f'{LABELS[key]} must be between {r["min"]:g} and {r["max"]:g}.')
            if key == "payment_installments" and v != int(v):
                raise DemoInputError("Payment installments must be a whole number.")
            values[key] = v
        return values

    def predict(self, inputs: dict[str, FieldValue]) -> PredictResponse:
        bundle, _ = _load()
        values = self._validate(bundle, inputs)
        p = _p_satisfied(bundle, values)
        label = "satisfied" if p >= 0.5 else "unsatisfied"

        # Model-agnostic explanation: how much would P(satisfied) change if one input were at its reference value?
        ref = bundle["reference"]
        describe = {
            "delay_days": "delivered on the estimated date",
            "payment_installments": "paid in one installment",
            "payment_value": f'the typical order value (R$ {ref["payment_value"]:g})',
        }
        effects = {k: _p_satisfied(bundle, values | {k: float(ref[k])}) - p for k in INPUTS}
        top = max(effects, key=lambda k: abs(effects[k]))
        if abs(effects[top]) < 0.005:
            why = f"Chance of a satisfied review: {p:.0%}. Your inputs are close to the reference case, so no single input moves the result much."
        else:
            why = (f"Chance of a satisfied review: {p:.0%}. {LABELS[top]} has the biggest effect: "
                   f"with {describe[top]}, the chance would be {p + effects[top]:.0%}.")
        details = [DemoDetail(label="Chance of a satisfied review", value=f"{p:.0%}")]
        details += [DemoDetail(label=f"If {describe[k]}", value=f"{effects[k] * 100:+.0f} points") for k in INPUTS]
        return PredictResponse(prediction=label, confidence=p if p >= 0.5 else 1 - p, explanation=why, details=details)

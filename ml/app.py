"""Streamlit demo: Olist customer satisfaction.

The inputs and layout follow the idea of "change the delivery and payment details, see the model react".
Everything shown comes from the trained model and its metrics file (see train_olist.py). Nothing is hard-coded.

Run:  python train_olist.py && streamlit run app.py
"""
import json
import os
from pathlib import Path

import joblib
import pandas as pd
import plotly.graph_objects as go
import streamlit as st

ARTIFACTS = Path(os.environ.get("ML_ARTIFACTS_DIR") or Path(__file__).parent / "artifacts")
ACCENT, MUTED = "#00F2FE", "#8A94A6"

st.set_page_config(page_title="Olist satisfaction demo", page_icon="📦", layout="centered")


@st.cache_resource
def load():
    bundle = joblib.load(ARTIFACTS / "model.joblib")
    metrics = json.loads((ARTIFACTS / "metrics.json").read_text())
    if bundle.get("kind") != "olist":
        raise ValueError("These artifacts were not produced by train_olist.py")
    return bundle, metrics


def features(bundle: dict, delay: float, installments: float, value: float) -> dict:
    """Engineered features, derived exactly as in olist_features.py."""
    expected = bundle["expected_days"]
    return {"delivery_days": max(expected + delay, 0.0), "expected_days": expected, "delay_days": delay,
            "payment_installments": installments, "payment_value": value, "cost_per_installment": value / installments}


def p_satisfied(bundle: dict, rows: list[dict]) -> list[float]:
    frame = pd.DataFrame(rows)[bundle["features"]]
    model = bundle["model"]
    return list(model.predict_proba(frame)[:, list(model.classes_).index(1)])


st.title("📦 Olist customer satisfaction")
st.caption("Will a delivered order get a 4 or 5 star review? Change the delivery timing and payment details and watch the model respond.")

try:
    bundle, metrics = load()
except Exception:
    st.error("No trained model found.")
    st.markdown(
        "1. Download the *Brazilian E-Commerce Public Dataset by Olist* from Kaggle and put the orders, payments and reviews CSV files in `ml/data/`.\n"
        "2. Run `python train_olist.py` in the `ml` folder.\n3. Reload this page."
    )
    st.stop()

r = bundle["input_ranges"]
c1, c2, c3 = st.columns(3)
delay = c1.slider("Delivery vs estimated date (days)", int(r["delay_days"]["min"]), int(r["delay_days"]["max"]), int(r["delay_days"]["default"]),
                  help="Negative = delivered early, positive = late.")
installments = c2.slider("Payment installments", int(r["payment_installments"]["min"]), int(r["payment_installments"]["max"]),
                         int(r["payment_installments"]["default"]))
value = c3.number_input("Order value (R$)", float(r["payment_value"]["min"]), float(r["payment_value"]["max"]),
                        float(r["payment_value"]["default"]), step=float(r["payment_value"]["step"]))

p = p_satisfied(bundle, [features(bundle, delay, installments, value)])[0]
label = "satisfied" if p >= 0.5 else "unsatisfied"

st.subheader(f"Predicted: {label}")
gauge = go.Figure(go.Indicator(
    mode="gauge+number", value=p * 100, number={"suffix": "%", "font": {"color": "#F0F4FA"}},
    title={"text": "Chance of a satisfied review", "font": {"color": MUTED, "size": 14}},
    gauge={"axis": {"range": [0, 100], "tickcolor": MUTED}, "bar": {"color": ACCENT}, "bgcolor": "rgba(0,0,0,0)",
           "threshold": {"line": {"color": "#F0F4FA", "width": 3}, "thickness": 0.8, "value": 50}},
))
gauge.update_layout(paper_bgcolor="rgba(0,0,0,0)", height=250, margin=dict(l=20, r=20, t=50, b=10))
st.plotly_chart(gauge, width="stretch")

# What moves the prediction: reset one input at a time to its reference value.
ref = bundle["reference"]
cases = {
    "delivered on the estimated date": (ref["delay_days"], installments, value),
    "paid in one installment": (delay, ref["payment_installments"], value),
    f"the typical order value (R$ {ref['payment_value']:g})": (delay, installments, ref["payment_value"]),
}
alts = p_satisfied(bundle, [features(bundle, *args) for args in cases.values()])
st.markdown("**What moves this prediction** (change in chance of a satisfied review, one input at a time)")
st.table(pd.DataFrame({"If it were": list(cases), "Change": [f"{(a - p) * 100:+.0f} points" for a in alts]}).set_index("If it were"))

# How the chance changes across the delivery-timing range, other inputs as set.
xs = [r["delay_days"]["min"] + i * (r["delay_days"]["max"] - r["delay_days"]["min"]) / 40 for i in range(41)]
ys = p_satisfied(bundle, [features(bundle, x, installments, value) for x in xs])
curve = go.Figure()
curve.add_trace(go.Scatter(x=xs, y=[y * 100 for y in ys], mode="lines", line=dict(color=ACCENT, width=3), name="Model"))
curve.add_trace(go.Scatter(x=[delay], y=[p * 100], mode="markers", marker=dict(color="#F0F4FA", size=11), name="Your input"))
curve.update_layout(template="plotly_dark", paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)", height=300,
                    title="Chance of a satisfied review vs delivery timing", xaxis_title="Days vs estimated date (negative = early)",
                    yaxis_title="Chance (%)", yaxis_range=[0, 100], margin=dict(l=10, r=10, t=50, b=10), showlegend=False)
st.plotly_chart(curve, width="stretch")

st.divider()
st.subheader("How well does the model work?")
t = metrics["test"]
m = st.columns(4)
m[0].metric("Accuracy", f"{t['accuracy']:.1%}")
m[1].metric("Balanced accuracy", f"{t['balanced_accuracy']:.1%}")
m[2].metric("Recall (satisfied)", f"{t['recall']:.1%}")
m[3].metric("ROC-AUC", f"{t['roc_auc']:.3f}")
st.caption(
    f"Always predicting 'satisfied' would score {t['baseline_accuracy']:.1%} accuracy on the same test set, so judge the model by "
    "balanced accuracy and ROC-AUC, not accuracy alone."
)
labels = metrics["confusion_matrix"]["labels"]
cm = go.Figure(go.Heatmap(z=metrics["confusion_matrix"]["matrix"], x=[f"predicted {n}" for n in labels], y=[f"actual {n}" for n in labels],
                          text=metrics["confusion_matrix"]["matrix"], texttemplate="%{text}", colorscale=[[0, "#0F1520"], [1, ACCENT]], showscale=False))
cm.update_layout(template="plotly_dark", paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)", height=280, title="Confusion matrix (held-out test set)",
                 margin=dict(l=10, r=10, t=50, b=10), yaxis_autorange="reversed")
st.plotly_chart(cm, width="stretch")

with st.expander("How this was built"):
    st.markdown(
        f"- **Data:** {metrics['dataset']}. {metrics['n_orders']:,} delivered orders, {metrics['share_satisfied']:.0%} of them satisfied.\n"
        f"- **Target:** {metrics['target']}.\n"
        "- **Features:** delivery time, promised delivery window, delay against the estimate, installments, order value and cost per installment.\n"
        f"- **Validation:** {metrics['validation']}\n"
        f"- **Model:** {metrics['chosen_model']}, chosen by cross-validated ROC-AUC.\n"
        "- **Limits:** the model only sees delivery and payment details, not the product, seller or review text."
    )
st.caption("Numbers on this page come from the training run in `train_olist.py`.")

"""SYNTHETIC data in the Olist file layout. Used only to test that the pipeline and API work.
Results trained on it mean nothing; never show them as project results."""
from pathlib import Path

import numpy as np
import pandas as pd


def write_synthetic_olist(folder: Path, n: int = 3000, seed: int = 0) -> None:
    rng = np.random.default_rng(seed)
    purchase = pd.Timestamp("2017-01-01") + pd.to_timedelta(rng.integers(0, 500 * 24 * 3600, n), unit="s")
    expected = rng.uniform(10, 40, n)
    delay = rng.normal(-8, 7, n)
    est = purchase + pd.to_timedelta(expected, unit="D")
    delivered = est + pd.to_timedelta(delay, unit="D")
    ids = [f"order{i}" for i in range(n)]
    pd.DataFrame({
        "order_id": ids, "customer_id": ids, "order_status": "delivered", "order_purchase_timestamp": purchase,
        "order_approved_at": purchase, "order_delivered_carrier_date": purchase,
        "order_delivered_customer_date": delivered, "order_estimated_delivery_date": est,
    }).to_csv(folder / "olist_orders_dataset.csv", index=False)
    inst = rng.integers(1, 11, n)
    pd.DataFrame({
        "order_id": ids, "payment_sequential": 1, "payment_type": "credit_card",
        "payment_installments": inst, "payment_value": np.round(rng.lognormal(4.7, 0.7, n), 2),
    }).to_csv(folder / "olist_order_payments_dataset.csv", index=False)
    p_sat = 1 / (1 + np.exp(-(1.6 - 0.18 * np.clip(delay, -20, 40) - 0.04 * inst)))
    score = np.where(rng.random(n) < p_sat, rng.choice([4, 5], n, p=[0.25, 0.75]), rng.choice([1, 2, 3], n))
    pd.DataFrame({
        "review_id": ids, "order_id": ids, "review_score": score, "review_comment_title": "", "review_comment_message": "",
        "review_creation_date": (delivered + pd.Timedelta(1, unit="D")).strftime("%Y-%m-%d 00:00:00"),
        "review_answer_timestamp": (delivered + pd.Timedelta(2, unit="D")).strftime("%Y-%m-%d 00:00:00"),
    }).to_csv(folder / "olist_order_reviews_dataset.csv", index=False)

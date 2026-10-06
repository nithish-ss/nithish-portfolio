"""Builds the modelling table from the public Olist Brazilian E-Commerce dataset (Kaggle).

Needs three CSVs from that dataset in ml/data/ (names as downloaded):
  olist_orders_dataset.csv, olist_order_payments_dataset.csv, olist_order_reviews_dataset.csv

Features (all derived from the data, none invented):
  delivery_days         purchase -> delivered to the customer
  expected_days         purchase -> estimated delivery date (the delivery window promised)
  delay_days            delivered minus estimated date (negative = early)
  payment_installments  most installments used on the order
  payment_value         total paid for the order (BRL)
  cost_per_installment  payment_value / payment_installments
Target: satisfied = review score >= SATISFIED_MIN_SCORE. Change the constant if your project used another rule.
"""
from pathlib import Path

import pandas as pd

FILES = {
    "orders": "olist_orders_dataset.csv",
    "payments": "olist_order_payments_dataset.csv",
    "reviews": "olist_order_reviews_dataset.csv",
}
SATISFIED_MIN_SCORE = 4
FEATURES = ["delivery_days", "expected_days", "delay_days", "payment_installments", "payment_value", "cost_per_installment"]
TARGET_NAMES = ["unsatisfied", "satisfied"]  # index = class label


class MissingData(Exception):
    """Dataset files not found. The message tells the user what to do."""


def load_olist(data_dir: Path) -> pd.DataFrame:
    missing = [name for name in FILES.values() if not (data_dir / name).exists()]
    if missing:
        raise MissingData(
            f"Olist data not found in {data_dir}.\n"
            f"Missing: {', '.join(missing)}\n"
            "Download 'Brazilian E-Commerce Public Dataset by Olist' from Kaggle (free account) and put these CSV files in that folder."
        )
    day = ["order_purchase_timestamp", "order_delivered_customer_date", "order_estimated_delivery_date"]
    orders = pd.read_csv(data_dir / FILES["orders"], usecols=["order_id", "order_status", *day], parse_dates=day)
    payments = pd.read_csv(data_dir / FILES["payments"], usecols=["order_id", "payment_installments", "payment_value"])
    reviews = pd.read_csv(data_dir / FILES["reviews"], usecols=["order_id", "review_score", "review_creation_date"])

    orders = orders[orders["order_status"] == "delivered"].dropna(subset=day)
    pay = payments.groupby("order_id", as_index=False).agg(payment_installments=("payment_installments", "max"), payment_value=("payment_value", "sum"))
    last_review = reviews.sort_values("review_creation_date").groupby("order_id", as_index=False).tail(1)[["order_id", "review_score"]]
    df = orders.merge(pay, on="order_id").merge(last_review, on="order_id")

    to_days = lambda delta: delta.dt.total_seconds() / 86400  # noqa: E731
    df["delivery_days"] = to_days(df["order_delivered_customer_date"] - df["order_purchase_timestamp"])
    df["expected_days"] = to_days(df["order_estimated_delivery_date"] - df["order_purchase_timestamp"])
    df["delay_days"] = to_days(df["order_delivered_customer_date"] - df["order_estimated_delivery_date"])
    df = df[(df["payment_installments"] >= 1) & (df["payment_value"] > 0) & (df["delivery_days"] >= 0)].copy()
    df["cost_per_installment"] = df["payment_value"] / df["payment_installments"]
    df["satisfied"] = (df["review_score"] >= SATISFIED_MIN_SCORE).astype(int)
    return df[[*FEATURES, "satisfied", "review_score"]].reset_index(drop=True)

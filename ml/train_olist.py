"""Train and evaluate the Olist customer-satisfaction classifier, then save it for the demos.

    python train_olist.py                      # reads ml/data/, writes ml/artifacts/
    python train_olist.py --max-rows 20000     # faster, on a random sample

Method: stratified 80/20 split. Models are compared with 5-fold stratified cross-validation on the
training split only. SMOTE (class balancing) lives inside the cross-validation pipeline, so it only
ever touches training folds. The test split is used once, for the final numbers, and is never resampled.
Writes artifacts/model.joblib and artifacts/metrics.json. Every number shown by the demos comes from here.
"""
import argparse
import json
import sys
from pathlib import Path

import joblib
import numpy as np
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline
from sklearn.dummy import DummyClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, balanced_accuracy_score, confusion_matrix, f1_score, precision_score, recall_score, roc_auc_score
from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

from olist_features import FEATURES, SATISFIED_MIN_SCORE, TARGET_NAMES, MissingData, load_olist

HERE = Path(__file__).parent
SEED = 42


def _imb(clf) -> ImbPipeline:
    return ImbPipeline([("scaler", StandardScaler()), ("smote", SMOTE(random_state=SEED)), ("clf", clf)])


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--data-dir", default=str(HERE / "data"))
    ap.add_argument("--out-dir", default=str(HERE / "artifacts"))
    ap.add_argument("--max-rows", type=int, default=None, help="train on a random sample of this many orders")
    args = ap.parse_args(argv)

    try:
        df = load_olist(Path(args.data_dir))
    except MissingData as exc:
        print(exc)
        return 2
    if args.max_rows and len(df) > args.max_rows:
        df = df.sample(args.max_rows, random_state=SEED).reset_index(drop=True)

    X, y = df[FEATURES], df["satisfied"]
    X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, stratify=y, random_state=SEED)
    print(f"{len(df):,} delivered orders | {y.mean():.1%} satisfied | train {len(X_tr):,} / test {len(X_te):,}")

    candidates = {
        "baseline (always 'satisfied')": DummyClassifier(strategy="most_frequent"),
        "logistic regression": _imb(LogisticRegression(max_iter=1000)),
        "random forest": _imb(RandomForestClassifier(n_estimators=200, min_samples_leaf=5, n_jobs=-1, random_state=SEED)),
    }
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=SEED)
    cv_scores = {}
    for name, model in candidates.items():
        s = cross_val_score(model, X_tr, y_tr, cv=cv, scoring="roc_auc")
        cv_scores[name] = {"mean": round(float(s.mean()), 4), "std": round(float(s.std()), 4)}
        print(f"  {name:32s} CV ROC-AUC {s.mean():.3f} ± {s.std():.3f}")

    chosen_name = max((n for n in cv_scores if not n.startswith("baseline")), key=lambda n: cv_scores[n]["mean"])
    chosen = candidates[chosen_name].fit(X_tr, y_tr)
    pred, proba = chosen.predict(X_te), chosen.predict_proba(X_te)[:, 1]
    baseline_acc = float(accuracy_score(y_te, np.ones(len(y_te), dtype=int)))  # always predicting 'satisfied'
    tn, fp, fn, tp = confusion_matrix(y_te, pred, labels=[0, 1]).ravel()

    test = {
        "accuracy": float(accuracy_score(y_te, pred)),
        "balanced_accuracy": float(balanced_accuracy_score(y_te, pred)),
        "precision": float(precision_score(y_te, pred, zero_division=0)),
        "recall": float(recall_score(y_te, pred, zero_division=0)),
        "f1": float(f1_score(y_te, pred, zero_division=0)),
        "roc_auc": float(roc_auc_score(y_te, proba)),
        "baseline_accuracy": baseline_acc,
    }
    test = {k: round(v, 4) for k, v in test.items()}

    # Demo sliders: the three raw inputs, limited to the 1st-99th percentile so the ranges are realistic.
    def rng(col: str, default: float, step: float, integer: bool = False):
        lo, hi = (float(v) for v in np.percentile(X_tr[col], [1, 99]))
        lo, hi = (np.floor(lo), np.ceil(hi)) if integer else (round(lo, 0), round(hi, 0))
        return {"min": lo, "max": hi, "default": float(min(max(default, lo), hi)), "step": step}

    input_ranges = {
        "delay_days": rng("delay_days", 0.0, 1.0),
        "payment_installments": rng("payment_installments", 1.0, 1.0, integer=True),
        "payment_value": rng("payment_value", float(X_tr["payment_value"].median().round(0)), 5.0),
    }
    bundle = {
        "kind": "olist",
        "model": make_pipeline(chosen.named_steps["scaler"], chosen.named_steps["clf"]),  # plain scikit-learn: no SMOTE at prediction time
        "features": FEATURES,
        "target_names": TARGET_NAMES,
        "input_ranges": input_ranges,
        "expected_days": float(X_tr["expected_days"].median()),
        "reference": {"delay_days": 0.0, "payment_installments": 1.0, "payment_value": input_ranges["payment_value"]["default"]},
    }
    metrics = {
        "dataset": "Olist Brazilian E-Commerce Public Dataset (Kaggle): orders, payments and reviews tables",
        "target": f"satisfied = review score of {SATISFIED_MIN_SCORE} or 5" if SATISFIED_MIN_SCORE == 4 else f"satisfied = review score of {SATISFIED_MIN_SCORE} or higher",
        "n_orders": int(len(df)), "n_train": int(len(X_tr)), "n_test": int(len(X_te)),
        "share_satisfied": round(float(y.mean()), 4),
        "validation": "Stratified 80/20 split. Models compared with 5-fold CV (ROC-AUC) on the training split only; SMOTE applied inside the training folds. Test split used once.",
        "chosen_model": chosen_name,
        "cv_roc_auc": cv_scores,
        "test": test,
        "confusion_matrix": {"labels": TARGET_NAMES, "matrix": [[int(tn), int(fp)], [int(fn), int(tp)]]},
        "notes": [
            "Trained on the public Olist dataset to demonstrate the workflow. Figures here come from this training run.",
            "Predicts whether a delivered order's review is 4 or 5 stars, from delivery timing and payment details only.",
        ],
    }
    out = Path(args.out_dir)
    out.mkdir(parents=True, exist_ok=True)
    joblib.dump(bundle, out / "model.joblib")
    (out / "metrics.json").write_text(json.dumps(metrics, indent=2))
    print(f"\nChosen: {chosen_name}\n{json.dumps(test, indent=2)}\nSaved to {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

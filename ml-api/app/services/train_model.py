"""
Train a multi-output health risk prediction model using population data
derived from Framingham Heart Study and NHANES epidemiological parameters.
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.multioutput import MultiOutputRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
from pathlib import Path

from app.services.dataset_loader import generate_framingham_nhanes_dataset, FEATURES

SEED = 42
N_SAMPLES = 25000

TARGETS = ["cv_risk", "diabetes_risk", "mental_risk"]
TARGET_LABELS = ["Cardiovascular Risk", "Diabetes Risk", "Mental Health Risk"]

MODEL_DIR = Path(__file__).parent.parent / "trained_models"


def train_and_save():
    print("Generating training data from Framingham/NHANES parameters...")
    df = generate_framingham_nhanes_dataset(n=N_SAMPLES, seed=SEED)

    X = df[FEATURES]
    y = df[TARGETS]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=SEED
    )

    print(f"Training set: {len(X_train)} samples")
    print(f"Test set: {len(X_test)} samples")
    print(f"Features: {len(FEATURES)}")
    print(f"Targets: {TARGETS}")

    model = MultiOutputRegressor(
        GradientBoostingRegressor(
            n_estimators=500,
            max_depth=6,
            learning_rate=0.05,
            subsample=0.85,
            min_samples_leaf=5,
            max_features=0.8,
            random_state=SEED,
        )
    )

    print("\nTraining GradientBoosting model (500 trees, depth=6)...")
    model.fit(X_train, y_train)

    y_pred_train = model.predict(X_train)
    y_pred_test = model.predict(X_test)

    print("\n--- Model Performance ---")
    print(f"{'Target':<25} {'Train R²':<12} {'Test R²':<12} {'Test MAE':<12}")
    print("-" * 60)
    for i, name in enumerate(TARGET_LABELS):
        train_r2 = r2_score(y_train.iloc[:, i], y_pred_train[:, i])
        test_r2 = r2_score(y_test.iloc[:, i], y_pred_test[:, i])
        test_mae = mean_absolute_error(y_test.iloc[:, i], y_pred_test[:, i])
        print(f"{name:<25} {train_r2:<12.4f} {test_r2:<12.4f} {test_mae:<12.2f}")

    overall_r2 = model.score(X_test, y_test)
    print(f"\nOverall Test R²: {overall_r2:.4f}")

    MODEL_DIR.mkdir(exist_ok=True)
    model_path = MODEL_DIR / "risk_model.joblib"
    joblib.dump(model, model_path)

    # Save a background dataset sample for SHAP
    background = X_train.sample(n=200, random_state=SEED)
    bg_path = MODEL_DIR / "shap_background.joblib"
    joblib.dump(background, bg_path)

    print(f"\nModel saved to {model_path}")
    print(f"SHAP background data saved to {bg_path}")

    return model


if __name__ == "__main__":
    train_and_save()

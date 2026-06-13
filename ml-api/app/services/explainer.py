"""
SHAP-based explainability for health risk predictions.

Provides per-feature contribution explanations for each risk dimension,
telling users exactly which lifestyle factors are pushing their risk
up or down and by how much.
"""

import logging
from pathlib import Path

import numpy as np
import pandas as pd
import shap
import joblib

from app.services.dataset_loader import FEATURES

logger = logging.getLogger(__name__)

MODEL_DIR = Path(__file__).parent.parent / "trained_models"
BACKGROUND_PATH = MODEL_DIR / "shap_background.joblib"

FEATURE_DISPLAY_NAMES = {
    "age": "Age",
    "bmi": "BMI",
    "blood_pressure_systolic": "Blood Pressure (Systolic)",
    "blood_pressure_diastolic": "Blood Pressure (Diastolic)",
    "cholesterol": "Cholesterol",
    "glucose": "Blood Glucose",
    "smoking": "Smoking",
    "alcohol_weekly_units": "Alcohol Intake",
    "exercise_hours_weekly": "Physical Exercise",
    "sleep_hours_daily": "Sleep Duration",
    "stress_level": "Stress Level",
    "family_history_heart_disease": "Family History (Heart)",
    "family_history_diabetes": "Family History (Diabetes)",
}

TARGET_NAMES = ["cardiovascular", "diabetes", "mental_health"]

_explainers = None


def get_explainers(model):
    global _explainers
    if _explainers is not None:
        return _explainers

    if not BACKGROUND_PATH.exists():
        logger.warning("SHAP background not found — cannot create explainer")
        return None

    background = joblib.load(BACKGROUND_PATH)
    logger.info("Creating SHAP TreeExplainers for each target...")

    _explainers = []
    for i, estimator in enumerate(model.estimators_):
        explainer = shap.TreeExplainer(estimator)
        _explainers.append(explainer)
        logger.info(f"  Explainer ready for target: {TARGET_NAMES[i]}")

    return _explainers


def explain_prediction(model, features_df: pd.DataFrame) -> dict:
    """
    Generate SHAP explanations for a single prediction.

    Returns a dict with per-target explanations:
    {
        "cardiovascular": {
            "base_value": float,
            "prediction": float,
            "features": [
                {"name": str, "display_name": str, "value": float,
                 "shap_value": float, "direction": "risk" | "protective"}
            ]
        },
        ...
    }
    """
    explainers = get_explainers(model)
    if explainers is None:
        return {}

    result = {}
    predictions = model.predict(features_df)[0]

    for i, (explainer, target_name) in enumerate(zip(explainers, TARGET_NAMES)):
        shap_values = explainer.shap_values(features_df)

        # shap_values shape is (1, n_features) for single sample
        if isinstance(shap_values, np.ndarray) and shap_values.ndim == 2:
            sv = shap_values[0]
        elif isinstance(shap_values, np.ndarray) and shap_values.ndim == 1:
            sv = shap_values
        else:
            sv = np.array(shap_values).flatten()

        # expected_value may be scalar or array
        ev = explainer.expected_value
        base_value = float(ev[0]) if hasattr(ev, '__len__') else float(ev)

        feature_explanations = []
        for j, feat_name in enumerate(FEATURES):
            shap_val = float(sv[j])
            feat_value = float(features_df.iloc[0][feat_name])

            feature_explanations.append({
                "name": feat_name,
                "display_name": FEATURE_DISPLAY_NAMES.get(feat_name, feat_name),
                "value": round(feat_value, 2),
                "shap_value": round(shap_val, 2),
                "direction": "risk" if shap_val > 0 else "protective",
            })

        feature_explanations.sort(key=lambda x: abs(x["shap_value"]), reverse=True)

        result[target_name] = {
            "base_value": round(base_value, 2),
            "prediction": round(float(np.clip(predictions[i], 0, 100)), 1),
            "features": feature_explanations,
        }

    return result


def get_top_drivers(explanation: dict, top_n: int = 5) -> dict:
    """
    Extract the top N risk drivers and protective factors for each target.
    Useful for the dashboard summary view.
    """
    summary = {}
    for target_name, target_data in explanation.items():
        risk_factors = [f for f in target_data["features"] if f["direction"] == "risk"]
        protective_factors = [f for f in target_data["features"] if f["direction"] == "protective"]

        summary[target_name] = {
            "prediction": target_data["prediction"],
            "top_risk_drivers": risk_factors[:top_n],
            "top_protective_factors": protective_factors[:top_n],
        }

    return summary

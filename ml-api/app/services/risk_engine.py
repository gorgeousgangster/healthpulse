import logging
from pathlib import Path

import numpy as np
import pandas as pd
import joblib

from app.models.schemas import (
    HealthProfile,
    RiskScore,
    RiskExplanation,
    TargetExplanation,
    FeatureExplanation,
)
from app.services.dataset_loader import FEATURES
from app.services.explainer import explain_prediction

logger = logging.getLogger(__name__)

MODEL_PATH = Path(__file__).parent.parent / "trained_models" / "risk_model.joblib"

_model = None


def get_model():
    global _model
    if _model is None:
        if not MODEL_PATH.exists():
            logger.warning("Trained model not found, training now...")
            from app.services.train_model import train_and_save
            _model = train_and_save()
        else:
            _model = joblib.load(MODEL_PATH)
            logger.info("Loaded trained risk model from disk")
    return _model


def profile_to_features(profile: HealthProfile) -> pd.DataFrame:
    return pd.DataFrame([[
        profile.age,
        profile.bmi,
        profile.blood_pressure_systolic,
        profile.blood_pressure_diastolic,
        profile.cholesterol,
        profile.glucose,
        int(profile.smoking),
        profile.alcohol_weekly_units,
        profile.exercise_hours_weekly,
        profile.sleep_hours_daily,
        profile.stress_level,
        int(profile.family_history_heart_disease),
        int(profile.family_history_diabetes),
    ]], columns=FEATURES)


def identify_contributing_factors(profile: HealthProfile) -> list[str]:
    factors = []
    if profile.smoking:
        factors.append("Smoking significantly increases cardiovascular risk")
    if profile.bmi > 30:
        factors.append("Obesity elevates multiple disease risks")
    elif profile.bmi > 27:
        factors.append("Overweight — approaching obesity threshold")
    if profile.blood_pressure_systolic > 140:
        factors.append("High blood pressure detected (hypertension stage)")
    elif profile.blood_pressure_systolic > 130:
        factors.append("Elevated blood pressure — pre-hypertension")
    if profile.glucose > 126:
        factors.append("Elevated glucose — diabetic range, consult physician")
    elif profile.glucose > 100:
        factors.append("Glucose in pre-diabetic range")
    if profile.cholesterol > 240:
        factors.append("High cholesterol — significant cardiovascular concern")
    elif profile.cholesterol > 200:
        factors.append("Borderline high cholesterol")
    if profile.sleep_hours_daily < 6:
        factors.append("Insufficient sleep impacts mental and physical health")
    if profile.stress_level >= 8:
        factors.append("Very high stress levels — major health impact")
    elif profile.stress_level >= 6:
        factors.append("Elevated stress affecting overall wellbeing")
    if profile.exercise_hours_weekly < 1:
        factors.append("Very sedentary lifestyle — critical to increase activity")
    elif profile.exercise_hours_weekly < 2.5:
        factors.append("Below recommended exercise levels (150 min/week)")
    if profile.alcohol_weekly_units > 14:
        factors.append("Alcohol intake exceeds recommended limits")
    if profile.family_history_heart_disease:
        factors.append("Family history of heart disease increases baseline risk")
    if profile.family_history_diabetes:
        factors.append("Family history of diabetes increases baseline risk")

    if not factors:
        factors.append("No major risk factors identified — keep it up!")

    return factors


def _build_explanation(shap_result: dict) -> RiskExplanation | None:
    if not shap_result:
        return None

    targets = {}
    for target_key in ["cardiovascular", "diabetes", "mental_health"]:
        if target_key not in shap_result:
            continue
        data = shap_result[target_key]
        targets[target_key] = TargetExplanation(
            base_value=data["base_value"],
            prediction=data["prediction"],
            features=[FeatureExplanation(**f) for f in data["features"]],
        )

    return RiskExplanation(**targets)


def assess_risk(profile: HealthProfile, include_explanation: bool = True) -> RiskScore:
    model = get_model()
    features = profile_to_features(profile)

    predictions = model.predict(features)[0]
    cv_risk = float(np.clip(predictions[0], 0, 100))
    diabetes_risk = float(np.clip(predictions[1], 0, 100))
    mental_risk = float(np.clip(predictions[2], 0, 100))

    overall = cv_risk * 0.4 + diabetes_risk * 0.35 + mental_risk * 0.25

    factors = identify_contributing_factors(profile)

    if overall < 20:
        level = "low"
    elif overall < 45:
        level = "moderate"
    elif overall < 70:
        level = "high"
    else:
        level = "critical"

    explanation = None
    if include_explanation:
        try:
            shap_result = explain_prediction(model, features)
            explanation = _build_explanation(shap_result)
        except Exception as e:
            logger.error(f"SHAP explanation failed: {e}")

    return RiskScore(
        overall_risk=round(overall, 1),
        cardiovascular_risk=round(cv_risk, 1),
        diabetes_risk=round(diabetes_risk, 1),
        mental_health_risk=round(mental_risk, 1),
        risk_level=level,
        contributing_factors=factors,
        explanation=explanation,
    )

from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.models.schemas import HealthProfile, RiskScore
from app.services.risk_engine import assess_risk
from app.auth.jwt_handler import verify_token, get_current_user
from app.db.engine import get_db
from app.db.models import HealthAssessment
from app.rate_limit import limiter

router = APIRouter()


def _get_user_from_request(request: Request):
    auth = request.headers.get("authorization", "")
    if not auth.startswith("Bearer "):
        return None
    token = auth[7:]
    try:
        return verify_token(token, expected_type="access")
    except Exception:
        return None


def _risk_level(score):
    if score >= 75:
        return "critical"
    if score >= 50:
        return "high"
    if score >= 25:
        return "moderate"
    return "low"


@router.post("/assess-risk", response_model=RiskScore)
@limiter.limit("20/minute")
def assess_health_risk(
    request: Request,
    profile: HealthProfile,
    db: Session = Depends(get_db),
):
    result = assess_risk(profile)

    user = _get_user_from_request(request)
    if user:
        record = HealthAssessment(
            user_id=user["sub"],
            age=profile.age,
            bmi=profile.bmi,
            blood_pressure_systolic=profile.blood_pressure_systolic,
            blood_pressure_diastolic=profile.blood_pressure_diastolic,
            cholesterol=profile.cholesterol,
            glucose=profile.glucose,
            smoking=profile.smoking,
            alcohol_weekly_units=profile.alcohol_weekly_units,
            exercise_hours_weekly=profile.exercise_hours_weekly,
            sleep_hours_daily=profile.sleep_hours_daily,
            stress_level=profile.stress_level,
            family_history_heart_disease=profile.family_history_heart_disease,
            family_history_diabetes=profile.family_history_diabetes,
            overall_risk=result.overall_risk,
            cardiovascular_risk=result.cardiovascular_risk,
            diabetes_risk=result.diabetes_risk,
            mental_health_risk=result.mental_health_risk,
            risk_level=_risk_level(result.overall_risk),
        )
        db.add(record)
        db.commit()

    return result


@router.get("/assessments/history")
@limiter.limit("30/minute")
def get_assessment_history(
    request: Request,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    records = (
        db.query(HealthAssessment)
        .filter(HealthAssessment.user_id == user["sub"])
        .order_by(HealthAssessment.created_at.desc())
        .limit(20)
        .all()
    )
    return [
        {
            "id": r.id,
            "created_at": r.created_at.isoformat(),
            "payload": {
                "age": r.age,
                "bmi": float(r.bmi),
                "blood_pressure_systolic": r.blood_pressure_systolic,
                "blood_pressure_diastolic": r.blood_pressure_diastolic,
                "cholesterol": float(r.cholesterol),
                "glucose": float(r.glucose),
                "smoking": r.smoking,
                "alcohol_weekly_units": float(r.alcohol_weekly_units),
                "exercise_hours_weekly": float(r.exercise_hours_weekly),
                "sleep_hours_daily": float(r.sleep_hours_daily),
                "stress_level": r.stress_level,
                "family_history_heart_disease": r.family_history_heart_disease,
                "family_history_diabetes": r.family_history_diabetes,
            },
            "overall_risk": float(r.overall_risk),
            "cardiovascular_risk": float(r.cardiovascular_risk),
            "diabetes_risk": float(r.diabetes_risk),
            "mental_health_risk": float(r.mental_health_risk),
            "risk_level": r.risk_level,
        }
        for r in records
    ]

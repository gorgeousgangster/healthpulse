from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.models.schemas import HealthProfile, RiskScore
from app.services.risk_engine import assess_risk
from app.auth.jwt_handler import get_current_user
from app.db.engine import get_db
from app.db.models import HealthAssessment
from app.rate_limit import limiter

router = APIRouter()


@router.post("/assess-risk", response_model=RiskScore)
@limiter.limit("20/minute")
def assess_health_risk(
    request: Request,
    profile: HealthProfile,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    result = assess_risk(profile)

    record = HealthAssessment(
        user_id=user["sub"],
        overall_risk=str(result.overall_risk),
        cardiovascular_risk=str(result.cardiovascular_risk),
        diabetes_risk=str(result.diabetes_risk),
        mental_health_risk=str(result.mental_health_risk),
        risk_level=result.risk_level,
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
            "overall_risk": float(r.overall_risk),
            "cardiovascular_risk": float(r.cardiovascular_risk),
            "diabetes_risk": float(r.diabetes_risk),
            "mental_health_risk": float(r.mental_health_risk),
            "risk_level": r.risk_level,
            "created_at": r.created_at.isoformat(),
        }
        for r in records
    ]

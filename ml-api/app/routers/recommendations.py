from fastapi import APIRouter, Depends, Request

from app.models.schemas import HealthProfile, RecommendationResponse
from app.services.recommendation_engine import generate_recommendations
from app.services.risk_engine import assess_risk
from app.auth.jwt_handler import get_current_user
from app.rate_limit import limiter

router = APIRouter()


@router.post("/recommendations", response_model=RecommendationResponse)
@limiter.limit("20/minute")
def get_recommendations(request: Request, profile: HealthProfile, _user: dict = Depends(get_current_user)):
    risk = assess_risk(profile)
    return generate_recommendations(profile, risk)

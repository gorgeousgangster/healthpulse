from pydantic import BaseModel, Field


class HealthProfile(BaseModel):
    age: int = Field(ge=1, le=120)
    bmi: float = Field(ge=10, le=60)
    blood_pressure_systolic: int = Field(ge=70, le=250)
    blood_pressure_diastolic: int = Field(ge=40, le=150)
    cholesterol: float = Field(ge=100, le=400)
    glucose: float = Field(ge=50, le=500)
    smoking: bool = False
    alcohol_weekly_units: float = Field(ge=0, le=100)
    exercise_hours_weekly: float = Field(ge=0, le=40)
    sleep_hours_daily: float = Field(ge=2, le=16)
    stress_level: int = Field(ge=1, le=10)
    family_history_heart_disease: bool = False
    family_history_diabetes: bool = False


class FeatureExplanation(BaseModel):
    name: str
    display_name: str
    value: float
    shap_value: float = Field(description="SHAP contribution to risk score")
    direction: str = Field(description="'risk' or 'protective'")


class TargetExplanation(BaseModel):
    base_value: float = Field(description="Population average risk")
    prediction: float = Field(description="Predicted risk for this individual")
    features: list[FeatureExplanation]


class RiskExplanation(BaseModel):
    cardiovascular: TargetExplanation | None = None
    diabetes: TargetExplanation | None = None
    mental_health: TargetExplanation | None = None


class ProjectionPoint(BaseModel):
    label: str
    cardiovascular_risk: float
    diabetes_risk: float
    mental_health_risk: float


class RiskScore(BaseModel):
    overall_risk: float = Field(description="0-100 risk score")
    cardiovascular_risk: float
    diabetes_risk: float
    mental_health_risk: float
    risk_level: str = Field(description="low, moderate, high, critical")
    contributing_factors: list[str]
    explanation: RiskExplanation | None = Field(
        default=None,
        description="SHAP-based feature importance breakdown per risk dimension",
    )
    projections: list[ProjectionPoint] | None = Field(
        default=None,
        description="5-year and 10-year risk projections based on current lifestyle trajectory",
    )


class Recommendation(BaseModel):
    category: str
    priority: str
    title: str
    description: str
    impact_score: float = Field(description="Expected risk reduction 0-1")


class RecommendationResponse(BaseModel):
    recommendations: list[Recommendation]
    estimated_risk_reduction: float

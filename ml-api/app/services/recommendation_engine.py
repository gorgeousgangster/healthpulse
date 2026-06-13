from app.models.schemas import (
    HealthProfile,
    Recommendation,
    RecommendationResponse,
    RiskScore,
)


def generate_recommendations(
    profile: HealthProfile, risk: RiskScore
) -> RecommendationResponse:
    recs = []

    if profile.exercise_hours_weekly < 3:
        recs.append(
            Recommendation(
                category="Exercise",
                priority="high" if profile.exercise_hours_weekly < 1 else "medium",
                title="Increase Physical Activity",
                description=f"Currently at {profile.exercise_hours_weekly}h/week. "
                "Aim for 150 minutes of moderate aerobic activity weekly. "
                "Start with 30-minute walks and gradually increase intensity.",
                impact_score=0.25,
            )
        )

    if profile.sleep_hours_daily < 7:
        recs.append(
            Recommendation(
                category="Sleep",
                priority="high",
                title="Improve Sleep Hygiene",
                description=f"Getting {profile.sleep_hours_daily}h/night. "
                "Adults need 7-9 hours. Establish a consistent bedtime, "
                "limit screens 1 hour before sleep, keep room cool and dark.",
                impact_score=0.20,
            )
        )

    if profile.smoking:
        recs.append(
            Recommendation(
                category="Lifestyle",
                priority="critical",
                title="Smoking Cessation Program",
                description="Smoking is your single largest modifiable risk factor. "
                "Consider nicotine replacement therapy, counseling, or apps like "
                "Smokefree. Risk drops 50% within 1 year of quitting.",
                impact_score=0.35,
            )
        )

    if profile.stress_level >= 6:
        recs.append(
            Recommendation(
                category="Mental Health",
                priority="high" if profile.stress_level >= 8 else "medium",
                title="Stress Management",
                description=f"Stress level {profile.stress_level}/10 is elevated. "
                "Try mindfulness meditation (10 min/day), deep breathing exercises, "
                "or consider professional counseling for sustained relief.",
                impact_score=0.15,
            )
        )

    if profile.bmi > 28:
        recs.append(
            Recommendation(
                category="Nutrition",
                priority="high",
                title="Weight Management Plan",
                description=f"BMI of {profile.bmi:.1f} increases disease risk. "
                "A 5-10% weight reduction significantly lowers cardiovascular and "
                "diabetes risk. Focus on whole foods, portion control, and consistency.",
                impact_score=0.22,
            )
        )

    if profile.blood_pressure_systolic > 135:
        recs.append(
            Recommendation(
                category="Medical",
                priority="high",
                title="Blood Pressure Monitoring",
                description=f"BP at {profile.blood_pressure_systolic}/{profile.blood_pressure_diastolic} mmHg. "
                "Reduce sodium intake (<2300mg/day), increase potassium-rich foods, "
                "and consult your physician about management options.",
                impact_score=0.18,
            )
        )

    if profile.glucose > 110:
        recs.append(
            Recommendation(
                category="Medical",
                priority="high",
                title="Glucose Level Management",
                description=f"Fasting glucose at {profile.glucose} mg/dL suggests pre-diabetic range. "
                "Reduce refined carbohydrates, increase fiber intake, and schedule "
                "an HbA1c test with your doctor.",
                impact_score=0.20,
            )
        )

    if not recs:
        recs.append(
            Recommendation(
                category="General",
                priority="low",
                title="Maintain Current Lifestyle",
                description="Your health indicators are excellent. Continue your "
                "current habits and schedule regular annual check-ups.",
                impact_score=0.05,
            )
        )

    total_reduction = sum(r.impact_score for r in recs)
    estimated_reduction = min(total_reduction, 0.65)

    return RecommendationResponse(
        recommendations=sorted(recs, key=lambda r: r.impact_score, reverse=True),
        estimated_risk_reduction=round(estimated_reduction, 2),
    )

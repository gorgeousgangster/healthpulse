import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, DateTime, Boolean, Float, Integer
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)


class HealthAssessment(Base):
    __tablename__ = "health_assessments"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False, index=True)

    # Input fields (13 health metrics)
    age = Column(Integer, nullable=False)
    bmi = Column(Float, nullable=False)
    blood_pressure_systolic = Column(Integer, nullable=False)
    blood_pressure_diastolic = Column(Integer, nullable=False)
    cholesterol = Column(Float, nullable=False)
    glucose = Column(Float, nullable=False)
    smoking = Column(Boolean, nullable=False, default=False)
    alcohol_weekly_units = Column(Float, nullable=False)
    exercise_hours_weekly = Column(Float, nullable=False)
    sleep_hours_daily = Column(Float, nullable=False)
    stress_level = Column(Integer, nullable=False)
    family_history_heart_disease = Column(Boolean, nullable=False, default=False)
    family_history_diabetes = Column(Boolean, nullable=False, default=False)

    # Risk scores
    overall_risk = Column(Float, nullable=False)
    cardiovascular_risk = Column(Float, nullable=False)
    diabetes_risk = Column(Float, nullable=False)
    mental_health_risk = Column(Float, nullable=False)
    risk_level = Column(String(20), nullable=False)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

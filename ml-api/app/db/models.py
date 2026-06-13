import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, DateTime, Boolean
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
    overall_risk = Column(String, nullable=False)
    cardiovascular_risk = Column(String, nullable=False)
    diabetes_risk = Column(String, nullable=False)
    mental_health_risk = Column(String, nullable=False)
    risk_level = Column(String(20), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

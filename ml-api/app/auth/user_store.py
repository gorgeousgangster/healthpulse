"""
PostgreSQL-backed user store using SQLAlchemy.
"""

import logging
import uuid

from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.db.models import User

logger = logging.getLogger("uvicorn.error")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_user(db: Session, email: str, password: str, name: str) -> User:
    existing = get_user_by_email(db, email.strip().lower())
    if existing:
        raise ValueError("User with this email already exists")

    user = User(
        id=str(uuid.uuid4()),
        email=email.strip().lower(),
        name=name.strip(),
        password_hash=hash_password(password),
    )
    try:
        db.add(user)
        db.commit()
        db.refresh(user)
        logger.info(f"User registered successfully: {user.email}")
    except Exception as e:
        db.rollback()
        logger.error(f"REGISTRATION DATABASE ERROR: {str(e)}")
        raise
    return user


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email.lower()).first()


def get_user_by_id(db: Session, user_id: str) -> User | None:
    return db.query(User).filter(User.id == user_id).first()

import logging

from fastapi import APIRouter, HTTPException, status, Depends, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.auth.models import UserCreate, UserLogin, UserResponse, TokenResponse, TokenRefresh
from app.auth.jwt_handler import (
    create_access_token,
    create_refresh_token,
    verify_token,
    get_current_user,
)
from app.auth.user_store import create_user, get_user_by_email, get_user_by_id, verify_password
from app.auth.config import settings
from app.db.engine import get_db
from app.rate_limit import limiter

logger = logging.getLogger("uvicorn.error")

router = APIRouter()


@router.post("/auth/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
def register(request: Request, data: UserCreate, db: Session = Depends(get_db)):
    try:
        user = create_user(db, data.email.strip(), data.password, data.name.strip())
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except Exception as e:
        logger.error(f"REGISTRATION DATABASE ERROR: {str(e)}")
        return JSONResponse(status_code=500, content={"detail": f"Database error: {str(e)}"})

    return TokenResponse(
        access_token=create_access_token(user.id, user.email),
        refresh_token=create_refresh_token(user.id),
        expires_in=settings.access_token_expire_minutes * 60,
    )


@router.post("/auth/login", response_model=TokenResponse)
@limiter.limit("10/minute")
def login(request: Request, data: UserLogin, db: Session = Depends(get_db)):
    user = get_user_by_email(db, data.email.strip().lower())
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    return TokenResponse(
        access_token=create_access_token(user.id, user.email),
        refresh_token=create_refresh_token(user.id),
        expires_in=settings.access_token_expire_minutes * 60,
    )


@router.post("/auth/refresh", response_model=TokenResponse)
def refresh(data: TokenRefresh, db: Session = Depends(get_db)):
    payload = verify_token(data.refresh_token, expected_type="refresh")
    user_id = payload["sub"]

    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return TokenResponse(
        access_token=create_access_token(user.id, user.email),
        refresh_token=create_refresh_token(user.id),
        expires_in=settings.access_token_expire_minutes * 60,
    )


@router.get("/auth/me", response_model=UserResponse)
def get_me(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user = get_user_by_id(db, current_user["sub"])
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return UserResponse(id=user.id, email=user.email, name=user.name)

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.auth.config import settings

engine = create_engine(
    settings.database_url,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

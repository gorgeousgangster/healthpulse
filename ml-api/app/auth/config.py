import os

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    jwt_secret_key: str = "CHANGE-ME-IN-PRODUCTION"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    refresh_token_expire_days: int = 7
    allowed_origins: list[str] = ["http://localhost:3000"]
    database_url: str = "postgresql://postgres:postgres@localhost:5432/healthpulse"

    class Config:
        env_file = ".env"
        env_prefix = "HEALTHPULSE_"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Railway injects DATABASE_URL directly (no prefix)
        railway_db = os.environ.get("DATABASE_URL")
        if railway_db:
            self.database_url = railway_db


settings = Settings()

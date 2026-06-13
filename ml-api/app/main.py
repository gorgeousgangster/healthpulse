import asyncio
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.auth.config import settings
from app.db.engine import engine
from app.db.models import Base
from app.rate_limit import limiter
from app.routers import health_risk, recommendations, model_ops, auth
from app.services.risk_engine import get_model

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def _load_model_sync():
    logger.info("Loading ML model in background...")
    get_model()
    logger.info("Model ready.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database ready.")

    loop = asyncio.get_event_loop()
    loop.run_in_executor(None, _load_model_sync)
    yield


app = FastAPI(
    title="HealthPulse ML API",
    description="AI-powered preventive health analytics",
    version="2.0.0",
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1", tags=["Authentication"])
app.include_router(health_risk.router, prefix="/api/v1", tags=["Health Risk"])
app.include_router(recommendations.router, prefix="/api/v1", tags=["Recommendations"])
app.include_router(model_ops.router, prefix="/api/v1", tags=["Model Operations"])


@app.get("/")
def root():
    return {"status": "ok"}


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "healthpulse-ml", "version": "2.0.0"}


if __name__ == "__main__":
    import os
    import uvicorn

    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

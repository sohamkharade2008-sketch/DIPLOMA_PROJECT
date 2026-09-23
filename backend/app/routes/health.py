from datetime import datetime, timezone
from fastapi import APIRouter
from app.config import settings
from app.database import get_db
from ai.model_loader import ModelLoader
from app.schemas.schemas import HealthStatusResponse

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthStatusResponse)
async def health_check():
    """
    Health check endpoint returning system status, database connectivity, and AI model mode.
    """
    db = get_db()
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "demoMode": settings.DEMO_MODE,
        "databaseConnected": db.is_connected,
        "modelLoaded": ModelLoader.is_model_loaded(),
        "time": datetime.now(timezone.utc)
    }

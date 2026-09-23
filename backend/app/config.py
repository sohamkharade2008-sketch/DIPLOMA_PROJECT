import os
from pathlib import Path
from pydantic_settings import BaseSettings

# Determine base directory
BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "AgroScan AI"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    
    # MongoDB
    MONGODB_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "plant_disease_db"
    
    # Security
    JWT_SECRET: str = "agros_secret_key_change_in_production_92837498234"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    
    # AI / Model
    DEMO_MODE: bool = True
    MODEL_PATH: str = str(BASE_DIR / "models" / "plant_disease_model.h5")
    CLASS_NAMES_PATH: str = str(BASE_DIR / "ai" / "class_names.json")
    CONFIDENCE_THRESHOLD: float = 0.80
    IMAGE_SIZE: int = 224
    
    # Uploads & Storage
    UPLOAD_DIR: str = str(BASE_DIR / "uploads")
    MAX_UPLOAD_SIZE_MB: int = 10
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ]

    class Config:
        env_file = str(BASE_DIR / ".env")
        extra = "ignore"

settings = Settings()

# Ensure uploads directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(BASE_DIR / "models", exist_ok=True)

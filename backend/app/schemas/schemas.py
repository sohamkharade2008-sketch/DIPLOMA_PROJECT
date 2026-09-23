from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

# ----------------- Auth & User Schemas -----------------
class UserRegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    createdAt: datetime

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# ----------------- Prediction Schemas -----------------
class PredictionResponse(BaseModel):
    id: str
    userId: Optional[str] = None
    plant: str
    disease: str
    status: str  # "Healthy" | "Diseased"
    confidence: float
    confidenceCategory: str  # "High Confidence" | "Moderate Confidence" | "Low Confidence"
    confidenceLabel: str
    imageUrl: str
    imagePath: str
    modelVersion: str
    isDemoPrediction: bool
    createdAt: datetime
    description: Optional[str] = None
    symptoms: Optional[List[str]] = []
    prevention: Optional[List[str]] = []
    disclaimer: str

class PredictionListResponse(BaseModel):
    items: List[PredictionResponse]
    total: int
    page: int
    limit: int
    pages: int

# ----------------- Disease Encyclopedia Schemas -----------------
class DiseaseInfoResponse(BaseModel):
    id: str
    plant: str
    disease: str
    status: str
    severity: str
    description: str
    symptoms: List[str]
    generalInformation: str
    prevention: List[str]

# ----------------- Health & Stats -----------------
class HealthStatusResponse(BaseModel):
    status: str
    service: str
    version: str
    demoMode: bool
    databaseConnected: bool
    modelLoaded: bool
    time: datetime

class UserDashboardStatsResponse(BaseModel):
    totalScans: int
    healthyCount: int
    diseasedCount: int
    averageConfidence: float
    recentPredictions: List[PredictionResponse]

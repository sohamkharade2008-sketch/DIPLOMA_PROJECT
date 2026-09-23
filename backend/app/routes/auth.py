import uuid
from datetime import datetime, timezone
from bson import ObjectId
from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.schemas import (
    UserRegisterRequest,
    UserLoginRequest,
    UserResponse,
    TokenResponse
)
from app.services.auth_service import hash_password, verify_password, create_access_token
from app.middleware.auth_guard import get_current_user_required
from app.database import get_db

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(req: UserRegisterRequest):
    db = get_db()
    email_clean = req.email.strip().lower()

    # Check if user already exists
    if db.is_connected and db.db is not None:
        existing = await db.db.users.find_one({"email": email_clean})
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with this email address already exists."
            )
        
        user_doc = {
            "name": req.name.strip(),
            "email": email_clean,
            "passwordHash": hash_password(req.password),
            "createdAt": datetime.now(timezone.utc)
        }
        res = await db.db.users.insert_one(user_doc)
        user_id = str(res.inserted_id)
        user_doc["id"] = user_id
    else:
        # Fallback memory store
        for u in db._memory_store["users"].values():
            if u["email"] == email_clean:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="A user with this email address already exists."
                )
        user_id = str(uuid.uuid4())
        user_doc = {
            "_id": user_id,
            "id": user_id,
            "name": req.name.strip(),
            "email": email_clean,
            "passwordHash": hash_password(req.password),
            "createdAt": datetime.now(timezone.utc)
        }
        db._memory_store["users"][user_id] = user_doc

    # Generate token
    token = create_access_token({"sub": user_id, "email": email_clean, "name": req.name})
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "name": user_doc["name"],
            "email": user_doc["email"],
            "createdAt": user_doc["createdAt"]
        }
    }

@router.post("/login", response_model=TokenResponse)
async def login(req: UserLoginRequest):
    db = get_db()
    email_clean = req.email.strip().lower()
    user_doc = None

    if db.is_connected and db.db is not None:
        user_doc = await db.db.users.find_one({"email": email_clean})
    else:
        for u in db._memory_store["users"].values():
            if u["email"] == email_clean:
                user_doc = u
                break

    if not user_doc or not verify_password(req.password, user_doc["passwordHash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    user_id = str(user_doc.get("_id"))
    token = create_access_token({"sub": user_id, "email": email_clean, "name": user_doc["name"]})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "name": user_doc["name"],
            "email": user_doc["email"],
            "createdAt": user_doc["createdAt"]
        }
    }

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(user: dict = Depends(get_current_user_required)):
    return {
        "id": str(user["id"]),
        "name": user["name"],
        "email": user["email"],
        "createdAt": user["createdAt"]
    }

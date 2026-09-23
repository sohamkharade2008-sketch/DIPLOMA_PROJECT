from typing import Optional
from bson import ObjectId
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.auth_service import decode_access_token
from app.database import get_db

security = HTTPBearer(auto_error=False)

async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[dict]:
    """
    Extracts authenticated user from JWT Bearer token if provided.
    Returns None if no token or token is invalid (allowing guest uploads).
    """
    if not credentials or not credentials.credentials:
        return None
    
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        return None
    
    user_id = payload["sub"]
    db = get_db()
    
    if db.is_connected and db.db is not None:
        try:
            user = await db.db.users.find_one({"_id": ObjectId(user_id)})
            if user:
                user["id"] = str(user["_id"])
                return user
        except Exception:
            pass
    else:
        # Fallback memory store lookup
        if user_id in db._memory_store["users"]:
            user = db._memory_store["users"][user_id]
            user["id"] = user_id
            return user
            
    return None

async def get_current_user_required(
    current_user: Optional[dict] = Depends(get_current_user_optional)
) -> dict:
    """
    Guards protected routes, raising 401 Unauthorized if token is missing or invalid.
    """
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please log in to access this resource.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return current_user

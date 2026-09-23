import uuid
from datetime import datetime, timezone
from typing import Optional
from bson import ObjectId
from fastapi import APIRouter, UploadFile, File, HTTPException, status, Depends, Query
from app.schemas.schemas import (
    PredictionResponse,
    PredictionListResponse,
    UserDashboardStatsResponse
)
from app.services.storage_service import StorageService
from app.services.disease_service import DiseaseService
from app.middleware.auth_guard import get_current_user_optional, get_current_user_required
from app.database import get_db
from ai.predictor import PlantDiseasePredictor

router = APIRouter(prefix="/predictions", tags=["Predictions"])

@router.post("", response_model=PredictionResponse, status_code=status.HTTP_201_CREATED)
async def create_prediction(
    file: UploadFile = File(...),
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    """
    Upload a leaf image, run AI disease analysis, save results to MongoDB, and return prediction.
    Accessible to logged-in users and anonymous users (stores userId if authenticated).
    """
    # 1. Validate and save file securely
    relative_url, absolute_path = await StorageService.validate_and_save_image(file)

    # 2. Run prediction engine
    result = PlantDiseasePredictor.predict(absolute_path)

    # 3. Enrich with disease information if missing
    disease_info = DiseaseService.get_by_plant_and_disease(result["plant"], result["disease"])
    if disease_info:
        if not result.get("description"):
            result["description"] = disease_info.get("description")
        if not result.get("symptoms"):
            result["symptoms"] = disease_info.get("symptoms", [])
        if not result.get("prevention"):
            result["prevention"] = disease_info.get("prevention", [])

    user_id = str(current_user["id"]) if current_user else None
    created_at = datetime.now(timezone.utc)

    # 4. Save to Database
    db = get_db()
    prediction_doc = {
        "userId": user_id,
        "imagePath": absolute_path,
        "imageUrl": relative_url,
        "plant": result["plant"],
        "disease": result["disease"],
        "status": result["status"],
        "confidence": result["confidence"],
        "confidenceCategory": result["confidenceCategory"],
        "confidenceLabel": result["confidenceLabel"],
        "modelVersion": result["modelVersion"],
        "isDemoPrediction": result["isDemoPrediction"],
        "description": result.get("description"),
        "symptoms": result.get("symptoms", []),
        "prevention": result.get("prevention", []),
        "disclaimer": result["disclaimer"],
        "createdAt": created_at
    }

    if db.is_connected and db.db is not None:
        insert_res = await db.db.predictions.insert_one(prediction_doc)
        prediction_id = str(insert_res.inserted_id)
    else:
        prediction_id = str(uuid.uuid4())
        prediction_doc["_id"] = prediction_id
        db._memory_store["predictions"][prediction_id] = prediction_doc

    prediction_doc["id"] = prediction_id
    return prediction_doc

@router.get("", response_model=PredictionListResponse)
async def list_predictions(
    current_user: dict = Depends(get_current_user_required),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    plant: Optional[str] = None,
    status_filter: Optional[str] = None,
    search: Optional[str] = None,
    sort_order: str = Query("desc", pattern="^(asc|desc)$")
):
    """
    Get paginated, searchable, and filterable prediction history for the authenticated user.
    """
    user_id = str(current_user["id"])
    db = get_db()
    skip = (page - 1) * limit

    if db.is_connected and db.db is not None:
        query: dict = {"userId": user_id}
        if plant and plant.lower() != "all":
            query["plant"] = {"$regex": plant, "$options": "i"}
        if status_filter and status_filter.lower() != "all":
            query["status"] = {"$regex": f"^{status_filter}$", "$options": "i"}
        if search:
            query["$or"] = [
                {"plant": {"$regex": search, "$options": "i"}},
                {"disease": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}}
            ]
        
        sort_dir = -1 if sort_order == "desc" else 1
        total = await db.db.predictions.count_documents(query)
        cursor = db.db.predictions.find(query).sort("createdAt", sort_dir).skip(skip).limit(limit)
        
        items = []
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            items.append(doc)
    else:
        # Memory store filtering
        user_preds = [
            p for p in db._memory_store["predictions"].values()
            if p.get("userId") == user_id
        ]
        if plant and plant.lower() != "all":
            user_preds = [p for p in user_preds if plant.lower() in p.get("plant", "").lower()]
        if status_filter and status_filter.lower() != "all":
            user_preds = [p for p in user_preds if p.get("status", "").lower() == status_filter.lower()]
        if search:
            s = search.lower()
            user_preds = [
                p for p in user_preds
                if s in p.get("plant", "").lower() or s in p.get("disease", "").lower()
            ]
        
        user_preds.sort(key=lambda x: x.get("createdAt", datetime.min), reverse=(sort_order == "desc"))
        total = len(user_preds)
        items = user_preds[skip : skip + limit]

    pages = (total + limit - 1) // limit if total > 0 else 1
    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": pages
    }

@router.get("/stats", response_model=UserDashboardStatsResponse)
async def get_dashboard_stats(current_user: dict = Depends(get_current_user_required)):
    """
    Get aggregated prediction statistics and recent scans for user dashboard.
    """
    user_id = str(current_user["id"])
    db = get_db()
    
    if db.is_connected and db.db is not None:
        cursor = db.db.predictions.find({"userId": user_id}).sort("createdAt", -1)
        all_user_preds = []
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            all_user_preds.append(doc)
    else:
        all_user_preds = [
            p for p in db._memory_store["predictions"].values()
            if p.get("userId") == user_id
        ]
        all_user_preds.sort(key=lambda x: x.get("createdAt", datetime.min), reverse=True)

    total = len(all_user_preds)
    healthy_count = sum(1 for p in all_user_preds if p.get("status", "").lower() == "healthy")
    diseased_count = sum(1 for p in all_user_preds if p.get("status", "").lower() == "diseased")
    avg_conf = (
        round(sum(p.get("confidence", 0) for p in all_user_preds) / total, 1)
        if total > 0 else 0.0
    )

    return {
        "totalScans": total,
        "healthyCount": healthy_count,
        "diseasedCount": diseased_count,
        "averageConfidence": avg_conf,
        "recentPredictions": all_user_preds[:5]
    }

@router.get("/{prediction_id}", response_model=PredictionResponse)
async def get_prediction_detail(prediction_id: str):
    """
    Get full details of a specific prediction by its ID.
    """
    db = get_db()
    doc = None
    if db.is_connected and db.db is not None:
        try:
            doc = await db.db.predictions.find_one({"_id": ObjectId(prediction_id)})
        except Exception:
            pass
    
    if not doc:
        doc = db._memory_store["predictions"].get(prediction_id)

    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prediction record not found."
        )
    
    doc["id"] = str(doc.get("_id", prediction_id))
    return doc

@router.delete("/{prediction_id}", status_code=status.HTTP_200_OK)
async def delete_prediction(
    prediction_id: str,
    current_user: dict = Depends(get_current_user_required)
):
    """
    Delete a prediction record and its associated image from uploads.
    """
    user_id = str(current_user["id"])
    db = get_db()
    doc = None

    if db.is_connected and db.db is not None:
        try:
            doc = await db.db.predictions.find_one({"_id": ObjectId(prediction_id), "userId": user_id})
            if doc:
                await db.db.predictions.delete_one({"_id": ObjectId(prediction_id)})
        except Exception:
            pass
    else:
        if prediction_id in db._memory_store["predictions"]:
            stored = db._memory_store["predictions"][prediction_id]
            if stored.get("userId") == user_id:
                doc = stored
                del db._memory_store["predictions"][prediction_id]

    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prediction record not found or not owned by the current user."
        )

    # Clean up physical file
    if "imagePath" in doc:
        StorageService.delete_image(doc["imagePath"])

    return {"message": "Prediction record deleted successfully.", "id": prediction_id}

from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Query
from app.schemas.schemas import DiseaseInfoResponse
from app.services.disease_service import DiseaseService

router = APIRouter(prefix="/diseases", tags=["Disease Knowledge Base"])

@router.get("", response_model=List[DiseaseInfoResponse])
async def get_all_diseases(plant: Optional[str] = Query(None, description="Filter by crop/plant name")):
    """
    Get all plant disease profiles or filter by specific plant species.
    """
    all_diseases = DiseaseService.get_all()
    if plant and plant.lower() != "all":
        return [d for d in all_diseases if plant.lower() in d.get("plant", "").lower()]
    return all_diseases

@router.get("/{disease_id}", response_model=DiseaseInfoResponse)
async def get_disease_by_id(disease_id: str):
    """
    Get detailed information about a single disease.
    """
    disease = DiseaseService.get_by_id(disease_id)
    if not disease:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Disease record '{disease_id}' not found."
        )
    return disease

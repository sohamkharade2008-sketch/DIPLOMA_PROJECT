import json
import logging
from pathlib import Path
from typing import List, Optional, Dict, Any
from app.config import settings

logger = logging.getLogger("agros.diseases")

class DiseaseService:
    _diseases_cache: List[Dict[str, Any]] = []

    @classmethod
    def load_diseases(cls) -> List[Dict[str, Any]]:
        if cls._diseases_cache:
            return cls._diseases_cache
        
        path = Path(settings.CLASS_NAMES_PATH)
        if path.exists():
            try:
                with open(path, "r", encoding="utf-8") as f:
                    cls._diseases_cache = json.load(f)
                    return cls._diseases_cache
            except Exception as e:
                logger.error(f"Error reading diseases database: {e}")
        return []

    @classmethod
    def get_all(cls) -> List[Dict[str, Any]]:
        return cls.load_diseases()

    @classmethod
    def get_by_id(cls, disease_id: str) -> Optional[Dict[str, Any]]:
        diseases = cls.load_diseases()
        for d in diseases:
            if d.get("id") == disease_id:
                return d
        return None

    @classmethod
    def get_by_plant_and_disease(cls, plant: str, disease: str) -> Optional[Dict[str, Any]]:
        diseases = cls.load_diseases()
        p_lower = plant.lower().strip()
        d_lower = disease.lower().strip()
        for d in diseases:
            if d.get("plant", "").lower() in p_lower or p_lower in d.get("plant", "").lower():
                if d.get("disease", "").lower() in d_lower or d_lower in d.get("disease", "").lower():
                    return d
        return None

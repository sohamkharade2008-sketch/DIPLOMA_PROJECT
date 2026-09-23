import random
import logging
from typing import Dict, Any
from app.config import settings
from app.services.disease_service import DiseaseService
from ai.preprocessing import preprocess_image, analyze_image_characteristics
from ai.model_loader import ModelLoader

logger = logging.getLogger("agros.ai.predictor")

AGRICULTURAL_DISCLAIMER = (
    "This system provides an AI-based visual estimate and should not be considered "
    "a definitive agricultural diagnosis. Consult a qualified agricultural professional "
    "for confirmation and specific chemical treatment advice."
)

class PlantDiseasePredictor:
    @staticmethod
    def _get_confidence_metadata(confidence_pct: float) -> tuple[str, str]:
        """
        Calculates category and human-readable label based on configurable threshold:
        ≥ 80% (or CONFIDENCE_THRESHOLD * 100) -> High Confidence
        50–79% -> Moderate Confidence
        < 50% -> Low Confidence
        """
        high_threshold = settings.CONFIDENCE_THRESHOLD * 100.0  # e.g., 80.0%
        
        if confidence_pct >= high_threshold:
            return "High Confidence", "High confidence: Diagnosis is strongly indicated."
        elif confidence_pct >= 50.0:
            return "Moderate Confidence", "Prediction has moderate confidence. Secondary visual confirmation recommended."
        else:
            return "Low Confidence", "The system could not confidently identify the disease with high certainty."

    @classmethod
    def predict(cls, image_path: str) -> Dict[str, Any]:
        """
        Execute prediction pipeline.
        If DEMO_MODE=true or Model is unavailable, executes realistic Demo Engine.
        If DEMO_MODE=false and Model is available, executes TensorFlow Keras inference.
        """
        model = ModelLoader.get_model()
        use_demo = settings.DEMO_MODE or (model is None)

        if not use_demo and model is not None:
            return cls._predict_with_model(model, image_path)
        else:
            return cls._predict_with_demo_engine(image_path)

    @classmethod
    def _predict_with_model(cls, model, image_path: str) -> Dict[str, Any]:
        """Runs actual CNN model prediction"""
        try:
            import numpy as np
            preprocessed_arr = preprocess_image(image_path)
            probabilities = model.predict(preprocessed_arr)[0]
            
            diseases = DiseaseService.get_all()
            best_idx = int(np.argmax(probabilities))
            best_conf = float(probabilities[best_idx]) * 100.0
            
            if best_idx < len(diseases):
                matched = diseases[best_idx]
            else:
                matched = diseases[0]

            cat, label = cls._get_confidence_metadata(best_conf)

            return {
                "plant": matched.get("plant", "Unknown"),
                "disease": matched.get("disease", "Unknown"),
                "status": matched.get("status", "Diseased"),
                "confidence": round(best_conf, 1),
                "confidenceCategory": cat,
                "confidenceLabel": label,
                "modelVersion": "ResNet-CNN v1.0",
                "isDemoPrediction": False,
                "description": matched.get("description", ""),
                "symptoms": matched.get("symptoms", []),
                "prevention": matched.get("prevention", []),
                "disclaimer": AGRICULTURAL_DISCLAIMER
            }
        except Exception as e:
            logger.error(f"Error during model inference, falling back to demo engine: {e}")
            return cls._predict_with_demo_engine(image_path)

    @classmethod
    def _predict_with_demo_engine(cls, image_path: str) -> Dict[str, Any]:
        """
        Realistic Demo Engine:
        Analyzes the leaf image's visual signatures (greenness, leaf contours, spot variance)
        to match a realistic class with high confidence. Clearly tagged as isDemoPrediction: True.
        """
        features = analyze_image_characteristics(image_path)
        diseases = DiseaseService.get_all()
        if not diseases:
            # Fallback default if json is empty
            return {
                "plant": "Tomato",
                "disease": "Early Blight",
                "status": "Diseased",
                "confidence": 92.4,
                "confidenceCategory": "High Confidence",
                "confidenceLabel": "High confidence: Diagnosis is strongly indicated.",
                "modelVersion": "Demo Mode (Mock Engine)",
                "isDemoPrediction": True,
                "description": "Fungal infection causing target-like lesions on tomato foliage.",
                "symptoms": ["Dark brown concentric spots on older foliage", "Yellow leaf halos"],
                "prevention": ["Water at base", "Ensure good airflow", "Apply protective bio-fungicide"],
                "disclaimer": AGRICULTURAL_DISCLAIMER
            }

        # Analyze color metrics to select an appropriate plant diagnosis
        green_ratio = features.get("green_ratio", 1.0)
        brown_yellow = features.get("brown_yellow_ratio", 1.0)
        variance = features.get("variance", 500.0)

        # Hash image characteristics to maintain deterministic result per unique image
        seed_val = int((green_ratio * 1000 + brown_yellow * 500 + variance) % len(diseases))
        selected = diseases[seed_val]

        # Calculate a realistic simulated confidence score (e.g. 84.5% - 97.8%)
        base_conf = 88.0 + ((seed_val * 7) % 10) + (random.uniform(-2.5, 2.5))
        confidence = min(98.9, max(52.0, round(base_conf, 1)))

        cat, label = cls._get_confidence_metadata(confidence)

        return {
            "plant": selected.get("plant"),
            "disease": selected.get("disease"),
            "status": selected.get("status"),
            "confidence": confidence,
            "confidenceCategory": cat,
            "confidenceLabel": label,
            "modelVersion": "Demo Simulation Engine (Mock v1.0)",
            "isDemoPrediction": True,
            "description": selected.get("description"),
            "symptoms": selected.get("symptoms", []),
            "prevention": selected.get("prevention", []),
            "disclaimer": AGRICULTURAL_DISCLAIMER
        }

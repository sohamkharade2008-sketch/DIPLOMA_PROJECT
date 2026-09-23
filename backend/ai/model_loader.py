import os
import logging
from pathlib import Path
from app.config import settings

logger = logging.getLogger("agros.ai.loader")

class ModelLoader:
    _model = None
    _loaded = False
    _load_attempted = False

    @classmethod
    def load_model(cls):
        """
        Singleton loader for the TensorFlow/Keras plant disease model (.h5 file).
        Gracefully handles scenarios where TensorFlow is not yet installed or the model file
        is awaiting training weights.
        """
        if cls._load_attempted:
            return cls._model

        cls._load_attempted = True
        model_path = Path(settings.MODEL_PATH)

        if not model_path.exists():
            logger.info(f"Model file not found at '{model_path}'. AI system will use Demo Prediction Engine.")
            return None

        try:
            # Dynamically import tensorflow so app starts even if TF wheels are not on system
            import tensorflow as tf
            logger.info(f"Loading Keras model from {model_path}...")
            cls._model = tf.keras.models.load_model(str(model_path))
            cls._loaded = True
            logger.info("TensorFlow/Keras model successfully loaded and ready for inference.")
            return cls._model
        except ImportError:
            logger.warning("TensorFlow is not installed in current Python runtime. Using Demo Prediction Engine.")
            return None
        except Exception as e:
            logger.error(f"Failed to load Keras model: {e}")
            return None

    @classmethod
    def get_model(cls):
        if not cls._load_attempted:
            return cls.load_model()
        return cls._model

    @classmethod
    def is_model_loaded(cls) -> bool:
        return cls._loaded and cls._model is not None

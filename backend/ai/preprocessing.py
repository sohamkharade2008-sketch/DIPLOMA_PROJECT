from typing import Optional
from PIL import Image
from app.config import settings

def preprocess_image(image_path: str, target_size: Optional[tuple] = None):
    """
    Load an image from disk, convert to RGB, resize, normalize pixel range to [0, 1],
    and return as a batch array of shape (1, height, width, 3).
    """
    if target_size is None:
        target_size = (settings.IMAGE_SIZE, settings.IMAGE_SIZE)
    
    with Image.open(image_path) as img:
        rgb_img = img.convert("RGB")
        resized_img = rgb_img.resize(target_size, Image.Resampling.BILINEAR)
        
        try:
            import numpy as np
            img_array = np.array(resized_img, dtype=np.float32) / 255.0
            return np.expand_dims(img_array, axis=0)
        except ImportError:
            # Python standard list structure fallback if numpy is still downloading
            width, height = resized_img.size
            pixels = list(resized_img.getdata())
            # Convert to list matrix
            matrix = [
                [[p[0]/255.0, p[1]/255.0, p[2]/255.0] for p in pixels[i * width : (i + 1) * width]]
                for i in range(height)
            ]
            return [matrix]

def analyze_image_characteristics(image_path: str) -> dict:
    """
    Extracts basic color/texture characteristics from the image to inform
    demo simulations with realistic, deterministic visual features.
    """
    try:
        with Image.open(image_path) as img:
            rgb_img = img.convert("RGB")
            thumb = rgb_img.resize((64, 64))
            pixels = list(thumb.getdata())
            total = len(pixels)
            
            r_sum = sum(p[0] for p in pixels)
            g_sum = sum(p[1] for p in pixels)
            b_sum = sum(p[2] for p in pixels)
            
            r_mean = r_sum / total
            g_mean = g_sum / total
            b_mean = b_sum / total
            
            green_ratio = (g_mean + 1e-5) / (r_mean + b_mean + 1e-5)
            brown_yellow_ratio = (r_mean + g_mean + 1e-5) / (2.0 * b_mean + 1e-5)
            
            # Simple variance metric
            variance = sum((p[0] - r_mean)**2 + (p[1] - g_mean)**2 for p in pixels) / total
            
            return {
                "r_mean": r_mean,
                "g_mean": g_mean,
                "b_mean": b_mean,
                "green_ratio": green_ratio,
                "brown_yellow_ratio": brown_yellow_ratio,
                "variance": variance
            }
    except Exception:
        return {
            "green_ratio": 1.0,
            "brown_yellow_ratio": 1.0,
            "variance": 500.0
        }

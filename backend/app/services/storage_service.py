import os
import uuid
from pathlib import Path
from typing import Tuple
from fastapi import UploadFile, HTTPException, status
from PIL import Image
from app.config import settings

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_MIME_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp"
}

class StorageService:
    @staticmethod
    async def validate_and_save_image(file: UploadFile) -> Tuple[str, str]:
        """
        Validates the uploaded file for:
        1. Content length (Size limit)
        2. Extension validity
        3. MIME type inspection
        4. Actual image header validation using PIL (preventing malicious payloads)
        
        Returns:
            (relative_url, absolute_file_path)
        """
        # 1. Extension check
        filename = file.filename or ""
        ext = Path(filename).suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file extension '{ext}'. Allowed extensions are: {', '.join(ALLOWED_EXTENSIONS)}"
            )

        # 2. MIME type check
        if file.content_type and file.content_type.lower() not in ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid MIME type '{file.content_type}'. Must be a valid JPEG, PNG, or WEBP image."
            )

        # 3. Read content and check size
        contents = await file.read()
        max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
        if len(contents) > max_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File size exceeds maximum limit of {settings.MAX_UPLOAD_SIZE_MB}MB."
            )

        if len(contents) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is empty."
            )

        # 4. Deep image inspection using PIL
        try:
            import io
            image_stream = io.BytesIO(contents)
            with Image.open(image_stream) as img:
                img.verify()  # Verifies file integrity
                format_detected = img.format.lower() if img.format else ""
                if format_detected not in {"jpeg", "png", "webp"}:
                    raise ValueError(f"Unrecognized inner image format {format_detected}")
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The uploaded file is not a valid or readable image."
            )

        # 5. Generate secure, unique filename to prevent directory traversal & collision
        safe_name = f"leaf_{uuid.uuid4().hex[:16]}{ext}"
        target_path = Path(settings.UPLOAD_DIR) / safe_name
        
        # Save file to disk
        with open(target_path, "wb") as f:
            f.write(contents)

        relative_url = f"/uploads/{safe_name}"
        return relative_url, str(target_path)

    @staticmethod
    def delete_image(image_path: str) -> bool:
        """Safely delete image file from uploads folder"""
        try:
            p = Path(image_path)
            # If relative, resolve against base upload dir
            if not p.is_absolute():
                p = Path(settings.UPLOAD_DIR) / p.name
            if p.exists() and p.is_file():
                p.unlink()
                return True
        except Exception:
            pass
        return False

import json
import logging
import asyncio
from pathlib import Path
from datetime import datetime
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import BASE_DIR, settings

logger = logging.getLogger("agros.database")

class Database:
    client: AsyncIOMotorClient = None
    db = None
    is_connected: bool = False
    
    # Storage fallback (persisted to JSON file on disk)
    _memory_store = {
        "users": {},
        "predictions": {},
        "diseases": {}
    }
    
    _store_file: Path = BASE_DIR / "data" / "local_store.json"

    def load_local_store(self):
        """Loads persistent user and prediction records from disk if available"""
        try:
            if self._store_file.exists():
                with open(self._store_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self._memory_store["users"] = data.get("users", {})
                    self._memory_store["predictions"] = data.get("predictions", {})
                    logger.info(f"Loaded {len(self._memory_store['users'])} users and {len(self._memory_store['predictions'])} scans from local store.")
        except Exception as e:
            logger.error(f"Failed to load local storage file: {e}")

    def save_local_store(self):
        """Saves current users and predictions to disk to preserve credentials and history"""
        try:
            self._store_file.parent.mkdir(parents=True, exist_ok=True)
            # Serialize datetimes safely
            def json_default(obj):
                if isinstance(obj, datetime):
                    return obj.isoformat()
                return str(obj)

            with open(self._store_file, "w", encoding="utf-8") as f:
                json.dump({
                    "users": self._memory_store["users"],
                    "predictions": self._memory_store["predictions"]
                }, f, indent=2, default=json_default)
        except Exception as e:
            logger.error(f"Failed to save local storage file: {e}")

db_instance = Database()
db_instance.load_local_store()

async def connect_to_mongo():
    """Attempt connection to MongoDB with graceful fallback"""
    logger.info(f"Connecting to MongoDB at {settings.MONGODB_URI}...")
    try:
        # Short timeout on startup to fail gracefully if no local/remote mongo is up
        client = AsyncIOMotorClient(
            settings.MONGODB_URI,
            serverSelectionTimeoutMS=2000,
            connectTimeoutMS=2000
        )
        # Verify connection
        await asyncio.wait_for(client.admin.command('ping'), timeout=2.5)
        db_instance.client = client
        db_instance.db = client[settings.DATABASE_NAME]
        db_instance.is_connected = True
        logger.info(f"Successfully connected to MongoDB database '{settings.DATABASE_NAME}'")
        
        # Create indexes
        try:
            await db_instance.db.users.create_index("email", unique=True)
            await db_instance.db.predictions.create_index([("userId", 1), ("createdAt", -1)])
            await db_instance.db.diseases.create_index("id", unique=True)
            logger.info("MongoDB indexes verified.")
        except Exception as idx_err:
            logger.warning(f"Index creation warning: {idx_err}")

    except Exception as e:
        db_instance.is_connected = False
        db_instance.client = None
        db_instance.db = None
        logger.warning(f"MongoDB connection could not be established ({e}). Running in persistent local store mode.")

async def close_mongo_connection():
    if db_instance.client:
        db_instance.client.close()
        logger.info("Closed MongoDB connection.")

def get_db():
    return db_instance

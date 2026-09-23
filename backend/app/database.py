import logging
import asyncio
from datetime import datetime
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

logger = logging.getLogger("agros.database")

class Database:
    client: AsyncIOMotorClient = None
    db = None
    is_connected: bool = False
    
    # In-memory storage fallback if MongoDB is not running locally
    _memory_store = {
        "users": {},
        "predictions": {},
        "diseases": {}
    }

db_instance = Database()

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
        logger.warning(f"MongoDB connection could not be established ({e}). Running in resilient fallback in-memory store mode.")

async def close_mongo_connection():
    if db_instance.client:
        db_instance.client.close()
        logger.info("Closed MongoDB connection.")

def get_db():
    return db_instance

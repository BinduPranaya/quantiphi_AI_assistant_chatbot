from pymongo import MongoClient
from pymongo.errors import PyMongoError
from config import Config

_client = None
_db = None
_db_error = None

def get_db():
    global _client, _db, _db_error
    if _db is not None:
        return _db
    if _db_error:
        raise RuntimeError(_db_error)
    try:
        _client = MongoClient(Config.MONGO_URI, serverSelectionTimeoutMS=2500)
        _client.admin.command("ping")
        _db = _client[Config.MONGO_DB]
        _db.conversations.create_index("updated_at")
        return _db
    except PyMongoError as exc:
        _db_error = f"MongoDB connection failed: {exc}"
        raise RuntimeError(_db_error)

def reset_db_connection():
    global _client, _db, _db_error
    if _client:
        _client.close()
    _client = _db = _db_error = None

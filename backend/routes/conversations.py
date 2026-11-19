from datetime import datetime, timezone
from bson import ObjectId
from bson.errors import InvalidId
from flask import Blueprint, jsonify
from database.db import get_db

conversations_bp = Blueprint("conversations", __name__)

def now_iso():
    return datetime.now(timezone.utc).isoformat()

def serialize_conversation(doc, include_messages=False):
    result = {
        "id": str(doc["_id"]),
        "title": doc.get("title", "New conversation"),
        "created_at": doc.get("created_at"),
        "updated_at": doc.get("updated_at"),
        "messages": doc.get("messages", []) if include_messages else []
    }
    return result

@conversations_bp.get("/api/conversations")
def list_conversations():
    try:
        docs = get_db().conversations.find().sort("updated_at", -1).limit(100)
        return jsonify([serialize_conversation(doc) for doc in docs])
    except RuntimeError as exc:
        return jsonify({"error": str(exc)}), 503

@conversations_bp.post("/api/conversations")
def create_conversation():
    try:
        timestamp = now_iso()
        doc = {
            "title": "New conversation",
            "created_at": timestamp,
            "updated_at": timestamp,
            "messages": []
        }
        result = get_db().conversations.insert_one(doc)
        doc["_id"] = result.inserted_id
        return jsonify(serialize_conversation(doc, True)), 201
    except RuntimeError as exc:
        return jsonify({"error": str(exc)}), 503

@conversations_bp.get("/api/conversations/<conversation_id>")
def get_conversation(conversation_id):
    try:
        doc = get_db().conversations.find_one({"_id": ObjectId(conversation_id)})
        if not doc:
            return jsonify({"error": "Conversation not found"}), 404
        return jsonify(serialize_conversation(doc, True))
    except InvalidId:
        return jsonify({"error": "Invalid conversation ID"}), 400
    except RuntimeError as exc:
        return jsonify({"error": str(exc)}), 503

@conversations_bp.delete("/api/conversations/<conversation_id>")
def delete_conversation(conversation_id):
    try:
        result = get_db().conversations.delete_one({"_id": ObjectId(conversation_id)})
        if not result.deleted_count:
            return jsonify({"error": "Conversation not found"}), 404
        return jsonify({"success": True})
    except InvalidId:
        return jsonify({"error": "Invalid conversation ID"}), 400
    except RuntimeError as exc:
        return jsonify({"error": str(exc)}), 503

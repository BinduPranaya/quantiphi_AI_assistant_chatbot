import json
from datetime import datetime, timezone
from bson import ObjectId
from bson.errors import InvalidId
from flask import Blueprint, Response, jsonify, request, stream_with_context
from database.db import get_db
from services.ai_service import stream_chat

chat_bp = Blueprint("chat", __name__)

def timestamp():
    return datetime.now(timezone.utc).isoformat()

def sse(payload):
    return "data: " + json.dumps(payload, ensure_ascii=False) + "\n\n"

@chat_bp.post("/api/chat/stream")
def chat_stream():
    data = request.get_json(silent=True) or {}
    conversation_id = data.get("conversation_id")
    prompt = data.get("message", "")
    tone = data.get("tone", "Professional")
    if not isinstance(prompt, str) or not prompt.strip():
        return jsonify({"error": "Message cannot be empty"}), 400
    if len(prompt) > 12000:
        return jsonify({"error": "Message is too long (maximum 12,000 characters)"}), 400
    if tone not in ("Professional", "Casual", "Concise"):
        tone = "Professional"

    try:
        db = get_db()
        conversation = None
        if conversation_id:
            try:
                conversation = db.conversations.find_one({"_id": ObjectId(conversation_id)})
            except InvalidId:
                return jsonify({"error": "Invalid conversation ID"}), 400
        if not conversation:
            stamp = timestamp()
            conversation = {
                "title": prompt.strip()[:48] + ("…" if len(prompt.strip()) > 48 else ""),
                "created_at": stamp,
                "updated_at": stamp,
                "messages": []
            }
            inserted = db.conversations.insert_one(conversation)
            conversation["_id"] = inserted.inserted_id

        user_message = {"role": "user", "content": prompt.strip(), "timestamp": timestamp()}
        history = conversation.get("messages", []) + [user_message]
        ai_stream = stream_chat(history, tone)
        conversation_id = str(conversation["_id"])
    except RuntimeError as exc:
        return jsonify({"error": str(exc)}), 503
    except Exception as exc:
        return jsonify({"error": f"Unable to start AI response: {str(exc)}"}), 500

    @stream_with_context
    def generate():
        answer_parts = []
        yield sse({"type": "start", "conversation_id": conversation_id, "user_message": user_message})
        try:
            for chunk in ai_stream:
                delta = chunk.choices[0].delta.content if chunk.choices else None
                if delta:
                    answer_parts.append(delta)
                    yield sse({"type": "token", "content": delta})
            answer = "".join(answer_parts)
            assistant_message = {"role": "assistant", "content": answer, "timestamp": timestamp()}
            db.conversations.update_one(
                {"_id": ObjectId(conversation_id)},
                {"$push": {"messages": {"$each": [user_message, assistant_message]}},
                 "$set": {"updated_at": timestamp()}}
            )
            yield sse({"type": "done", "conversation_id": conversation_id, "message": assistant_message})
        except Exception as exc:
            yield sse({"type": "error", "error": f"AI response failed: {str(exc)}"})
    return Response(generate(), mimetype="text/event-stream",
                    headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})

@chat_bp.post("/api/chat/regenerate")
def regenerate():
    data = request.get_json(silent=True) or {}
    conversation_id = data.get("conversation_id")
    tone = data.get("tone", "Professional")
    try:
        db = get_db()
        doc = db.conversations.find_one({"_id": ObjectId(conversation_id)})
        if not doc or len(doc.get("messages", [])) < 2:
            return jsonify({"error": "No response available to regenerate"}), 404
        messages = doc["messages"][:-2]
        last_user = next((m for m in reversed(doc.get("messages", [])) if m.get("role") == "user"), None)
        if not last_user:
            return jsonify({"error": "No user message found"}), 400
        db.conversations.update_one({"_id": doc["_id"]}, {"$set": {"messages": messages}})
        return jsonify({"success": True, "conversation_id": conversation_id, "messages": messages})
    except (InvalidId, TypeError):
        return jsonify({"error": "Invalid conversation ID"}), 400
    except RuntimeError as exc:
        return jsonify({"error": str(exc)}), 503

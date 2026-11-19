from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from routes.conversations import conversations_bp
from routes.chat import chat_bp

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": [Config.FRONTEND_ORIGIN]}})
    app.register_blueprint(conversations_bp)
    app.register_blueprint(chat_bp)

    @app.get("/")
    def home():
        return jsonify({"message": "Quantiphi AI Chat Assistant API is running"})

    @app.get("/api/health")
    def health():
        try:
            from database.db import get_db
            get_db().command("ping")
            return jsonify({"status": "healthy", "database": "connected"})
        except Exception as exc:
            return jsonify({"status": "degraded", "database": "disconnected", "detail": str(exc)}), 503

    return app

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=Config.PORT, debug=True)

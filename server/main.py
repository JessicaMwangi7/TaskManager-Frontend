# main.py
from flask import Flask, jsonify
from config import Config
from extensions import db, jwt, cors, migrate

# ─── IMPORT BLUEPRINTS ─────────────────────────────────────────────────────────
from routes.auth_routes         import auth_bp
from routes.project_routes      import project_bp
from routes.task_routes         import task_bp
from routes.comment_routes      import comment_bp
from routes.notification_routes import notification_bp
from routes.chat_routes         import chat_bp
from routes.collaborator_routes import collaborator_bp
from routes.team_routes         import team_test_bp
from routes.newsletter_routes   import newsletter_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # ─── INIT EXTENSIONS 
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(
        app,
        resources={ r"/api/*": {"origins": app.config["CORS_ORIGINS"]} },
        supports_credentials=True
    )

    # ─── REGISTER BLUEPRINTS 
    app.register_blueprint(auth_bp,           url_prefix="/api/auth")
    app.register_blueprint(project_bp,        url_prefix="/api")
    app.register_blueprint(task_bp)                                    # `/api/projects/...`
    app.register_blueprint(comment_bp,        url_prefix="/api")
    app.register_blueprint(notification_bp,   url_prefix="/api")
    app.register_blueprint(chat_bp,           url_prefix="/api/chat")
    app.register_blueprint(collaborator_bp,   url_prefix="/api")
    app.register_blueprint(team_test_bp,      url_prefix="/api/team")
    app.register_blueprint(newsletter_bp,     url_prefix="/api")

    # ─── ROOT & HEALTH-CHECK ROUTES 
    @app.route("/", methods=["GET"])
    def index():
        return jsonify({"message": "Welcome to TaskFlow API"}), 200

    @app.route("/healthz", methods=["GET"])
    def healthz():
        return jsonify({"status": "ok"}), 200

    return app

if __name__ == "__main__":
    create_app().run(debug=True)

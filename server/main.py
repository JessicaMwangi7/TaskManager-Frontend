from flask import Flask
from config import Config
from extensions import db, jwt, cors, migrate

# ✅ IMPORT ALL YOUR BLUEPRINTS
from routes.auth_routes import auth_bp
from routes.project_routes import project_bp
from routes.task_routes import task_bp
from routes.comment_routes import comment_bp
from routes.notification_routes import notification_bp
from routes.chat_routes import chat_bp
from routes.collaborator_routes import team_bp
from routes.team_routes import team_bp as team_test_bp
from app.routes import main  # root route "/"

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # ✅ PRINT SECRET KEY TO DEBUG
    print("✅ JWT_SECRET_KEY loaded in main.py →", app.config.get('JWT_SECRET_KEY'))

    # ✅ INIT EXTENSIONS
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)
    migrate.init_app(app, db)

    # ✅ REGISTER ALL BLUEPRINTS
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(project_bp, url_prefix='/api')
    app.register_blueprint(task_bp)  # already has /api/projects prefix inside blueprint
    app.register_blueprint(comment_bp, url_prefix='/api')
    app.register_blueprint(notification_bp, url_prefix='/api')
    app.register_blueprint(chat_bp, url_prefix='/api/chat')
    app.register_blueprint(team_bp, url_prefix='/api')
    app.register_blueprint(team_test_bp, url_prefix='/api/team')
    app.register_blueprint(main)  # base route "/"

    return app

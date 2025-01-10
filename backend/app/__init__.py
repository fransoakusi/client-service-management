from flask import Flask # type: ignore
from flask_cors import CORS # type: ignore
from flask_pymongo import PyMongo # type: ignore

# MongoDB initialization
mongo = PyMongo()

def create_app():
    app = Flask(__name__)
    app.config["MONGO_URI"] = "mongodb://localhost:27017/client_management"
    mongo.init_app(app)
    
    # Enable CORS
    CORS(app)
    
    # Register Blueprints
    from app.routes.auth import auth_bp
    from app.routes.admin import admin_bp
    from app.routes.users import users_bp
    from app.routes.clients import clients_bp
    
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(users_bp, url_prefix='/users')
    app.register_blueprint(clients_bp, url_prefix='/clients')
    
    return app

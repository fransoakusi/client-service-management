from flask import Flask
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_cors import CORS  # Import CORS

# Initialize extensions
mongo = PyMongo()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)

    # Load configurations
    app.config.from_object("app.config.Config")

    # Initialize extensions
    mongo.init_app(app)
    bcrypt.init_app(app)
    
    # Enable CORS for the entire app
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

    # Register blueprints
    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/auth")

    from app.routes.admin import admin_bp
    app.register_blueprint(admin_bp, url_prefix="/admin")
    
    from app.routes.clients import clients_bp
    app.register_blueprint(clients_bp, url_prefix="/clients")

    from app.routes.complaints import complaints_bp
    app.register_blueprint(complaints_bp, url_prefix="/complaints")

    from app.routes.enquiry import enquiry_bp
    app.register_blueprint(enquiry_bp, url_prefix="/enquiry")
    
    from app.routes.response import response_bp
    app.register_blueprint(response_bp, url_prefix="/response")


    from app.routes.referral import referral_bp
    app.register_blueprint(referral_bp, url_prefix="/referral")

    return app

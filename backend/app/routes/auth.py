from flask import Blueprint, request, jsonify
from app.utils import hash_password, verify_password
from app import mongo

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        # Parse JSON data from the request body
        data = request.get_json()

        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({"message": "Missing email or password"}), 400

        user = mongo.db.users.find_one({"email": email})
        if not user or not verify_password(password, user['password']):
            return jsonify({"message": "Invalid credentials"}), 401
        
        return jsonify({"message": "Login successful"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 415

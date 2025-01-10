from flask import Blueprint, request, jsonify
from app.utils import hash_password  # Import the hash_password function
from app import mongo

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/create-user', methods=['POST'])
def create_user():
    try:
        data = request.get_json()

        # Extract fields from the request
        role = data.get('role')
        email = data.get('email')
        password = data.get('password')

        if not role or not email or not password:
            return jsonify({"message": "Missing required fields"}), 400

        # Hash the password before saving it
        hashed_password = hash_password(password)

        # Store user in MongoDB (replace with actual logic)
        mongo.db.users.insert_one({
            "role": role,
            "email": email,
            "password": hashed_password
        })

        return jsonify({"message": "User created successfully"}), 201
    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500

from flask import Blueprint, request, jsonify
from app.models.user import User
from app import mongo, bcrypt

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        # Parse JSON data from the request body
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")
        role = data.get("role")  # Fetch role from frontend

        if not email or not password or not role:
            return jsonify({"message": "Missing email, password, or role"}), 400

        # Retrieve user from the database
        user = mongo.db.users.find_one({"email": email})
        if not user:
            return jsonify({"message": "User not found"}), 404

        # Verify password
        if not bcrypt.check_password_hash(user["password"], password):
            return jsonify({"message": "Invalid password"}), 401

        # Verify the selected role matches the database role
        if user.get("role") != role:
            return jsonify({"message": "Role mismatch. Please select the correct role."}), 403

        # Check if the user is an admin
        is_admin = user.get("role") == "Admin"

        return jsonify({"message": "Login successful", "is_admin": is_admin}), 200
    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

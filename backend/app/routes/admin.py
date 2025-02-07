from flask import Blueprint, request, jsonify
from bson import ObjectId
from app import bcrypt, mongo

admin_bp = Blueprint("admin", __name__)

# Create User
@admin_bp.route("/create-user", methods=["POST"])
def create_user():
    try:
        data = request.get_json()

        role = data.get("role")
        email = data.get("email")
        password = data.get("password")

        if not role or not email or not password:
            return jsonify({"message": "Missing required fields"}), 400

        # Check if user exists
        existing_user = mongo.db.users.find_one({"email": email})
        if existing_user:
            return jsonify({"message": "User already exists"}), 400

        # Hash password
        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

        # Insert into DB
        user_id = mongo.db.users.insert_one({
            "role": role,
            "email": email,
            "password": hashed_password
        }).inserted_id

        return jsonify({"message": "User created successfully", "id": str(user_id)}), 201
    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500

# Get All Users
@admin_bp.route("/users", methods=["GET"])
def get_users():
    try:
        users = list(mongo.db.users.find({}, {"email": 1, "role": 1}))
        for user in users:
            user["_id"] = str(user["_id"])  # Convert ObjectId to string
        return jsonify(users), 200
    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500

# Update User Password
@admin_bp.route("/update-user/<id>", methods=["PUT"])
def update_user(id):
    try:
        data = request.get_json()
        new_password = data.get("password")

        if not new_password:
            return jsonify({"message": "New password is required"}), 400

        hashed_password = bcrypt.generate_password_hash(new_password).decode("utf-8")

        result = mongo.db.users.update_one(
            {"_id": ObjectId(id)}, {"$set": {"password": hashed_password}}
        )

        if result.matched_count == 0:
            return jsonify({"message": "User not found"}), 404

        return jsonify({"message": "Password updated successfully"}), 200
    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500

# Delete User
@admin_bp.route("/delete-user/<id>", methods=["DELETE"])
def delete_user(id):
    try:
        result = mongo.db.users.delete_one({"_id": ObjectId(id)})

        if result.deleted_count == 0:
            return jsonify({"message": "User not found"}), 404

        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500

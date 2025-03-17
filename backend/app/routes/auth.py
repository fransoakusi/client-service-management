from flask import Blueprint, request, jsonify
from app import mongo, bcrypt
import jwt
import datetime
from flask import current_app as app

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

        # JWT token generation
        token = jwt.encode(
            {
                "email": email,
                "role": role,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=12),
            },
            app.config["SECRET_KEY"],
            algorithm="HS256",
        )

        # Define role-based redirects
        role_redirects = {
            "Receptionist": "/user/dashboard",
            "Director": "/user/director",
            "Social Welfare": "/user/social",
            "Finance": "/user/finance",
            "Works": "/user/works",
            "Physical Planning": "/user/physical",
            "DCE": "/user/dce",
            "Environmental Health": "/user/environment",
            "Admin": "/admin/home",
        }

        redirect_url = role_redirects.get(role, "/user/dashboard")
        redirect_url = role_redirects.get(role, "/user/director")
        return jsonify(
            {
                "message": "Login successful",
                "token": token,
                "role": role,
                "redirect_url": redirect_url,
            }
        ), 200
    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

from flask import Blueprint, request, jsonify
from app import mongo
from bson.objectid import ObjectId

referral_bp = Blueprint("referral", __name__)


# Add a new complaint
@referral_bp.route("/add_referral", methods=["POST"])
def add_referral():
    data = request.json
    if not data:
        return jsonify({"error": "Invalid data"}), 400

    referral_id = data.get("referralId")
    existing_referral = mongo.db.referral.find_one({"referralId": referral_id})

    if existing_referral:
        return jsonify({"error": "referral ID already exists"}), 400
    referral_entry = {
        "referralId": referral_id,
        "complaintId": data.get("complaintId"),
        "name": data.get("name"),
        "contact": data.get("contact"),
        "office": data.get("office"),
        "brief": data.get("brief"),
        "date": data.get("date"),
    
    }
    result = mongo.db.referral.insert_one(referral_entry)
    return jsonify({"message": "Referral added successfully", "id": str(result.inserted_id)}), 201

# Get all complaints
@referral_bp.route("/get_referral", methods=["GET"])
def get_referral():
    referrals = mongo.db.referral.find()
    referral_list = []

    for referral in referrals:
        referral_list.append({
            "_id": str(referral["_id"]),
            "referralId": referral["referralId"],
            "complaintId": referral["complaintId"],
            "name": referral["name"],
            "contact": referral["contact"],
            "office": referral["office"],
            "brief": referral["brief"],
            "date": referral["date"],
        }) 
    return jsonify(referral_list), 200

# Update a complaint
@referral_bp.route("/update_referral/<referral_id>", methods=["PUT"])
def update_referraly(referral_id):
    data = request.json
    if not data:
        return jsonify({"error": "Invalid data"}), 400
    
    try:
        result = mongo.db.referral.update_one(
            {"_id": ObjectId(referral_id)},
            {"$set": {
               "complaintId": data.get("complaintId"),
               "name": data.get("name"),
               "contact": data.get("mode"),
               "office": data.get("office"),
               "brief": data.get("brief"),
               "date": data.get("date"),
            }}
        )

        if result.modified_count == 0:
            return jsonify({"error": "No changes made or referral not found"}), 404

        return jsonify({"message": "referral updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Update failed: {str(e)}"}), 500

# Delete a complaint

@referral_bp.route("/delete_referral/<referral_id>", methods=["DELETE"])
def delete_referral(referral_id):
    try:
        result = mongo.db.referral.delete_one({"_id": ObjectId(referral_id)})

        if result.deleted_count == 0:
            return jsonify({"error": "referral not found"}), 404

        return jsonify({"message": "referral deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Deletion failed: {str(e)}"}), 500


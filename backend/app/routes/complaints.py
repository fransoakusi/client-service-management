from flask import Blueprint, request, jsonify
from app import mongo
from bson.objectid import ObjectId

complaints_bp = Blueprint("complaints", __name__)


# Add a new complaint
@complaints_bp.route("/add_complaints", methods=["POST"])
def add_complaints():
    data = request.json
    if not data:
        return jsonify({"error": "Invalid data"}), 400

    complaints_id = data.get("complaintsid")
    existing_complaints = mongo.db.complaints.find_one({"compaintsid": complaints_id})

    if existing_complaints:
        return jsonify({"error": "complaints ID already exists"}), 400
    complaints_entry = {
        "complaintsid": complaints_id,
        "name": data.get("name"),
        "age": data.get("age"),
        "mode": data.get("mode"),
        "gender": data.get("gender"),
        "disability": data.get("disability"),
        "contact": data.get("contact"),
        "status": data.get("status"),
        "actionOffice": data.get("actionOffice"),
        "brief": data.get("brief"),
         "date": data.get("date"),
        "time": data.get("time"),
    }
    result = mongo.db.complaints.insert_one(complaints_entry)
    return jsonify({"message": "Complaints added successfully", "id": str(result.inserted_id)}), 201

# Get all complaints
@complaints_bp.route("/get_complaints", methods=["GET"])
def get_complaints():
    complaints = mongo.db.complaints.find()
    complaints_list = []

    for complaint in complaints:
        complaints_list.append({
            "_id": str(complaint["_id"]),
            "complaintsid": complaint["complaintsid"],
            "name": complaint["name"],
            "age": complaint["age"],
            "mode": complaint["mode"],
            "gender": complaint["gender"],
            "disability": complaint["disability"],
            "contact": complaint["contact"],
            "status": complaint["status"],
            "actionOffice": complaint["actionOffice"],
            "brief": complaint["brief"],
             "date": complaint["date"],
            "time": complaint["time"],
        })
    return jsonify(complaints_list), 200



@complaints_bp.route("/get_complaint/<complaintsid>", methods=["GET"])
def get_complaint(complaintsid):
    complaint = mongo.db.complaints.find_one({"complaintsid": complaintsid})
    
    if not complaint:
        return jsonify({"error": "Complaint not found"}), 404

    return jsonify({
        "_id": str(complaint["_id"]),
        "complaintsid": complaint["complaintsid"],
        "name": complaint["name"],
        "contact": complaint["contact"],
        "brief": complaint["brief"]
    }), 200


# Update a complaint
@complaints_bp.route("/update_complaints/<complaintsid>", methods=["PUT"])
def update_complaints(complaintsid):
    data = request.json
    if not data:
        return jsonify({"error": "Invalid data"}), 400
    
    try:
        result = mongo.db.complaints.update_one(
            {"_id": ObjectId(complaintsid)},
            {"$set": {
               "name": data.get("name"),
               "age": data.get("age"),
               "mode": data.get("mode"),
               "gender": data.get("gender"),
               "disability": data.get("disability"),
               "contact": data.get("contact"),
               "status": data.get("status"),
               "actionOffice": data.get("actionOffice"),
               "brief": data.get("brief"),
               "date": data.get("date"),
               "time": data.get("time"),
            }}
        )

        if result.modified_count == 0:
            return jsonify({"error": "No changes made or complaints not found"}), 404

        return jsonify({"message": "Complaints updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Update failed: {str(e)}"}), 500

# Delete a complaint

@complaints_bp.route("/delete_complaints/<complaintsid>", methods=["DELETE"])
def delete_complaints(complaintsid):
    try:
        result = mongo.db.complaints.delete_one({"_id": ObjectId(complaintsid)})

        if result.deleted_count == 0:
            return jsonify({"error": "Complaints not found"}), 404

        return jsonify({"message": "Complaints deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Deletion failed: {str(e)}"}), 500


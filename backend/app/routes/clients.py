from flask import Blueprint, request, jsonify
from app import mongo
from bson.objectid import ObjectId

clients_bp = Blueprint("clients", __name__)

# Add a visitor with a unique visitId
@clients_bp.route("/add_visitor", methods=["POST"])
def add_visitor():
    data = request.json
    if not data:
        return jsonify({"error": "Invalid data"}), 400

    visit_id = data.get("visitId")
    existing_visitor = mongo.db.clients.find_one({"visitId": visit_id})

    if existing_visitor:
        return jsonify({"error": "Visit ID already exists"}), 400

    visitor_entry = {
        "visitId": visit_id,
        "name": data.get("name"),
        "contact": data.get("contact"),
        "location": data.get("location"),
        "gender": data.get("gender"),
        "officeDirected": data.get("officeDirected"),
        "purpose": data.get("purpose"),
        "date": data.get("date"),
        "timeIn": data.get("timeIn"),
        "timeOut": data.get("timeOut"),
    }

    result = mongo.db.clients.insert_one(visitor_entry)
    return jsonify({"message": "Visitor added successfully", "id": str(result.inserted_id)}), 201


# Fetch all saved visitors
@clients_bp.route("/get_visitors", methods=["GET"])
def get_visitors():
    visitors = mongo.db.clients.find()
    visitors_list = []

    for visitor in visitors:
        visitors_list.append({
            "_id": str(visitor["_id"]),
            "visitId": visitor["visitId"],
            "name": visitor["name"],
            "contact": visitor["contact"],
            "location": visitor["location"],
            "gender": visitor["gender"],
            "officeDirected": visitor["officeDirected"],
            "purpose": visitor["purpose"],
             "date": visitor["date"],
            "timeIn": visitor["timeIn"],
            "timeOut": visitor["timeOut"],
        })

    return jsonify(visitors_list), 200


# Update visitor data
@clients_bp.route("/update_visitor/<visitor_id>", methods=["PUT"])
def update_visitor(visitor_id):
    data = request.json
    if not data:
        return jsonify({"error": "Invalid data"}), 400

    try:
        result = mongo.db.clients.update_one(
            {"_id": ObjectId(visitor_id)},
            {"$set": {
                "name": data.get("name"),
                "contact": data.get("contact"),
                "location": data.get("location"),
                "gender": data.get("gender"),
                "officeDirected": data.get("officeDirected"),
                "purpose": data.get("purpose"),
                "date": data.get("date"),
                "timeIn": data.get("timeIn"),
                "timeOut": data.get("timeOut"),
            }}
        )

        if result.modified_count == 0:
            return jsonify({"error": "No changes made or visitor not found"}), 404

        return jsonify({"message": "Visitor updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Update failed: {str(e)}"}), 500

# delete visitor data
@clients_bp.route("/delete_visitor/<visitor_id>", methods=["DELETE"])
def delete_visitor(visitor_id):
    try:
        result = mongo.db.clients.delete_one({"_id": ObjectId(visitor_id)})

        if result.deleted_count == 0:
            return jsonify({"error": "Visitor not found"}), 404

        return jsonify({"message": "Visitor deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Deletion failed: {str(e)}"}), 500
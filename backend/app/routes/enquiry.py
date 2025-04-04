from flask import Blueprint, request, jsonify
from app import mongo
from bson.objectid import ObjectId

enquiry_bp = Blueprint("enquiry", __name__)


# Add a new complaint
@enquiry_bp.route("/add_enquiry", methods=["POST"])
def add_enquiry():
    data = request.json
    if not data:
        return jsonify({"error": "Invalid data"}), 400

    enquiry_id = data.get("enquiryId")
    existing_enquiry = mongo.db.enquiry.find_one({"enquiryId": enquiry_id})

    if existing_enquiry:
        return jsonify({"error": "enquiry ID already exists"}), 400
    enquiry_entry = {
        "enquiryId": enquiry_id,
        "name": data.get("name"),
        "age": data.get("age"),
        "mode": data.get("mode"),
        "gender": data.get("gender"),
        "disability": data.get("disability"),
        "contact": data.get("contact"),
        "status": data.get("status"),
        "brief": data.get("brief"),
        "date": data.get("date"),
       
    }
    result = mongo.db.enquiry.insert_one(enquiry_entry)
    return jsonify({"message": "Enquiry added successfully", "id": str(result.inserted_id)}), 201

# Get all complaints
@enquiry_bp.route("/get_enquiry", methods=["GET"])
def get_enquiry():
    enquirys = mongo.db.enquiry.find()
    enquiry_list = []

    for enquiry in enquirys:
        enquiry_list.append({
            "_id": str(enquiry["_id"]),
            "enquiryId": enquiry["enquiryId"],
            "name": enquiry["name"],
            "age": enquiry["age"],
            "mode": enquiry["mode"],
            "gender": enquiry["gender"],
            "disability": enquiry["disability"],
            "contact": enquiry["contact"],
            "status": enquiry["status"],
            "brief": enquiry["brief"],
            "date": enquiry["date"],
        })
    return jsonify(enquiry_list), 200

# Update a complaint
@enquiry_bp.route("/update_enquiry/<enquiry_id>", methods=["PUT"])
def update_enquiry(enquiry_id):
    data = request.json
    if not data:
        return jsonify({"error": "Invalid data"}), 400
    
    try:
        result = mongo.db.enquiry.update_one(
            {"_id": ObjectId(enquiry_id)},
            {"$set": {
               "name": data.get("name"),
               "age": data.get("age"),
               "mode": data.get("mode"),
               "gender": data.get("gender"),
               "disability": data.get("disability"),
               "contact": data.get("contact"),
               "status": data.get("status"),
               "brief": data.get("brief"),
               "date": data.get("date"),
              
            }}
        )

        if result.modified_count == 0:
            return jsonify({"error": "No changes made or enqquiry not found"}), 404

        return jsonify({"message": "enquiry updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Update failed: {str(e)}"}), 500

# Delete a complaint

@enquiry_bp.route("/delete_enquiry/<enquiry_id>", methods=["DELETE"])
def delete_enquiry(enquiry_id):
    try:
        result = mongo.db.enquiry.delete_one({"_id": ObjectId(enquiry_id)})

        if result.deleted_count == 0:
            return jsonify({"error": "enquiry not found"}), 404

        return jsonify({"message": "enquiry deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Deletion failed: {str(e)}"}), 500


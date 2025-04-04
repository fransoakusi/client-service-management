from flask import Blueprint, request, jsonify
from app import mongo
from bson.objectid import ObjectId

response_bp = Blueprint("response", __name__)


# Add a new complaint
@response_bp.route("/add_response", methods=["POST"])
def add_response():
    data = request.json
    if not data:
        return jsonify({"error": "Invalid data"}), 400

    response_id = data.get("responseId")
    existing_response = mongo.db.response.find_one({"responseId": response_id})

    if existing_response:
        return jsonify({"error": "response ID already exists"}), 400
    response_entry = {
        "responseId": response_id,
        "enquiryId": data.get("enquiryId"),
        "clientcontact": data.get("clientcontact"),
        "sender": data.get("sender"),
        "clientname": data.get("clientname"),
        "response": data.get("response"),
    
    }
    result = mongo.db.response.insert_one(response_entry)
    return jsonify({"message": "Enquiry Response added successfully", "id": str(result.inserted_id)}), 201

# Get all complaints
@response_bp.route("/get_response", methods=["GET"])
def get_response():
    responses = mongo.db.response.find()
    response_list = []

    for response in responses:
        response_list.append({
            "_id": str(response["_id"]),
            "responseId": response["responseId"],
            "enquiryId": response["enquiryId"],
            "clientcontact": response["clientcontact"],
            "sener": response["sender"],
            "clientname": response["clientnam"],
            "response": response["response"]
        })
    return jsonify(response_list), 200

# Update a complaint
# Update a complaint
@response_bp.route("/update_enquiry/<enquiryId>", methods=["PUT"])
def update_enquiry(enquiryId):
    data = request.json
    if not data:
        return jsonify({"error": "Invalid data"}), 400
    
    try:
        result = mongo.db.enquiry.update_one(
            {"_id": ObjectId(enquiryId)},
            {"$set": {
               "name": data.get("name"),
               "age": data.get("age"),
               "mode": data.get("mode"),
               "gender": data.get("gender"),
               "disability": data.get("disability"),
               "contact": data.get("contact"),
               "status": data.get("status"),
               "brief": data.get("brief"),
              
            }}
        )

        if result.modified_count == 0:
            return jsonify({"error": "No changes made or enqquiry not found"}), 404

        return jsonify({"message": "enquiry updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Update failed: {str(e)}"}), 500

# Delete a complaint

@response_bp.route("/delete_response/<response_id>", methods=["DELETE"])
def delete_response(response_id):
    try:
        result = mongo.db.response.delete_one({"_id": ObjectId(response_id)})

        if result.deleted_count == 0:
            return jsonify({"error": "response not found"}), 404

        return jsonify({"message": "response deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Deletion failed: {str(e)}"}), 500


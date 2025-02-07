from flask import Blueprint, request, jsonify # type: ignore
from backend.app.routes import mongo

clients_bp = Blueprint('clients', __name__)

@clients_bp.route('/', methods=['GET'])
def get_clients():
    clients = list(mongo.db.clients.find())
    for client in clients:
        client['_id'] = str(client['_id'])  # Convert ObjectId to string
    return jsonify(clients)

@clients_bp.route('/', methods=['POST'])
def add_client():
    data = request.json
    mongo.db.clients.insert_one(data)
    return jsonify({"message": "Client added successfully"}), 201

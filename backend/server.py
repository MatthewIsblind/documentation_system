from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS  # Import CORS from flask_cors

app = Flask(__name__)
CORS(app) 
app.config["MONGO_URI"] = "mongodb://localhost:27017/testing"
mongo = PyMongo(app)


# Endpoint for creating a new patient record
@app.route('/api/patients', methods=['POST'])
def create_patient():
    data = request.json  # Get the JSON data from the request

    # Insert the patient data into the MongoDB collection
    patient_id = mongo.db.patients.insert_one(data).inserted_id

    return jsonify({"message": "Patient created successfully", "patient_id": str(patient_id)})


if __name__ == '__main__':
    app.run(debug=True)

# venv\Scripts\activate to activate the server

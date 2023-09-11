from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS  # Import CORS from flask_cors

# venv\Scripts\activate to activate the server 
# python  server.py to run it


app = Flask(__name__)
CORS(app) 
app.config["MONGO_URI"] = "mongodb://localhost:27017/testing"
mongo = PyMongo(app)


# Endpoint for creating a new patient record
@app.route('/api/generate_patients', methods=['POST'])
def create_patient():
    data = request.json  # Get the JSON data from the request

    # Insert the patient data into the MongoDB collection
    patient_id = mongo.db.patients.insert_one(data).inserted_id

    # Extract firstName and lastName from the data
    firstName = data.get('firstName', '')
    lastName = data.get('lastName', '')

    # Combine firstName and lastName to create the name field
    name = firstName + ' ' + lastName


     # Initialize the patientInfo object
    patientInfo = {
        'name': name,
        'patientTaskList': {}
    }

    # Insert the patientInfo into the "tasklist" collection within the same database
    tasklist_id = mongo.db.tasklist.insert_one(patientInfo).inserted_id

    return jsonify({
        "message": "Patient and patientInfo created successfully",
        "patient_id": str(patient_id),
        "tasklist_id": str(tasklist_id)
    })


    


@app.route('/api/get_patients', methods=['GET'])
def get_patients():
    # Fetch all patient records from the "patient" collection
    patients = list(mongo.db.patients.find({}, {"_id": 0}))  # Exclude "_id" field from the response
    
    return jsonify({"data": patients})

if __name__ == '__main__':
    app.run(debug=True)



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
    firstName = data.get('patientFirstName', '')
    lastName = data.get('patientLastName', '')

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
    print("get Patient")
    return jsonify({"data": patients})


@app.route('/api/add_task', methods=['POST'])
def add_patient_task():
    print("add tasks")
    try:
        data = request.json  # Get the JSON data from the request
        
        # Extract the necessary data from the request body
        patient_name = data.get('patientName', '')
        task_date = data.get('taskDate', '')
        task_data = data.get('taskData', {})
        # Find the patient by name
        patient = mongo.db.tasklist.find_one({'name': patient_name})


        if patient:
            print("data")
            print(data)
            print("patient")
            print(patient)
            patientTaskList = patient['patientTaskList']
            if task_date not in patientTaskList:
                patientTaskList[task_date] = []  # Initialize the list if it doesn't exist
                print("made array")
            task_data['id'] = len(patientTaskList[task_date]) + 1
            patientTaskList[task_date].append(task_data)  # Append the new task_data to the list
            print(patient)

            # Update the patient's task list in the "tasklist" collection
            mongo.db.tasklist.update_one(
                {'name': patient_name},
                {'$set': {'patientTaskList': patientTaskList}}
            )

            return jsonify({'message': 'Task added successfully'})

        else:
            return jsonify({'error': 'Patient not found'})

    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/api/get_tasks', methods=['GET'])
def get_task_list():
    try:
        date = request.args.get('date')
        print(date)
        first_name = request.args.get('firstName')
        last_name = request.args.get('lastName')
        full_name = f"{first_name} {last_name}"

        # Find the patient by name
        patient = mongo.db.tasklist.find_one({'name': full_name})
        print(patient)
        if patient:
            patient_task_list = patient.get('patientTaskList', {})
            tasks_for_date = patient_task_list.get(date, [])

            return jsonify({"tasks": tasks_for_date}), 200
        else:
            return jsonify({"error": "Patient not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/delete_task', methods=['POST'])
def delete_task():
    print("delete")
    try:
        data = request.get_json()
        patient_name = data.get('patientName')
        task_date = data.get('taskDate')
        task_id = data.get('taskID')

        # Get the tasklist collection from MongoDB
        tasklist = mongo.db.tasklist

        # Find the document with the matching patient name and task date
        result = tasklist.find_one({'name': patient_name, 'patientTaskList.' + task_date: {'$exists': True}})

        if result:
            # Extract the tasks for the specific date
            tasks = result['patientTaskList'][task_date]

            # Find the task with the matching ID and remove it
            updated_tasks = [task for task in tasks if task['id'] != task_id]

            # Update the document in MongoDB with the new task list
            tasklist.update_one(
                {'name': patient_name},
                {'$set': {'patientTaskList.' + task_date: updated_tasks}}
            )

            return jsonify({'message': 'Task deleted successfully'}), 200

        return jsonify({'message': 'Task not found'}), 404
        

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    


if __name__ == '__main__':
    app.run(debug=True)



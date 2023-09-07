import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns'; // Import the format function
import TimePicker from 'react-time-picker';


interface Props {
    firstName: String;
    lastName : String;
    selectedDate : String;
    onClose: () => void; // Define the onClose prop as a function
}


// Separate component for adding a new task
const AddTaskButton: React.FC<Props> = ({ firstName,lastName,selectedDate  ,onClose}) => {
    const handleClose = () => {
        onClose(); // Call the onClose function passed from component A
    };

    
    
    const [selectedHour, setSelectedHour] = useState("");
    const [selectedMinute, setSelectedMinute] = useState("");
    const [selectedPeriod, setSelectedPeriod] = useState("AM");



  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            Add Task for {firstName} {lastName} on {selectedDate}
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Task Name
          </label>
          <input
            type="text"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Enter task name"
          />
        </div>
        <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Time</label>
        <div className="flex items-center">
            <input
            type="text"
            placeholder="HH"
            value={selectedHour}
            onChange={(e) => setSelectedHour(e.target.value)}
            className="w-12 p-2 border border-gray-300 rounded-md mr-2"
            />
            <span className="text-xl">:</span>
            <input
            type="text"
            placeholder="MM"
            value={selectedMinute}
            onChange={(e) => setSelectedMinute(e.target.value)}
            className="w-12 p-2 border border-gray-300 rounded-md ml-2"
            />
            <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="p-2 border border-gray-300 rounded-md ml-2"
            >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
            </select>
        </div>
        </div>

        <div className="flex justify-end">
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};





export default AddTaskButton;
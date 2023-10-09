import React, { useState,useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format ,parse} from 'date-fns'; // Import the format function
import TimePicker from 'react-time-picker';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';


interface Props {
    firstName: String;
    lastName : String;
    selectedDate : string;
    taskListSize: Number;
    onClose: () => void; // Define the onClose prop as a function
    updateTasksToShow: (date: Date) => void;
}


interface FormData {
    firstName: String;
    lastName :String;
    hour : String;
    minute : String;
    task : String;
    date: String;
    
}


const defaultFormData: FormData = {
    firstName: '',
    lastName :'',
    hour : '',  
    minute : '',
    task : '',
    date:'',
    
};


interface Task {
    id: Number;
    time: string;
    task: string;
    completed: boolean;
}

interface PresetTask {
    task_id: Number;
    task_name: string;
}

// Separate component for adding a new task
const AddTaskButton: React.FC<Props> = ({ firstName,lastName,selectedDate ,taskListSize ,onClose,updateTasksToShow}) => {
    const handleClose = () => {
        onClose(); // Call the onClose function passed from component A
        const parsedDate = parse(selectedDate, 'dd/MM/yyyy', new Date());
        updateTasksToShow(parsedDate);
    };

    const [taskOptions, setTaskOptions] = useState<PresetTask[]>([]);
    useEffect(() => {
        // Function to fetch task options from the API
        const fetchTaskOptions = async () => {
          try {
            // Make a GET request to your backend API to fetch task options
            const response = await axios.get('http://localhost:5000/api/get_task_options');
            
            if (response.status === 200) {
              // Task options fetched successfully
              console.log(response.data[0].Tasks); 
              
              const sortedTasks = response.data[0].Tasks.sort((a: { task_name: string }, b: { task_name: string }) => {
                // Use localeCompare for string comparison
                return a.task_name.localeCompare(b.task_name);
              });

              setTaskOptions(sortedTasks); // Set the task options in state
              
            } else {
              console.error('Error fetching task options:', response.data);
            }
          } catch (error) {
            console.error('Error fetching task options:', error);
          }
        };
    
        // Call the fetchTaskOptions function when the component loads
        fetchTaskOptions();
        
      }, []); // Empty dependency array ensures the effect runs only once 
      



    
    
    const [selectedHour, setSelectedHour] = useState("");
    const [selectedMinute, setSelectedMinute] = useState("");
    
    const form = useForm<FormData>({defaultValues: defaultFormData, });
    const { register, handleSubmit,control ,  formState: { errors } } = form;
    

    const onSubmit = async(data: FormData) => {
      // Handle form submission here
        data.firstName = firstName;
        data.lastName = lastName;
        data.date = selectedDate;
        const formattedTime = `${data.hour}:${data.minute}`; // Combine hour, minute
        console.log(data);

          // Create a new task object
        const newTask = {
            id: taskListSize.valueOf() + 1, 
            time: formattedTime,
            task: data.task,
            completed: false, 
        };


        const requestBody = {
            patientName: `${firstName} ${lastName}`, // Combine first and last name
            taskDate :selectedDate,
            taskData: newTask,
        };

        try {
            // Make a POST request to your backend API
            const response = await axios.post('http://localhost:5000/api/add_task', requestBody);
            
            if (response.status === 200) {
              // Task added successfully on the server
              // You can update your client-side task list if needed
              handleClose();
            } else {
              // Handle errors, e.g., display an error message to the user
              console.error('Error adding task:', response.data);
              window.alert('An error occurred while adding the task. Please try again later.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            window.alert('An error occurred while submitting the form. Please try again later.');
            // Handle any errors that occur during the request
        }
        

    };
    
    const [filterText, setFilterText] = useState("");
    const handleFilterChange = (text :string) => {
        setFilterText(text);
    };
      
    

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
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className=" py-1">
                    {/* Dropdown menu for task selection */}
                    <div className="relative py-2">
                <input
                    type="text"
                    placeholder="Filter tasks..."
                    className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(e) => handleFilterChange(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    >
                    <path
                        fillRule="evenodd"
                        d="M11.293 11.293a1 1 0 011.414 0l5 5a1 1 0 11-1.414 1.414l-5-5a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                    <path
                        fillRule="evenodd"
                        d="M4.5 10a5.5 5.5 0 1111 0 5.5 5.5 0 01-11 0z"
                        clipRule="evenodd"
                    />
                    </svg>
                </div>
                </div>

                    <select {...register("task", { required: 'Please select a task' })} className=" block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                        <option value="">Select a task</option>
                        {taskOptions
                            .filter((option) =>
                            option.task_name.toLowerCase().includes(filterText.toLowerCase())
                            )
                            .map((taskOption) => (
                            <option key={taskOption.task_name} value={taskOption.task_name}>
                                {taskOption.task_name}
                            </option>
                        ))}
                    </select>
                    {errors.task && (
                        <span className="text-red-500">{errors.task.message}</span>
                    )}
                </div>


                  <div className="mb-4 ">
                      <label className="block text-sm font-medium text-gray-700 py-2">Time (24 hour)</label>
                      <div className="flex items-center">
                        <div className="mt-2 py-3">
                            <input type="text" {...register("hour",{ required: 'Please fill in the hour' })} id="roomNumber" autoComplete="roomNumber" className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            {errors.hour && (
                                <span className="text-red-500">{errors.hour.message}</span>
                            )}
                        </div>
                          <span className="text-xl"> : </span>
                        <div className="mt-2 py-3">
                          <input type="minute" {...register("minute",{ required: 'Please fill in the minute' })} id="roomNumber" autoComplete="roomNumber" className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                          {errors.minute && (
                              <span className="text-red-500">{errors.minute.message}</span>
                          )}
                        </div>
                      </div>
                  </div>


                  <div className="flex justify-end">
                      <button
                          type="submit"
                          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                      >
                          Add
                      </button>
                  </div>
              </form>
          </div>
          
      </div>
  );
};


export default AddTaskButton;
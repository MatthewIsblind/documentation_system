import React, { useState,useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns'; // Import the format function
import AddTaskButton from './AddTaskutton';
import axios from 'axios'; // Import axios at the beginning of your file


interface Task {
    id: number;
    time: string;
    task: string;
    completed: boolean;
}

interface PatientInfo {
    name: string;
    patientTaskList: { [key: string]: Task[] };
}


interface getRequest {

    fullname: string 
    date:string
}

export default function CheckList() {

    //pop up stuff
    const [modal,setModal] = useState(false);

    const toggleModal = () => {
        setModal(!modal)
    }


    // Function to close the modal
    const closeModal = () => {
        setModal(false);
    };
  
    const sortTasksByTime = (tasks: Task[]) => {
      
        return tasks.slice().sort((a, b) => {
            // Convert time strings to Date objects for comparison
            const timeA : Date = new Date(`01/01/2000 ${a.time}`);
            const timeB : Date = new Date(`01/01/2000 ${b.time}`);
            return timeA.getTime() - timeB.getTime();
        });
    };
    


        
    const location = useLocation();
    const { firstName, lastName } = location.state as { firstName: string; lastName: string };
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const [tasksToShow, setTasksToShow] = useState<Task[]>([]); // State for tasksToShow

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
        updateTasksToShow(date);
    };



    // Format the selected date to match the date keys in your task list
    const selectedDateFormat = format(selectedDate, 'dd/MM/yyyy') as string;

    const updateTasksToShow = async (date: Date) => {
        const formattedDate = format(date, 'dd/MM/yyyy');
        
        try {
            axios.get(`http://localhost:5000/api/get_tasks?date=${formattedDate}&firstName=${firstName}&lastName=${lastName}`)
            .then((response) => {
                // Handle the response data here
                

                if (response.data.length === 0 ){
                    console.log("there is nothing")
                    setTasksToShow([]);
                } else {
                    const sortedTasks = sortTasksByTime(response.data.tasks)
                    setTasksToShow(sortedTasks);
                }
                
            })
            .catch((error) => {
                console.error('Error getting data:', error);
                window.alert('An error occurred getting the data. Please try again later.');
            });
        } catch (error) {
            console.error('Error sending GET request:', error);
            window.alert('An error occurred while sending the GET request. Please try again later.');
        }
        

    };
    

    const [dataLoaded, setDataLoaded] = useState(false); // Add this state variable

    useEffect(() => {
        // Call handleDateChange when the component mounts or when the page is refreshed
        updateTasksToShow(selectedDate)
            .then(() => {
                setTimeout(() => {
                    setDataLoaded(true); // Set dataLoaded to true after a short delay
                }, 300); // You can adjust the delay time as needed
            })
            .catch((error) => {
                console.error('Error loading data:', error);
                window.alert('An error occurred while loading the data. Please try again later.');
                setDataLoaded(true); // Ensure that dataLoaded is set to true even in case of an error
            });
    }, [selectedDate]); // Include selectedDate in the dependency array

    // Use conditional rendering to display the page content only when data is loaded
    if (!dataLoaded) {
        return <div>Loading...</div>; // You can replace this with a loading spinner or message
    }
    



        const handleTaskToggle = (taskId: number) => {
            
            const updatedTasks = tasksToShow.map((task) => {
                if (task.id === taskId) {
                    return { ...task, completed: !task.completed };
                }
                return task;
            });
            updateTaskOnServer(taskId);
            setTasksToShow(updatedTasks);
        };

        const updateTaskOnServer = async (taskId: number) => {
            try {
                const requestBody = {
                    taskId :taskId,
                    patientName: `${firstName} ${lastName}`,
                    taskDate :selectedDateFormat,

                } 

                const response = await axios.post('http://localhost:5000/api/update_task', requestBody)
                ;
                if (response.status === 200) {
                    // Task updated successfully on the server
                    console.log('Task updated:', response.data);
                    
                    setTasksToShow(response.data.updatedTasks)
                } else {
                    // Handle errors, e.g., display an error message to the user
                    console.error('Error updating task:', response.data);
                    window.alert('An error occurred while updating the task. Please try again later.');
                }
            } catch (error) {
                console.error('Error updating task:', error);
                window.alert('An error occurred while updating the task. Please try again later.');
                // Handle any errors that occur during the request
            }
        };
        

        const handleEdit = (taskId: number) => {
            
        }

        const handleDelete = async(selectedDateFormat:string, id:number) => {
            const requestBody = {
                patientName: `${firstName} ${lastName}`,
                taskDate :selectedDateFormat,
                taskID : id,
            } 

            try {
                const response = await axios.post('http://localhost:5000/api/delete_task', requestBody);
                if (response.status === 200) {
                    // Task added successfully on the server
                    // You can update your client-side task list if needed
                    console.error('task deleted:', response.data);
                    updateTasksToShow(selectedDate)
                } else {
                    // Handle errors, e.g., display an error message to the user
                    console.error('Error deleting task:', response.data);
                    window.alert('An error occurred while deleting the task. Please try again later.');
                }
            } catch (error) {
                console.error('Error deleting', error);
                window.alert('An error occurred while deleting the task. Please try again later.');
                // Handle any errors that occur during the request
            }


        }


    if (tasksToShow.length === 0 && dataLoaded) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-2">
                    Patient: {firstName} {lastName}
                    
                </h1>
                <h1 className="text-3xl font-bold mb-4">
                    No tasks found for {selectedDateFormat}
                </h1>
                <div className="mb-4">
                    <label className="text-xl font-bold mb-4"> Search by Date </label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="dd/MM/yyyy"
                        className="border border-gray-300 p-2 rounded-md w-full"
                    />
                </div>

                <div>
                    <button
                    className="bg-white border-black border px-10 py-2 rounded"
                    onClick={toggleModal}
                    >
                    + Press here to add task
                    </button>
                    {modal && (
                    <AddTaskButton
                        firstName={firstName}
                        lastName={lastName}
                        selectedDate  = {selectedDateFormat}
                        taskListSize={tasksToShow.length + 1} 
                        onClose={closeModal} // Pass the onClose function to component B
                        updateTasksToShow={updateTasksToShow}
                    />
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-2">
                Patient: {firstName} {lastName}

            </h1>
            <h2 className="text-3xl font-bold mb-4">
                Checklist for {firstName} {lastName}
            </h2>
            
            <div className="mb-4">
                <label className="text-xl font-bold mb-4"> Search by Date </label>
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    className="border border-gray-300 p-2 rounded-md w-full"
                />
            </div>

            <div>
                <button
                className="bg-white border-black border px-10 py-2 rounded"
                onClick={toggleModal}
                >
                + Press here to add task
                </button>
                {modal && (
                <AddTaskButton
                    firstName={firstName}
                    lastName={lastName}
                    selectedDate  = {selectedDateFormat}
                    taskListSize={tasksToShow.length} 
                    onClose={closeModal} // Pass the onClose function to component B
                    updateTasksToShow={updateTasksToShow}
                />
                )}
            </div>
            
            <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
            <thead>
                <tr>
                    <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0 w-3/6"
                    >
                        Task Name
                    </th>
                    <th
                        scope="col"
                        className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900sm:pl-0  w-1/6"
                    >
                        Time
                    </th>
                    <th
                        scope="col"
                        className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900sm:pl-0  w-1/6"
                    >
                        Status
                    </th>
                    <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900 w-1/6">
                        Actions
                    </th>

                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
                {tasksToShow.length > 0 && tasksToShow.map((task) => (
                    <tr key={task.id}>
                        <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0 w-3/6">
                            <div className="font-medium text-gray-900 px-5">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={task.completed}
                                    onChange={() => handleTaskToggle(task.id)}
                                />
                                <span className="truncate">{task.completed ? <del>{task.task}</del> : task.task}</span>
                            </div>
                        </td>
                        <td className="whitespace-nowrap text-left px-3 py-5 text-sm text-gray-500 w-1/6">
                            <span className="truncate">{task.time}</span>
                        </td>
                        <td className="whitespace-nowrap  px-3 py-5 text-sm text-gray-500 w-1/6">
                            <span className="truncate">{task.completed ? "Complete" : "Not Complete"}</span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 w-1/6">
                        <button
                            onClick={() => handleEdit(task.id)} // Replace with your edit function
                            className="text-blue-600 hover:text-blue-800 mr-2"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(selectedDateFormat, task.id)} // Replace with your delete function
                            className="text-red-600 hover:text-red-800"
                        >
                            Delete
                        </button>
                    </td>
                    </tr>
                ))}
            </tbody>
            </table>
            </div>
            </div>
            </div>

        </div>
    );
}


import React, { useState } from 'react';
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
    
    

    // Check if the selected date exists in the patientTaskList of patientInfo
    if (tasksToShow.length !== 0) {

        const handleTaskToggle = (taskId: number) => {
            const updatedTasks = tasksToShow.map((task) => {
                if (task.id === taskId) {
                    return { ...task, completed: !task.completed };
                }
                return task;
            });
            setTasksToShow(updatedTasks);
        };


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
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                        >
                            Task Name
                        </th>
                        <th
                            scope="col"
                            className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                        >
                            Time
                        </th>
                        <th
                            scope="col"
                            className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                        >
                            Status
                        </th>
                        </tr>
                    </thead>
                    
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {tasksToShow.length > 0 &&  tasksToShow.map((task) => (
                        <tr key={task.id}>
                            <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                            <div className="font-medium text-gray-900 px-5">
                                <input
                                type="checkbox"
                                className="mr-2"
                                checked={task.completed}
                                onChange={() => handleTaskToggle(task.id)}
                                />
                                {task.completed ? (
                                <del>{task.task}</del>
                                ) : (
                                task.task
                                )}
                            </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                            {task.time}
                            </td>
                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                            {task.completed ? "Complete" : "Not Complete"}
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
    } else {
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
                    />
                    )}
                </div>
            </div>
        );
    }

    
}


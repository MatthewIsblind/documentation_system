import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns'; // Import the format function


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


export default function CheckList() {

    const patientTaskList: { [key: string]: Task[] } = {
        "01/08/2023": [
            { id: 1, time: '09:00 AM', task: 'Administer Medication', completed: true },
            { id: 2, time: '10:30 AM', task: 'Assist with Bathing', completed: false },
            { id: 3, time: '12:00 PM', task: 'Prepare Meals', completed: false },
        ],
        "02/08/2023": [
            // Add tasks for this date if needed
        ],
        // Add more dates and tasks as needed
    };
    
    const patientInfo = {
        name: "John Doe",
        patientTaskList: patientTaskList,
    };
    
        
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const firstName = searchParams.get('firstName');
    const lastName = searchParams.get('lastName');

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [tasksToShow, setTasksToShow] = useState<Task[]>([]); // State for tasksToShow

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
        updateTasksToShow(date);
    };


    // Format the selected date to match the date keys in your task list
    const selectedDateFormat = format(selectedDate, 'dd/MM/yyyy') as string;

    const updateTasksToShow = (date: Date) => {
        const formattedDate = format(date, 'dd/MM/yyyy');
        if (patientInfo.patientTaskList.hasOwnProperty(formattedDate)) {
            setTasksToShow(patientInfo.patientTaskList[formattedDate]);
        } else {
            setTasksToShow([]);
        }
    };

    // Check if the selected date exists in the patientTaskList of patientInfo
    if (patientInfo.patientTaskList.hasOwnProperty(selectedDateFormat)) {
        
        
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
                <h1 className="text-3xl font-bold mb-4">
                    Checklist for {firstName} {lastName}
                </h1>
                <div className="mb-4">
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="dd/MM/yyyy"
                        className="border border-gray-300 p-2 rounded-md w-full"
                    />
                </div>
                <form>
                    {tasksToShow.map((task) => (
                        <div key={task.id} className="flex mb-4 items-center text-lg">
                            <div className="flex items-center h-5">
                                <input
                                    id={`task-${task.id}`}
                                    type="checkbox"
                                    className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    checked={task.completed}
                                    onChange={() => handleTaskToggle(task.id)} // Toggle task when checkbox is changed
                                />
                            </div>
                            <div className="flex flex-col ml-4">
                                <p className="text-xl font-normal text-gray-500 dark:text-gray-300">
                                    {task.time}
                                </p>
                                <label
                                    htmlFor={`task-${task.id}`}
                                    className={`font-medium ${
                                        task.completed ? 'line-through' : ''
                                    } text-gray-900 dark:text-gray-300 text-xl`}
                                >
                                    {task.task}
                                </label>
                            </div>
                        </div>
                    ))}
                </form>
            </div>
        );
    } else {
        // The selected date doesn't exist in patientTaskList, handle this case
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4">
                    No tasks found for {selectedDateFormat}
                </h1>
                <div className="mb-4">
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="dd/MM/yyyy"
                        className="border border-gray-300 p-2 rounded-md w-full"
                    />
                </div>
            </div>
        );
    }

    
}



    


//     const [tasks, setTasks] = useState<Task[]>([
//         { id: 1, time: '09:00 AM', task: 'Administer Medication', date: '31/07/2023', completed: false },
//         { id: 2, time: '10:30 AM', task: 'Assist with Bathing', date: '31/07/2023', completed: false },
//         { id: 3, time: '12:00 PM', task: 'Prepare Meals', date: '01/08/2023', completed: false },
//     ]);

//     const handleTaskToggle = (taskId: number) => {
//         setTasks((prevTasks) =>
//             prevTasks.map((task) =>
//                 task.id === taskId ? { ...task, completed: !task.completed } : task
//             )
//         );

//         const updatedTask = tasks.find((task) => task.id === taskId);
//         if (updatedTask) {
//             console.log(
//                 `Task '${updatedTask.task}' is now ${
//                     updatedTask.completed ? 'not completed' : 'completed'
//                 } for ${updatedTask.time}`
//             );
//         }
//     };

//     const location = useLocation();
//     const searchParams = new URLSearchParams(location.search);
//     const firstName = searchParams.get('firstName');
//     const lastName = searchParams.get('lastName');

//     const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

//     const filteredTasks = tasks.filter((task) => {
//         const taskDate = new Date(task.date);
//         return (
//             selectedDate &&
//             taskDate.getDate() === selectedDate.getDate() &&
//             taskDate.getMonth() === selectedDate.getMonth() &&
//             taskDate.getFullYear() === selectedDate.getFullYear()
//         );
//     });

//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-3xl font-bold mb-4">
//                 Checklist for {firstName} {lastName}
//             </h1>
//             <div className="mb-4">
//                 <DatePicker
//                     selected={selectedDate}
//                     onChange={(date) => setSelectedDate(date || new Date())} // Handle null value
//                     dateFormat="dd/MM/yyyy"
//                     className="border border-gray-300 p-2 rounded-md w-full"
//                 />
//             </div>
//             <form>
//                 {filteredTasks.map((task) => (
//                     <div key={task.id} className="flex mb-4 items-center text-lg">
//                         <div className="flex items-center h-5">
//                             <input
//                                 id={`task-${task.id}`}
//                                 type="checkbox"
//                                 className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
//                                 checked={task.completed}
//                                 onChange={() => handleTaskToggle(task.id)}
//                             />
//                         </div>
//                         <div className="flex flex-col ml-4">
//                             <p className="text-xl font-normal text-gray-500 dark:text-gray-300">
//                                 {task.time}
//                             </p>
//                             <label
//                                 htmlFor={`task-${task.id}`}
//                                 className={`font-medium ${
//                                     task.completed ? 'line-through' : ''
//                                 } text-gray-900 dark:text-gray-300 text-xl`}
//                             >
//                                 {task.task}
//                             </label>
//                         </div>
//                     </div>
//                 ))}
//             </form>
//         </div>
//     );
// }

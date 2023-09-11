import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns'; // Import the format function
import AddTaskButton from './AddTaskutton';



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

    //pop up stuff
    const [modal,setModal] = useState(false);

    const toggleModal = () => {
        setModal(!modal)
    }


    // Function to close the modal
    const closeModal = () => {
        setModal(false);
    };
  

    const patientTaskList: { [key: string]: Task[] } = {
        "01/08/2023": [
            { id: 3, time: '12:00 PM', task: 'Prepare Meals', completed: false },
            { id: 1, time: '09:00 AM', task: 'Administer Medication', completed: true },
            { id: 2, time: '10:30 AM', task: 'Assist with Bathing', completed: false },
            
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


    
    const sortTasksByTime = (tasks: Task[]) => {
      
        return tasks.slice().sort((a, b) => {
            // Convert time strings to Date objects for comparison
            const timeA : Date = new Date(`01/01/2000 ${a.time}`);
            const timeB : Date = new Date(`01/01/2000 ${b.time}`);
            return timeA.getTime() - timeB.getTime();
        });
    };
    
        
    const location = useLocation();
    // const searchParams = new URLSearchParams(location.search);
    // const firstName = searchParams.get('firstName');
    // const lastName = searchParams.get('lastName');

    const { firstName, lastName } = location.state as { firstName: string; lastName: string };
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
            const sortedTasks = sortTasksByTime(patientInfo.patientTaskList[formattedDate])
            setTasksToShow(sortedTasks);
        } else {
            setTasksToShow([]);
        }
    };
    
    

    // Check if the selected date exists in the patientTaskList of patientInfo
    if (patientInfo.patientTaskList.hasOwnProperty(selectedDateFormat) && patientInfo.patientTaskList[selectedDateFormat].length !== 0) {
        
        
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
                        {tasksToShow.map((task) => (
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
        // The selected date doesn't exist in patientTaskList, handle this case
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
                        onClose={closeModal} // Pass the onClose function to component B
                    />
                    )}
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

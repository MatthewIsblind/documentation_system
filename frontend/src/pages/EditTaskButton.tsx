// EditTaskButton.tsx
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format,parse } from 'date-fns';
import { useForm,Controller } from 'react-hook-form';
import axios from 'axios';

interface Props {
    task:string;
    firstName: String;
    lastName : String;
    selectedDate : string;
    time :string
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


const EditTaskButton: React.FC<Props> = ({
        task,
        firstName,
        lastName,
        selectedDate,
        time,
        onClose,
        updateTasksToShow,
    }) => {

    const handleClose = () => {
        onClose(); 
        const parsedDate = parse(selectedDate, 'dd/MM/yyyy', new Date());
        updateTasksToShow(parsedDate);
    };

    
    const form = useForm<FormData>({defaultValues: defaultFormData, });
    const { register, handleSubmit,control ,  formState: { errors } } = form;



    const onSubmit = async (data: FormData) => {
//     const editedTask = {
//       ...task,
//       task: data.task,
//       time: data.time,
//     };

//     try {
//       // Make a POST request to update the task on the server
//       const response = await axios.post('http://localhost:5000/api/update_task', {
//         taskId: task.id,
//         patientName: task.patientName,
//         taskDate: task.taskDate,
//         taskData: editedTask,
//       });

//       if (response.status === 200) {
//         // Task updated successfully on the server
//         updateTasksToShow();
//         onClose(); // Close the editing modal
//       } else {
//         // Handle errors, e.g., display an error message to the user
//         console.error('Error updating task:', response.data);
//         window.alert('An error occurred while updating the task. Please try again later.');
//       }
//     } catch (error) {
//       console.error('Error updating task:', error);
//       window.alert('An error occurred while updating the task. Please try again later.');
//       // Handle any errors that occur during the request
//     }
    };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                    Edit Task for {firstName} {lastName} on {selectedDate}
                </h2>
                <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={handleClose}
                >
                    Close
                </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Task Name
                    </label>
                    <div className="mt-2 py-5">
                        <input type="text" {...register("task",{ required: 'Please fill in task' })} id="roomNumber" autoComplete="roomNumber" className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        {errors.task && (
                            <span className="text-red-500">{errors.task.message}</span>
                        )}
                    </div>
                </div>


                <div className="mb-4 ">
                    <label className="block text-sm font-medium text-gray-700">Time (24 hour)</label>
                    <div className="flex items-center">
                    <div className="mt-2 py-5">
                        <input type="text" {...register("hour",{ required: 'Please fill in the hour' })} id="roomNumber" autoComplete="roomNumber" className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        {errors.hour && (
                            <span className="text-red-500">{errors.hour.message}</span>
                        )}
                    </div>
                        <span className="text-xl"> : </span>
                    <div className="mt-2 py-5">
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

export default EditTaskButton;

import React, { useState } from 'react';

interface Task {
    id: number;
    time: string;
    task: string;
    completed: boolean;
}

export default function CheckList() {
    const [tasks, setTasks] = useState<Task[]>([
        { id: 1, time: '09:00 AM', task: 'Administer Medication', completed: false },
        { id: 2, time: '10:30 AM', task: 'Assist with Bathing', completed: false },
        { id: 3, time: '12:00 PM', task: 'Prepare Meals', completed: false },
    ]);

    const handleTaskToggle = (taskId: number) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            )
        );

        const updatedTask = tasks.find(task => task.id === taskId);
        if (updatedTask) {
            console.log(`Task '${updatedTask.task}' is now ${updatedTask.completed ? 'not completed' :'completed'}  for ${updatedTask.time}`);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Checklist</h1>
            <form>
                {tasks.map((task) => (
                    <div key={task.id} className="flex mb-4 items-center text-lg">
                        <div className="flex items-center h-5">
                            <input
                                id={`task-${task.id}`}
                                type="checkbox"
                                className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                checked={task.completed}
                                onChange={() => handleTaskToggle(task.id)}
                            />
                        </div>
                        <div className="flex flex-col ml-4">
                            <p className="text-xl font-normal text-gray-500 dark:text-gray-300">{task.time}</p>
                            <label
                                htmlFor={`task-${task.id}`}
                                className={`font-medium ${task.completed ? 'line-through' : ''} text-gray-900 dark:text-gray-300 text-xl`}
                            >
                                {task.task}
                            </label>
                        </div>
                    </div>
                ))}
            </form>
        </div>
    );
}

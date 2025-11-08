import React from 'react';

const TaskDetail = ({task}) => {

    const formattedDueDate = new Date(dueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <div className="min-h-screen w-full px-6 py-6 bg-slate-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">{task.title}</h1>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Task ID: {task.taskId}</span>
                        </div>
                        <div className="flex space-x-4">
                            <span
                                className={`inline-block px-2 py-1 text-xs font-semibold rounded-xs min-w-30 text-center ${
                                    task.status === 'in_progress'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : task.status === 'completed'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-300 text-gray-800'
                                }`}
                            >
                                {task.status
                                    .split('_') // in_progress will be in progress
                                    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
                                    .join(' ')} {/* Join the words back together */}
                            </span>

                            <span
                                className={`px-2 py-1 text-xs font-semibold rounded-xs ${
                                    task.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                }`}
                            >
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} {/* Capitalize the first letter of priority */}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-cente justify-between space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center text-xl space-x-1">
                            <span className="font-semibold ">Assigned To:</span>
                            <span>{task.assignedTo.fullName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <span className="font-semibold">Due Date:</span>
                            <span>{formattedDueDate}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Description</h2>
                    <p className="text-gray-700 dark:text-gray-200">{task.description}</p>
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;
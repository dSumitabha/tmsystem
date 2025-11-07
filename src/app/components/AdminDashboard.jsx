"use client"
import React, { useState, useEffect } from 'react';
import TaskRow from './TaskRow.jsx';
import { toast } from 'sonner';

export default function AdminDashboardContent() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
        try {
            const response = await fetch('/api/tasks/created', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }

            const data = await response.json();
                setTasks(data.tasks);
            } catch (err) {
                setError(err.message);
                toast.error(err.message)
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);  // call once initial render

    return (
        <div className="px-6 py-4">
            <section className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
                <div className="flex justify-between items-center py-4 px-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Tasks</h2>
                    <div className="flex items-center space-x-4">
                        <button className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-300">
                        Create Task
                        </button>
                        <div className="relative">
                            <button className="bg-gray-100 dark:bg-gray-600 dark:text-white text-gray-800 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                            Filters
                            </button>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700">
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Task ID</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Task Name</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Assigned To</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Status</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Due Date</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Priority</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-sm text-gray-600 dark:text-gray-300">
                                        Loading...
                                    </td>
                                </tr>
                            )}

                            {tasks.map(task => (
                                <TaskRow key={task._id} task={task} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
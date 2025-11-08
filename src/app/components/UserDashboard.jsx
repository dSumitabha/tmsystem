"use client"
import React, { useState, useEffect } from 'react';
import UserTaskRow from './UserTaskRow.jsx';
import Link from 'next/link';
import { toast } from 'sonner';

export default function UserDashboard(){
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc'); 

    useEffect(() => {
        const fetchTasks = async () => {
        try {
            setLoading(true);
            let url = '/api/tasks/assigned';

            const response = await fetch(url, {
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

    // Automatically filter tasks whenever status or priority changes
    useEffect(() => {
        let filtered = tasks;

        // Apply status filter if it exists
        if (statusFilter) {
            filtered = filtered.filter(task => task.status === statusFilter);
        }

        // Apply priority filter if it exists
        if (priorityFilter) {
            filtered = filtered.filter(task => task.priority === priorityFilter);
        }

        filtered = filtered.sort((a, b) => {
            if (!a.dueDate) return 1; // Put tasks without due date at the end
            if (!b.dueDate) return -1; // Put tasks without due date at the end
        
            const dateA = new Date(a.dueDate);
            const dateB = new Date(b.dueDate);
        
            // Sorting ascending or descending based on `sortOrder`
            return sortOrder === 'asc'
                ? dateA - dateB
                : dateB - dateA; // descending order
        });

        // Update the filteredTasks state
        setFilteredTasks(filtered);
    }, [statusFilter, priorityFilter, tasks, sortOrder]);

    return (
        <div className="px-6 py-4">
            <section className="bg-white dark:bg-gray-800 shadow-sm rounded-xs">
                <div className="flex justify-between items-center py-4 px-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Tasks</h2>
                    <div className="flex items-center space-x-4 ">
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="bg-gray-100 dark:bg-gray-600 dark:text-white text-gray-800 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="">Select Priority</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-gray-100 dark:bg-gray-600 dark:text-white text-gray-800 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="">Select Status</option>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="bg-gray-100 dark:bg-gray-600 dark:text-white text-gray-800 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="">Sort by Due Date</option>
                            <option value="desc">Due Soon</option>
                            <option value="asc">Due Later</option>
                        </select>
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
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-sm text-gray-600 dark:text-gray-300">
                                        Loading...
                                    </td>
                                </tr>
                            ) : tasks.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-sm text-gray-600 dark:text-gray-300">
                                        No tasks found assigned to you.
                                    </td>
                                </tr>
                            ) : filteredTasks.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-sm text-gray-600 dark:text-gray-300">
                                        No tasks found with the selected filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredTasks.map(task => (
                                    <UserTaskRow key={task._id} task={task} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
"use client"
import React, { useState, useEffect } from 'react';
import TaskRow from './TaskRow.jsx';
import { toast } from 'sonner';
import Link from 'next/link';
import AssignUser from "./AssignUser.jsx"; 

export default function AdminDashboardContent() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [assignedUserFilter, setAssignedUserFilter] = useState(null);  // Assigned user filter

    useEffect(() => {
        const fetchTasks = async () => {
        try {
            setLoading(true);
            let url = '/api/tasks/created';

            if (priorityFilter) {
                url += `?priority=${priorityFilter}`; //priority param with url
            }

            if (statusFilter) {
                url += `?status=${statusFilter}`;   //status param with url
            }

            if (assignedUserFilter) {
                url += `?assignedTo=${assignedUserFilter._id}`;  // assign to param with url
            }

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
    }, [statusFilter, priorityFilter, assignedUserFilter]);  // call once initial render

    return (
        <div className="px-6 py-4">
            <section className="bg-white dark:bg-gray-800 shadow-sm rounded-xs">
                <div className="flex justify-between items-center py-4 px-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Tasks</h2>
                    <div className="flex items-center space-x-4 ">
                        <Link href="/tasks/new" passHref>
                            <button className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-300">
                                Create Task
                            </button>
                        </Link>
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
                        <AssignUser
                            selectedUserId={assignedUserFilter ? assignedUserFilter._id : null}
                            onSelectUser={(user) => setAssignedUserFilter(user)}  // Update the assigned user filter
                        />
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
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Action</th>
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
                                        No tasks found with the selected filters.
                                    </td>
                                </tr>
                            ) : (
                                tasks.map(task => (
                                    <TaskRow key={task._id} task={task} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
"use client"
import { use, useEffect, useState } from 'react';
import TaskDetail from '@/components/TaskDetail';
import { toast } from 'sonner';

export default  function Page({ params }) {
    const { id } = use(params);
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await fetch(`/api/tasks/${id}`);

                if (!response.ok) {
                    throw new Error('Task not found or server error');
                }

                const taskData = await response.json();
                setTask(taskData);
            } catch (err) {
                setError(err.message);
                toast.error('Unable to fetch task details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [id]); // will fetch it on initail load only

    if (loading) {
        // While loading, show a loading spinner or message
        return (
            <div className="min-h-screen flex justify-center items-center">
                <span className="text-gray-500 dark:text-gray-200">Loading task...</span>
            </div>
        );
    }

    if (error) {
        // If there’s an error fetching the task, show the error message
        return (
            <div className="min-h-screen flex justify-center items-center">
                <span className="text-red-500 dark:text-red-400">{error}</span>
            </div>
        );
    }

    // Once the task data is fetched, pass it to the TaskDetail component
    return <TaskDetail task={task} />;
}
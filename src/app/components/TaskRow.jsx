import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import { useRef } from 'react';
import DeleteConfirmModal from './DeleteConfirmModal';
import {toast} from 'sonner';
import Link from 'next/link';

export default function TaskRow({ task }) {
    const { _id, taskId, title, assignedTo, status, dueDate, priority } = task;

    // formating due date ot a human readable format ("Oct 29, 2025")
    const formattedDueDate = new Date(dueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    
    const modalRef = useRef();

    const handleDelete = async (taskId) => {
        // console.log(taskId)
        try {
            const response = await fetch(`/api/tasks?id=${taskId}`, {
                method: 'DELETE',
            });
    
            if (response.ok) {
                const result = await response.json();
                toast.success(result.message || "Task deleted successfully!");
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || "Failed to delete task.");
            }
        } catch (error) {
            console.error("Delete task error:", error);
            toast.error("An error occurred while deleting the task.");
        }
    };

    return (
        <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
            <td className="px-4 py-2 text-sm text-gray-800 dark:text-white">{taskId}</td>
            <td className="px-4 py-2 text-sm text-gray-800 dark:text-white">{title}</td>
            <td className="px-4 py-2 text-sm text-gray-800 dark:text-white">{assignedTo.fullName}</td>
            <td className="px-4 py-2 text-sm text-gray-800 dark:text-white">
                <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full min-w-30 text-center ${
                        // Determine the background style based on status
                        status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-300 text-gray-800'  // Fallback to gray if unknown
                    }`}
                >
                    {status
                        .split('_')  // Split by underscores (e.g., "in_progress")
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))  // Capitalize each word
                        .join(' ')  // Join the words back together
                    }
                </span>
            </td>

            <td className="px-4 py-2 text-sm text-gray-800 dark:text-white">{formattedDueDate}</td>
            <td className="px-4 py-2 text-sm text-gray-800 dark:text-white">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </span>
            </td>
            <td className="px-4 py-2">
                <div className="flex space-x-2">
                    <Link href={`/tasks/${_id}`} passHref className="p-2 cursor-pointer text-neutral-800 dark:text-neutral-100 rounded hover:bg-gray-500 dark:hover:bg-gray-600 focus:outline-none">
                        <FaRegEye className="w-4 h-4"/>
                    </Link>
                    <button className="p-2 cursor-pointer text-neutral-800 dark:text-neutral-100 rounded hover:bg-gray-500 dark:hover:bg-gray-600 focus:outline-none">
                        <FaRegEdit className="h-5 w-5" />
                    </button>
                    <button onClick={() => modalRef.current.open()} className="p-2 cursor-pointer text-red-600 dark:text-red-400 rounded hover:bg-gray-500 dark:hover:bg-gray-600 focus:outline-none">
                        <FaRegTrashAlt className="h-5 w-5" />
                    </button>
                    <DeleteConfirmModal ref={modalRef} onConfirm={() => handleDelete(_id)}  />
                </div>
            </td>
        </tr>
    );
}
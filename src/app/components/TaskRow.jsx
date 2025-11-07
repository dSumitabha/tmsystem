export default function TaskRow({ task }) {
    const { taskId, title, assignedTo, status, dueDate, priority } = task;

  // Format the due date into a more readable format (e.g., "Nov 30, 2025")
    const formattedDueDate = new Date(dueDate).toLocaleDateString();

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
        </tr>
    );
}

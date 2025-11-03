"use client";
import { useState } from "react";

export default function TaskForm({ existingTask }) {
    const isEditMode = !!existingTask;
    const [formData, setFormData] = useState(
        existingTask || {
            taskId: "",
            title: "",
            description: "",
            assignedTo: "",
            status: "pending",
            priority: "medium",
            dueDate: ""
        }
    );

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const url = isEditMode
                ? `/api/tasks/${formData.taskId}`   // Update existing
                : `/api/tasks`;                     // Create new
    
            const method = isEditMode ? "PUT" : "POST";
    
            console.log(`${isEditMode ? "Updating" : "Creating"} task →`, formData);
    
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
    
            const result = await res.json();
    
            if (!res.ok) {
                console.error("Error:", result.error);
                alert(result.error || "Failed to save task");
                return;
            }
    
            alert(isEditMode ? "Task updated successfully!" : "Task created successfully!");
    
            // reset only after successful creation (not edit)
            if (!isEditMode) {
                setFormData({
                    taskId: "",
                    title: "",
                    description: "",
                    assignedTo: "",
                    status: "pending",
                    priority: "medium",
                    dueDate: "",
                });
            }
    
        } catch (err) {
            console.error("Submit error:", err);
            alert("An unexpected error occurred while saving the task");
        }
    };    

    return (
        <div className="min-h-screen w-full px-6 py-6 bg-slate-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-semibold mb-4">Create New Task</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid lg:grid-cols-12 gap-4">
                        <div className="lg:col-span-4">
                            <label className="block mb-2 font-medium">Task ID</label>
                            <input
                                type="text"
                                name="taskId"
                                value={formData.taskId}
                                onChange={handleChange}
                                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-transparent focus:ring-2 focus:ring-purple-700 outline-none"
                                placeholder="TASK-0001"
                                required
                            />
                        </div>
                        <div className="lg:col-span-8">
                            <label className="block mb-2 font-medium">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-transparent focus:ring-2 focus:ring-purple-700 outline-none"
                                required
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block mb-2 font-medium">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-transparent focus:ring-2 focus:ring-purple-700 outline-none"
                        />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 font-medium">Assigned To (User ID)</label>
                            <input
                                type="text"
                                name="assignedTo"
                                value={formData.assignedTo}
                                onChange={handleChange}
                                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-transparent focus:ring-2 focus:ring-purple-700 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium">Due Date</label>
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-transparent focus:ring-2 focus:ring-purple-700 outline-none"
                            />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 font-medium">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-700 outline-none"
                            >
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 font-medium">Priority</label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-700 outline-none"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="px-6 py-2 rounded-lg text-white font-medium bg-purple-700 hover:opacity-90 transition"> Create Task </button>
                </form>
            </div>
        </div>
    );
}

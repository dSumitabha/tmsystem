"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import TaskForm from "@/components/TaskForm";

export default function TaskEdit({ params }) {

  // States for task data, loading state, and error handling
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch task data when the component mounts
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`/api/tasks/${params}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch task");
        }

        const data = await response.json();
        
        if (data.message) {
          toast.error(data.message);
        } else {
          setTask(data);
        }
      } catch (error) {
        setError("Failed to load task");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div>Loading...</div>
      </div>
    )
  }

  if (error) {
    return <div className="min-h-screen">{error}</div>;
  }

  return (
    <>
        {task && <TaskForm existingTask={task} />}
    </>
  );
}
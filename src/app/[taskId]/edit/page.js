import { notFound } from "next/navigation";

export default async function EditTaskPage({ params }) {
    const { taskId } = params;

    const res = await fetch('');
    if (!res.ok) return notFound();

    const task = await res.json();

    return (
        <TaskForm existingTask={task} />
    );
}

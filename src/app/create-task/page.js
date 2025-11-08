import TaskForm from "../components/TaskForm";
import { getUserFromToken } from "@/lib/getUserFromToken";
import { redirect } from 'next/navigation';

export default async function TaskPage() {
    const user = await getUserFromToken();

    // if regular user try to access it 
    if (!user?.isAdmin) {
        return redirect('/');
    }

    // If the user is an admin, render the TaskForm component
    return (
        <TaskForm />
    );
}
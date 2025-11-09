import TaskEdit from "@/components/TaskEdit";
import { redirect } from 'next/navigation';
import { getUserFromToken } from "@/lib/getUserFromToken";

export default async function Page({params}) {
    const { id } = await params;
    const user = await getUserFromToken();

    // if regular user try to access it 
    if (!user?.isAdmin) {
        return redirect('/');
    }

    // If the user is an admin, render the TaskForm component
    return (
        <TaskEdit params={id}/>
    );
}
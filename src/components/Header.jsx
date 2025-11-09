"use client"

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaPowerOff } from 'react-icons/fa';
import { toast } from 'sonner';

export default function Header() {

    const router = useRouter();

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/logout', {
                method: 'GET',
                credentials: 'same-origin',
            });
    
            if (response.ok) {
                toast.success('Logout successful!');
                router.push('/login');
                // return redirect('/login');
            } else {
                toast.error('Error logging out. Please try again.');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error logging out. Please try again.');
        }
    };

    return (
        <header className="sticky top-0 py-2 bg-slate-100 dark:bg-slate-950 flex justify-between items-center px-4 border-b-2 border-purple-300 dark:border-purple-700">
            <Link href="/" className="text-neutral-900 dark:text-neutral-100 text-2xl font-bold" passHref>Task Management System</Link>
            <button
                onClick={handleLogout}
                className="text-neutral-950 dark:text-white cursor-pointer text-md p-2 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 hover:dark:bg-slate-600 focus:outline-none transition"
                title="Logout"
            > Logout
                <FaPowerOff className="ml-4 inline"/>
            </button>
        </header>
    );
}
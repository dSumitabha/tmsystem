'use client';

import { useRouter } from 'next/navigation';
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
            } else {
                toast.error('Error logging out. Please try again.');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error logging out. Please try again.');
        }
    };

    return (
        <header className="sticky top-0 py-4 bg-slate-950 flex justify-between items-center">
            <h1 className="text-white text-2xl font-bold pl-4">Task Management System</h1>
            <button
                onClick={handleLogout}
                className="text-white cursor-pointer text-xl p-2 rounded-full hover:bg-slate-800 transition"
                title="Logout"
            >
                <FaPowerOff />
            </button>
        </header>
    );
}
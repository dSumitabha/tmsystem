"use client"
import { Combobox } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner'; // Sonner for notifications

export default function AssignUser({ users, selectedUser, onSelectUser }) {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);  // Loading state
    const [error, setError] = useState(null);  // Error state

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            setError(null);  // Reset error before new fetch
            try {
                const response = await fetch('/api/users'); // Your users API endpoint
                if (!response.ok) {
                    throw new Error('Failed to fetch users'); // Handle error if response is not OK
                }
                const data = await response.json();
                users = data.users || []; // Ensure users exist
            } catch (err) {
                setError(err.message);
                toast.error(`Error: ${err.message}`); // Show error toast using Sonner
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);  // This will run once on component mount

    const filteredUsers = query === '' 
        ? users 
        : users.filter(user => user.fullName.toLowerCase().includes(query.toLowerCase()));

    return (
        <Combobox as="div" value={selectedUser} onChange={onSelectUser}>
            <Combobox.Label className="block mb-2 font-medium">Assigned To</Combobox.Label>
            <div className="relative">
                <Combobox.Input
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-transparent focus:ring-2 focus:ring-purple-700 outline-none"
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a user"
                />
                {isLoading && (
                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
                        <p className="text-gray-500 p-2">Loading...</p>
                    </div>
                )}
                {error && !isLoading && (
                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
                        <p className="text-red-500 p-2">Error: {error}</p>
                    </div>
                )}
                <Combobox.Options className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {filteredUsers.length === 0 ? (
                        <Combobox.Option value={null} disabled>
                            No users found
                        </Combobox.Option>
                    ) : (
                        filteredUsers.map((user) => (
                            <Combobox.Option key={user._id} value={user}>
                                {({ active }) => (
                                    <span
                                        className={`block px-4 py-2 ${active ? 'bg-purple-700 text-white' : 'text-gray-900 dark:text-gray-100'}`}
                                    >
                                        {user.fullName}
                                    </span>
                                )}
                            </Combobox.Option>
                        ))
                    )}
                </Combobox.Options>
            </div>
        </Combobox>
    );
}
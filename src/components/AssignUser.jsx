"use client";
import { useState, useEffect } from "react";
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { toast } from "sonner";
import { useAssignUserContext } from "@/context/AssignUserContext";

export default function AssignUser({ label, selectedUserId, onSelectUser }) {
    const [query, setQuery] = useState("");
    const { users, setUsers, selectedUser, setSelectedUser } = useAssignUserContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [debouncedQuery, setDebouncedQuery] = useState(query);
    const [timeoutId, setTimeoutId] = useState(null);
    
    useEffect(() => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        
        const newTimeoutId = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);
        
        setTimeoutId(newTimeoutId);
        
        return () => {
            clearTimeout(newTimeoutId);
        };
    }, [query]);
    
    useEffect(() => {
        if (debouncedQuery === "") {
            setUsers([]);
            return;
        }
        const fetchUsers = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // FIX: Changed from backticks to parentheses
                const response = await fetch(`/api/users?search=${encodeURIComponent(debouncedQuery)}`);
                if (!response.ok) throw new Error("Failed to fetch users");
                const data = await response.json();
                setUsers(data.users || []);
            } catch (err) {
                setError(err.message);
                toast.error(`Error: ${err.message}`);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, [debouncedQuery]);
    
    // I can handle both string ID and populated object
    const selectedUserObj = (() => {
        // if selectedUserId is an object
        if (typeof selectedUserId === 'object' && selectedUserId !== null) {
            return selectedUserId;
        }

        if (typeof selectedUserId === 'string') {
            return users.find((user) => user._id === selectedUserId) || selectedUser;
        }
        // fallback to selectedUser from context
        return selectedUser;
    })();
    
    return (
        <Combobox value={selectedUserObj || {}} onChange={(user) => {
            setSelectedUser(user);
            onSelectUser(user);
        }}>
            <div className="relative">
                {label && <label className="block mb-2 font-medium">Assigned To</label>}
                <ComboboxInput
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-transparent focus:ring-2 focus:ring-purple-700 outline-none"
                    onChange={(e) => setQuery(e.target.value)}
                    displayValue={(user) => user?.fullName || ""}
                    placeholder="Search for a user" required
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
                {!isLoading && users.length > 0 && (
                    <ComboboxOptions className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                        {users.map((user) => (
                        <ComboboxOption
                            key={user._id}
                            value={user}
                            className="data-[focus]:bg-purple-700 data-[focus]:text-white text-gray-900 dark:text-gray-100 block px-4 py-2 cursor-pointer"
                        >
                            {user.fullName}
                        </ComboboxOption>
                        ))}
                    </ComboboxOptions>
                )}
                {!isLoading && query !== "" && users.length === 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
                        <p className="text-gray-500 p-2">No users found</p>
                    </div>
                )}
            </div>
        </Combobox>
    );
}
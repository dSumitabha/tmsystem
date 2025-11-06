"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AssignUserContext = createContext();
export const useAssignUserContext = () => useContext(AssignUserContext);

export const AssignUserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);


    // fetch some users at initial load, later I can use recomandation logic
    useEffect(() => {
        const fetchInitialUsers = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/users`);
                console.log(response);
                if (!response.ok) throw new Error("Failed to fetch users");
                const data = await response.json();
                console.log("response data is :", data)
                setUsers(data.users || []); // Set the fetched users
                console.log("Fetched initial users:", users);
            } catch (err) {
                setError(err.message);
                console.error(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialUsers();
    }, []);

    return (
        <AssignUserContext.Provider value={{users, isLoading, error, setUsers, selectedUser, setSelectedUser}}>
            {children}
        </AssignUserContext.Provider>
    );
};
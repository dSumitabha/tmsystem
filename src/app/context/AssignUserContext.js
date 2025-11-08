"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AssignUserContext = createContext();
export const useAssignUserContext = () => useContext(AssignUserContext);

export const AssignUserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    return (
        <AssignUserContext.Provider value={{users, isLoading, error, setUsers, selectedUser, setSelectedUser}}>
            {children}
        </AssignUserContext.Provider>
    );
};
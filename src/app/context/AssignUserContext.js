"use client";
import { createContext, useContext } from "react";

const AssignUserContext = createContext();
export const useAssignUserContext = () => useContext(AssignUserContext);

export const AssignUserProvider = ({ children }) => {
    return (
        <AssignUserContext.Provider value={{}}>
            {children}
        </AssignUserContext.Provider>
    );
};
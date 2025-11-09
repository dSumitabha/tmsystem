"use client"

import { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch('/api/auth/me');
            const data = await response.json();
            if (response.ok) {
                setUser(data.user);
            } else {
                setUser(null);
            }
        };

        fetchUser();
    }, []);

    const logout = async (router) => {
        try {
            const response = await fetch('/api/logout', {
                method: 'GET',
                credentials: 'same-origin',
            });

            if (response.ok) {
                setUser(null);
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
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

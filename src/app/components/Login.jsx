"use client"
import { useState } from "react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // I will add the api here while develope the backend
        console.log("Login submitted with", email, password);
    };
    
    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Login</h2>
        
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                            Email Address
                        </label>
                        <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-purple-400"
                        placeholder="Enter your email"
                        />
                    </div>
        
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                            Password
                        </label>
                        <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-purple-400"
                        placeholder="Enter your password"
                        />
                    </div>
        
                    <button type="submit" className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-500 text-white rounded-md hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-purple-600 dark:hover:bg-gradient-to-l dark:focus:ring-purple-400">
                        Log In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;

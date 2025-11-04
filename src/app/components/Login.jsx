"use client"
import { useState } from "react";
import Link from "next/link";
import { toast } from 'sonner';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(''); 
    
        // Prepare the data to be sent in the request body
        const loginData = { email, password };
    
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (response.ok) {
                // Handle successful login
                console.log('Login successful:', data);
                toast.success('Login successful!');
                // Optionally, you can store the token if you want (but here it's being set in cookies)
                // localStorage.setItem('token', data.token);  // Avoid storing tokens in localStorage
            } else {
                // Handle errors (invalid email, password, etc.)
                // setError(data.error || 'Something went wrong');
                toast.error(data.error || 'Something went wrong');
            }
        } catch (error) {
            // Handle fetch or network errors
            console.error('Login error:', error);
            // setError('Login failed. Please try again later.');
            toast.error('Login failed. Please try again later.',);
        } finally {
            setLoading(false); // Reset loading state
        }
    };
    
    return (
        
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
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-500 text-white rounded-md hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-purple-600 dark:hover:bg-gradient-to-l dark:focus:ring-purple-400" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <div className="mt-4 text-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                    New to Task Management System?{" "}
                    <Link href="/sign-up" className="text-purple-600 hover:text-purple-500">
                        Register here
                    </Link>
                </span>
            </div>
        </div>
    );
};

export default Login;

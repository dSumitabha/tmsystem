"use client"
import { useState } from "react";
import Link from "next/link";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
        const loginData = { email, password };
    
        const loginPromise = fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        })
        .then(async (response) => {
            const data = await response.json();
            
            // Check if response is not ok (4xx, 5xx errors)
            if (!response.ok) {
                throw new Error(data.error || data.message || 'Login failed');
            }
            
            if (data.token) {
                return data;
            } else {
                throw new Error(data.error || 'Invalid credentials');
            }
        });
    
        try {
            toast.promise(loginPromise, {
                loading: 'Logging in...',
                success: 'Login successful!',
                error: (err) => err.message || 'Login failed. Please try again.',
            });
    
            const data = await loginPromise;
            
            // Handle successful login (store token, redirect, etc.)
            console.log('Login successful:', data);
            router.push('/'); // or wherever you want to redirect
            
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
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
                <button type="submit"   className={`w-full py-2 px-4 text-white rounded-md 
                        ${loading ? 'bg-purple-600 dark:bg-purple-950 cursor-not-allowed' : 'bg-purple-700 dark:bg-purple-800 '} 
                        focus:outline-none focus:ring-2 focus:ring-purple-600 
                        dark:hover:bg-purple-600 dark:focus:ring-purple-400 hover:bg-pink-800
                        disabled:bg-purple-500 disabled:cursor-not-allowed`}
                        disabled={loading}
                    >
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

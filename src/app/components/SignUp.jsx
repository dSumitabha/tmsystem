"use client"
import { useState } from "react";
import Link from "next/link";

    const SignUp = () => {
        const [email, setEmail] = useState("");
        const [fullName, setFullName] = useState("");
        const [password, setPassword] = useState("");
        const [errorMessage, setErrorMessage] = useState("");
        const [loading, setLoading] = useState(false);
    

        const handleSubmit = async (e) => {
            e.preventDefault();
        
            // Basic validation (can be expanded)
            if (!email || !fullName || !password) {
                setErrorMessage('Please fill in all fields');
                return;
            }
        
            setLoading(true);
            setErrorMessage('');
        
            try {
                const response = await fetch('/api/sign-up', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                    email,
                    fullname: fullName, 
                    password,
                    }),
                });
            
                const result = await response.json();
            
                if (response.ok) {
                    console.log('User registered:', result);
                    // I need to redirect to the relavant page with the token 
                } else {
                    setErrorMessage(result.error || 'Something went wrong');
                }
            } catch (error) {
                setErrorMessage('Registration failed, please try again');
            } finally {
                setLoading(false);
            }
    };
    

    return (
        <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Sign Up</h2>

            <form onSubmit={handleSubmit} className="space-y-6">

                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-purple-400"
                            placeholder="Enter your full name"
                        />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email Address</label>
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
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
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
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <button type="submit" className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-500 text-white rounded-md hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-purple-600 dark:hover:bg-gradient-to-l dark:focus:ring-purple-400" disabled={loading}>
                    {loading ? 'Loading...' : 'Sign Up'}
                </button>
            </form>
            <div className="mt-4 text-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                    Already have an account?{" "}
                    <Link href="/login" className="text-purple-600 hover:text-purple-500">
                        Login here
                    </Link>
                </span>
            </div>
        </div>
    );
};

export default SignUp;

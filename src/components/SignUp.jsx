"use client"
import { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { toast } from 'sonner';

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Basic validation
        if (!email || !fullName || !password) {
            toast.error('Please fill in all fields');
            return;
        }
    
        setLoading(true);
        setErrorMessage('');
    
        const signupPromise = fetch('/api/sign-up', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                fullName,
                password,
            }),
        })
        .then(async (response) => {
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'Registration failed');
            }
            
            return result;
        });
    
        try {
            toast.promise(signupPromise, {
                loading: 'Creating your account...',
                success: 'Account created successfully!',
                error: (err) => err.message || 'Registration failed. Please try again.',
            });
    
            const result = await signupPromise;
            
            console.log('User registered:', result);
            
            // Redirect to dashboard or login page
            router.push('/');
            
        } catch (error) {
            console.error('Registration error:', error);
            setErrorMessage(error.message);
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
                <button type="submit" className={`w-full py-2 px-4 text-white rounded-md 
                        ${loading ? 'bg-purple-600 dark:bg-purple-950 cursor-not-allowed' : 'bg-purple-700 dark:bg-purple-800 '} 
                        focus:outline-none focus:ring-2 focus:ring-purple-600 
                        dark:hover:bg-purple-600 dark:focus:ring-purple-400 hover:bg-pink-800
                        disabled:bg-purple-500 disabled:cursor-not-allowed`} disabled={loading}>
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

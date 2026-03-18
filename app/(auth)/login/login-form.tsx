'use client'

import { useActionState, useState } from 'react'
import { login, signup } from './actions'

export default function LoginForm({ initialMessage }: { initialMessage?: string }) {
    const [loginState, loginAction, isLoginPending] = useActionState(login, null);
    const [signupState, signupAction, isSignupPending] = useActionState(signup, null);
    const [mode, setMode] = useState<'login' | 'signup'>('login');

    // 1. Local state for client-side validation errors
    const [clientErrors, setClientErrors] = useState<{ email?: string; password?: string }>({});

    // Determine which error to show (Priority: Client-side -> Server-side)
    const errorMessage = loginState?.error || signupState?.error;

    const toggleMode = () => setMode(prev=> prev === 'login'? 'signup' : 'login')

    // 2. Validation Wrapper
    const handleAction = async (formData: FormData, action: (data: FormData) => void) => {
        setClientErrors({}); // Reset previous errors
        
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const errors: { email?: string; password?: string } = {};

        // Format Check: Email Regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            errors.email = "Email is required";
        } else if (!emailRegex.test(email)) {
            errors.email = "Invalid email format";
        }

        // Format Check: Password length
        if (!password) {
            errors.password = "Password is required";
        } else if (password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }

        if (Object.keys(errors).length > 0) {
            setClientErrors(errors);
            return;
        }

        // Trigger the actual Server Action if validation passes
        action(formData);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold text-center text-black mb-12 w-full">Learner Archive</h1>
            <h2 className="text-2xl font-bold text-blue-600 mb-2 tracking-tight">{mode==='login'? 'Welcome Back': 'Join Us'}</h2>

            <p className="text-m text-center text-slate-500 mb-8 w-full" > Build Your Own Archive. Build Your Own Rule</p>

            <form className='space-y-6 w-full'>
                {/* Email Field Group */}
                <div className='flex flex-col gap-1.5'>
                    <label className='text-sm font-medium text-slate-700 ml-1' htmlFor='email'>
                        Email Address
                    </label>
                    <input
                        name="email"
                        type="text"
                        placeholder='name@example.com'
                        className={`w-full px-4 py-2 text-black border rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-all ${
                            clientErrors.email
                            ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                            : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                        }`}
                    />
                    {clientErrors.email && (
                        <span className="text-xs text-red-500 font-medium ml-1">{clientErrors.email}</span>
                    )}
                </div>
                {/* Password Field Group */}
                <div className='flex flex-col gap-1.5'>
                    <label className='text-sm font-medium text-slate-700 ml-1' htmlFor='password'>Password</label>
                    <input
                        name="password"
                        type="password"
                        placeholder='*********'
                        className={`w-full px-4 py-2 text-black border rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-all ${
                            clientErrors.password
                            ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                            : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                        }`}
                    />
                    {clientErrors.password && (
                        <span className="text-xs text-red-500 font-medium ml-1">{clientErrors.password}</span>
                    )}
                </div>
                {/* Server Error Message */}
                {errorMessage && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                        {errorMessage}
                    </div>
                )}
                {/* Initial Status Message */}
                {initialMessage && !errorMessage && (
                    <div className="p-3 text-sm text-blue-600 bg-blue-50 rounded-lg border border-blue-100">
                        {initialMessage}
                    </div>
                )}

                <div className='flex flex-col gap-6 pt-2 w-full'>
                    <button
                        formAction={(formData)=>handleAction(formData, mode==='login'? loginAction: signupAction)}
                        disabled={isLoginPending || isSignupPending}
                        className='flex-1 py-2.5 px-4 bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50'
                    >
                        {mode === 'login'?
                        (isLoginPending ? "Logging in..." : "Login"):
                        (isSignupPending ? "Signing up..." : "Sign up")
                        }
                    </button>
                    <div className="text-center mt-8">
                    <p className="text-slate-600">
                        {mode === 'login' ? "Don't have an account?" : "Already have an account?"} {' '}
                        <button 
                            type="button" // Important: prevents form submission
                            onClick={toggleMode}
                            className="text-blue-600 font-bold hover:underline cursor-pointer"
                        >
                            {mode === 'login' ? 'Sign Up' : 'Log In'}
                        </button>
                    </p>
                </div>
                </div>
            </form>
        </div>
    )
}
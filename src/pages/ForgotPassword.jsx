import axios from 'axios';
import React, { useState } from 'react';
import { FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/users/forgot-password`,
                { email }
            );
            if (response.status === 200) {
                setSuccess(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send reset email. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <section className="flex items-center justify-center min-h-screen bg-gradient-to-r from-cyan-50 to-indigo-100 px-4">
                <div className="w-full max-w-2xl bg-white shadow-xl rounded-lg p-10 text-center">
                    <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Email Sent!</h2>
                    <p className="text-gray-600 mb-4">
                        We've sent password reset instructions to <strong>{email}</strong>.
                        Please check your inbox.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-md transition-colors"
                    >
                        Back to Login
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="flex items-center justify-center min-h-screen bg-gradient-to-r from-cyan-50 to-indigo-100 px-4">
            <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">
                {/* Left Brand Panel */}
                <div className="bg-cyan-500 text-white p-8 hidden md:flex flex-col justify-center items-center">
                    <h1 className="text-4xl font-bold mb-2">NEXIS</h1>
                    <p className="text-lg text-center">Reset your password</p>
                </div>

                {/* Right Form Panel */}
                <div className="p-6 sm:p-8 md:p-10">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Forgot Password</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && <p className="text-sm text-red-600">{error}</p>}

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    className="w-full border rounded-md px-3 py-2 pl-10 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoFocus
                                />
                                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        {/* Submit */}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-2 rounded-md transition-colors text-white ${
                                    isLoading ? 'bg-cyan-400 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-700'
                                }`}
                            >
                                {isLoading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </div>

                        {/* Back to login */}
                        <p className="text-sm text-center text-gray-600">
                            Remembered your password?{' '}
                            <Link to="/login" className="text-cyan-600 hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </form>

                    {/* Footer Legal */}
                    <div className="text-xs text-gray-500 text-center mt-6">
                        By resetting your password, you agree to our{' '}
                        <a href="#" className="underline text-indigo-500">Terms of Service</a> and{' '}
                        <a href="#" className="underline text-indigo-500">Privacy Policy</a>.
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ForgotPassword;

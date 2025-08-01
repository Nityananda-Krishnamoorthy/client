import axios from 'axios';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaUser, FaLock } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userActions } from '../store/user-slice';

const Login = () => {
    const [formData, setFormData] = useState({ userNameOrEmail: '', password: '' });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, formData);

            if (response.data.token) {
                const userData = {
                    id: response.data.user.id,
                    userName: response.data.user.userName,
                    profilePhoto: response.data.user.profilePhoto,
                    token: response.data.token,
                    refreshToken: response.data.refreshToken
                };
                dispatch(userActions.changeCurrentUser(userData));
                const from = location.state?.from || '/';
                navigate(from, { replace: true });
            }
        } catch (err) {
            const errorMessage =
                err.response?.data?.message ||
                (err.response?.status === 403
                    ? 'Please verify your email before logging in'
                    : 'Login failed. Please try again.');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="flex items-center justify-center min-h-screen bg-gradient-to-r from-cyan-50 to-indigo-100 px-4">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left Brand Panel */}
        <div className="bg-cyan-500 text-white p-8 hidden md:flex flex-col justify-center items-center">
          <h1 className="text-4xl font-bold mb-2">NEXIS</h1>
          <p className="text-lg text-center">Welcome Back! Sign in to Continue</p>
        </div>

                 {/* Right Form Panel */}
             <div className="p-6 sm:p-8 md:p-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sign In</h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                       <p className="text-sm text-red-600">{error}</p>
                    )}

                    {/* Username / Email */}
                    <div>
                        <label htmlFor="userNameOrEmail" className="block text-sm font-medium text-gray-700 mb-1">
                            Username or Email
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="userNameOrEmail"
                                id="userNameOrEmail"
                                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                                placeholder="Enter your username or email"
                                value={formData.userNameOrEmail}
                                onChange={handleInputChange}
                                required
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                id="password"
                                className="w-full border rounded-md px-3 py-2 pr-10 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        <div className="text-right mt-2">
                            <Link to="/forgot-password" className="text-sm text-cyan-600 hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                        disabled={isLoading}
                        className={`w-full py-2 rounded-md transition-colors text-white ${
                            isLoading ? 'bg-cyan-400 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-700'
                        }`}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </div>

                    {/* Sign Up Link */}
                    <p className="text-sm text-center text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-cyan-600 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </form>

                {/* Legal Footer */}
                <div className="text-xs text-gray-500 text-center mt-6">
                    By logging in, you agree to our{' '}
                   <a href="#" className="underline text-indigo-500">Terms of Service</a> and{' '}
            <a href="#" className="underline text-indigo-500">Privacy Policy</a>.
                </div>
                </div>
            </div>
        </section>
    );
};

export default Login;

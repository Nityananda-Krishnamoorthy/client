import axios from 'axios';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userActions } from '../store/user-slice';

const Register = () => {
  const [userData, setUserData] = useState({
    fullName: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [isLoading,setIsLoading] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeInputHandler = (e) => {
    setUserData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const registerUser = async (e) => {
    e.preventDefault();
    if (userData.password !== userData.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, userData);
      if (response.status === 201) {
        const loginResponse = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, {
          userNameOrEmail: userData.email,
          password: userData.password
        });

        if (loginResponse.data.token) {
          const loginData = {
            id: loginResponse.data.user.id,
            userName: loginResponse.data.user.userName,
            profilePhoto: loginResponse.data.user.profilePhoto,
            token: loginResponse.data.token,
            refreshToken: loginResponse.data.refreshToken
          };
          dispatch(userActions.changeCurrentUser(loginData));
          navigate('/');
        }
      }
    if (response.status === 201) {
    setRegisteredEmail(userData.email);
    setIsRegistered(true);
    return;
    }

    if (!userData.email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
        }

        if (userData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
        }



    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  if (isRegistered) {
    return (
      <section className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Registration Successful!</h2>
          <p className="mb-4">
            We've sent a verification email to <strong>{registeredEmail}</strong>. Please check your inbox to activate your account.
          </p>
          <div className="flex gap-4 justify-center mt-6">
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              Go to Login
            </button>
            <button className="btn btn-secondary" onClick={() => setIsRegistered(false)}>
              Register Another
            </button>
          </div>
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
          <p className="text-lg text-center">Join our community today</p>
        </div>

        {/* Right Form Panel */}
        <div className="p-6 sm:p-8 md:p-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create Account</h2>
          <form onSubmit={registerUser} className="space-y-5">
            {error && <p className="text-sm text-red-600">{error}</p>}

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                value={userData.fullName}
                onChange={changeInputHandler}
                required
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                name="userName"
                id="userName"
                value={userData.userName}
                onChange={changeInputHandler}
                required
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={userData.email}
                onChange={changeInputHandler}
                required
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  value={userData.password}
                  onChange={changeInputHandler}
                  required
                  className="w-full border rounded-md px-3 py-2 pr-10 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  id="confirmPassword"
                  value={userData.confirmPassword}
                  onChange={changeInputHandler}
                  required
                  className="w-full border rounded-md px-3 py-2 pr-10 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-md transition-colors text-white ${
                isLoading ? 'bg-cyan-400 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-700'
            }`}
            >
            {isLoading ? 'Creating...' : 'Create Account'}
            </button>

            <p className="text-sm text-center text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-cyan-600 hover:underline">
                Sign in
              </Link>
            </p>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">
            By registering, you agree to our{' '}
            <a href="#" className="underline text-indigo-500">Terms of Service</a> and{' '}
            <a href="#" className="underline text-indigo-500">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;

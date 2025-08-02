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
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeInputHandler = (e) => {
    setUserData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const registerUser = async (e) => {
    e.preventDefault();
    setError('');

    if (!userData.email.includes('@')) {
      return setError('Please enter a valid email address.');
    }

    if (userData.password.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }

    if (userData.password !== userData.confirmPassword) {
      return setError("Passwords don't match.");
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, userData);

      if (response.status === 201) {
        setRegisteredEmail(userData.email);
        setIsRegistered(true);

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
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
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
        {/* Left Panel */}
        <div className="bg-cyan-500 text-white p-8 hidden md:flex flex-col justify-center items-center">
          <h1 className="text-4xl font-bold mb-2">NEXIS</h1>
          <p className="text-lg text-center">Join our community today</p>
        </div>

        {/* Form Panel */}
        <div className="p-6 sm:p-8 md:p-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create Account</h2>
          <form onSubmit={registerUser} className="space-y-5">
            {error && <p className="text-sm text-red-600">{error}</p>}

            <InputField
              label="Full Name"
              name="fullName"
              value={userData.fullName}
              onChange={changeInputHandler}
            />
            <InputField
              label="Username"
              name="userName"
              value={userData.userName}
              onChange={changeInputHandler}
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              value={userData.email}
              onChange={changeInputHandler}
            />
            <PasswordField
              label="Password"
              name="password"
              value={userData.password}
              onChange={changeInputHandler}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
            <PasswordField
              label="Confirm Password"
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={changeInputHandler}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />

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

const InputField = ({ label, name, value, onChange, type = 'text' }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      required
      className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
    />
  </div>
);

const PasswordField = ({ label, name, value, onChange, showPassword, setShowPassword }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
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
);

export default Register;

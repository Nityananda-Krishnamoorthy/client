import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { userActions } from '../store/user-slice';

const VerifyEmail = () => {
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyToken = async () => {
      const token = new URLSearchParams(location.search).get('token');

      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/verify-email/${token}`
        );

        if (response.status === 200) {
          setStatus('success');
          setMessage('Email verified successfully!');

          const localUser = JSON.parse(localStorage.getItem('currentUser'));
          if (localUser) {
            const updatedUser = {
              ...localUser,
              emailVerified: true,
            };
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            dispatch(userActions.changeCurrentUser(updatedUser));
          }
        } else {
          throw new Error('Unexpected response');
        }
      } catch (err) {
        setStatus('error');
        setMessage(
          err.response?.data?.message || 'Verification failed. Please try again.'
        );
      }
    };

    verifyToken();
  }, [location.search, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 to-indigo-200 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl max-w-md w-full p-8 text-center space-y-4">
        {status === 'verifying' && (
          <>
            <div className="animate-spin h-10 w-10 mx-auto border-4 border-indigo-500 border-t-transparent rounded-full" />
            <h2 className="text-xl font-semibold text-gray-700">Verifying your email...</h2>
          </>
        )}

        {status === 'success' && (
          <>
            <FaCheckCircle className="text-green-500 text-5xl mx-auto" />
            <h2 className="text-2xl font-bold text-gray-800">Email Verified!</h2>
            <p className="text-gray-600">{message}</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold"
            >
              Proceed to Login
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <FaTimesCircle className="text-red-500 text-5xl mx-auto" />
            <h2 className="text-2xl font-bold text-gray-800">Verification Failed</h2>
            <p className="text-gray-600">{message}</p>
            <button
              onClick={() => navigate('/register')}
              className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold"
            >
              Back to Registration
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;

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
                emailVerified: true
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
    <div className="verify-email-container">
      <div className="verification-card">
        {status === 'verifying' && (
          <div className="verifying">
            <div className="spinner"></div>
            <h2>Verifying your email...</h2>
          </div>
        )}

        {status === 'success' && (
          <div className="success">
            <FaCheckCircle className="success-icon" />
            <h2>Email Verified!</h2>
            <p>{message}</p>
            <button
              className="btn primary"
              onClick={() => navigate('/login')}
            >
              Proceed to Login
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="error">
            <FaTimesCircle className="error-icon" />
            <h2>Verification Failed</h2>
            <p>{message}</p>
            <button
              className="btn secondary"
              onClick={() => navigate('/register')}
            >
              Back to Registration
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;

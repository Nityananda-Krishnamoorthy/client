import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [formData, setFormData] = useState({ 
        newPassword: "", 
        confirmPassword: "" 
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Extract token from URL
    const token = new URLSearchParams(location.search).get('token');
    
    // Immediately check token validity on component mount
    const [tokenValid, setTokenValid] = useState(!!token);
    
    // Add useEffect to handle token validation
    useEffect(() => {
        if (!token) {
            setTokenValid(false);
            setError("Invalid reset link");
        } else {
            // Optional: Verify token validity with backend
            verifyToken(token);
        }
    }, [token]);

    // Function to verify token with backend
    const verifyToken = async (token) => {
        try {
            // Replace with actual token verification endpoint
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/users/validate-reset-token/${token}`
            );
            
            if (!response.data.valid) {
                setTokenValid(false);
                setError("This reset link has expired or is invalid");
            }
        } catch {
            setTokenValid(false);
            setError("Failed to verify reset link. Please try again.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (formData.newPassword !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        
        setIsLoading(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/users/reset-password`, 
                {
                    token,
                    newPassword: formData.newPassword,
                    confirmPassword: formData.confirmPassword
                }
            );

            if (response.status === 200) {
                setSuccess(true);
                setTimeout(() => navigate('/login'), 3000);
            }
        } catch (err) {
            // Handle specific error cases
            if (err.response?.status === 400) {
                setError("This reset link has expired or is invalid");
                setTokenValid(false);
            } else {
                setError(err.response?.data?.message || "Password reset failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    // Return early for invalid token
    if (!tokenValid) {
        return (
            <section className='auth'>
                <div className="container auth__container">
                    <div className="error-message">
                        <h2>Invalid Reset Link</h2>
                        <p>{error || "The password reset link is invalid or has expired."}</p>
                        <p>Please request a new password reset link.</p>
                        <div className="action-buttons">
                            <button 
                                className="btn primary"
                                onClick={() => navigate('/forgot-password')}
                            >
                                Request New Link
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (success) {
        return (
            <section className='auth'>
                <div className="container auth__container">
                    <div className="success-message">
                        <FaCheckCircle className="success-icon" />
                        <h2>Password Reset!</h2>
                        <p>Your password has been successfully updated.</p>
                        <p>You will be redirected to login shortly.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className='auth'>
            <div className="container auth__container">
                <div className="brand-header">
                    <h1>NEXIS</h1>
                    <p>Create a new password</p>
                </div>
                
                <div className="form-wrapper">
                    <h2>Reset Password</h2>
                    <form onSubmit={handleSubmit}>
                        {error && <p className='form__error-message'>{error}</p>}
                        
                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <div className="input-with-icon password__controller">
                                <FaLock className="input-icon" />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    name="newPassword" 
                                    id="newPassword"
                                    placeholder="••••••••" 
                                    value={formData.newPassword}
                                    onChange={handleInputChange} 
                                    required
                                />
                                <span 
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="input-with-icon password__controller">
                                <FaLock className="input-icon" />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    name="confirmPassword" 
                                    id="confirmPassword"
                                    placeholder="••••••••" 
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange} 
                                    required
                                />
                                <span 
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>
                        
                        <div className="password-requirements">
                            <p>Your password must:</p>
                            <ul>
                                <li>Be at least 8 characters long</li>
                                <li>Contain uppercase and lowercase letters</li>
                                <li>Include at least one number</li>
                                <li>Include at least one special character</li>
                            </ul>
                        </div>
                        
                        <div className="form-footer">
                            <button 
                                type='submit' 
                                className='btn primary'
                                disabled={isLoading}
                            >
                                {isLoading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </div>
                    </form>
                    <div className="terms-notice">
                    <p>
                        By resetting your password, you agree to our{" "}
                        <a href="#">Terms of Service</a>{" "}
                        and{" "}
                        <a href="#">Privacy Policy</a>.
                    </p>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ResetPassword;
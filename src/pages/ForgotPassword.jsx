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
    }

    if (success) {
        return (
            <section className='auth'>
                <div className="container auth__container">
                    <div className="success-message">
                        <FaCheckCircle className="success-icon" />
                        <h2>Email Sent!</h2>
                        <p>We've sent password reset instructions to <strong>{email}</strong>.</p>
                        <p>Please check your inbox and follow the instructions to reset your password.</p>
                        <div className="action-buttons">
                            <button 
                                className="btn primary"
                                onClick={() => navigate('/login')}
                            >
                                Back to Login
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className='auth'>
            <div className="container auth__container">
                <div className="brand-header">
                    <h1>NEXIS</h1>
                    <p>Reset your password</p>
                </div>
                
                <div className="form-wrapper">
                    <h2>Forgot Password</h2>
                    <form onSubmit={handleSubmit}>
                        {error && <p className='form__error-message'>{error}</p>}
                        
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-with-icon">
                                <FaEnvelope className="input-icon" />
                                <input 
                                    type="email" 
                                    name="email" 
                                    id="email"
                                    placeholder="Email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required
                                    autoFocus
                                />
                            </div>
                            <p className="instruction">
                                Enter the email associated with your account
                            </p>
                        </div>
                        
                        <div className="form-footer">
                            <button 
                                type='submit' 
                                className='btn primary'
                                disabled={isLoading}
                            >
                                {isLoading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                            
                            <p className="back-link">
                                <Link to="/login">Back to Sign In</Link>
                            </p>
                        </div>
                    </form>
                   <div className="terms-notice">
                    <p>
                        By resetting your password, you agree to our{" "}
                        <a href="#" >Terms of Service</a>{" "}
                        and{" "}
                        <a href="#" >Privacy Policy</a>.
                    </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ForgotPassword;
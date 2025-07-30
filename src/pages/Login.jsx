import axios from 'axios';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaUser, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userActions } from '../store/user-slice';
import { useLocation } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ 
        userNameOrEmail: "", 
        password: "" 
    });
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch(); // Add dispatch

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/users/login`, 
                formData
            );

            if (response.data.token) {
                // Create user data object with all needed properties
                const userData = {
                    id: response.data.user.id,
                    userName: response.data.user.userName,
                    profilePhoto: response.data.user.profilePhoto,
                    token: response.data.token,
                    refreshToken: response.data.refreshToken
                };
                
                // Dispatch to Redux store
                dispatch(userActions.changeCurrentUser(userData));
                
            // Redirect to previous location or home
                const from = location.state?.from || '/';
                navigate(from, { replace: true }); // Fix navigation
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 
                (err.response?.status === 403 
                    ? "Please verify your email before logging in" 
                    : "Login failed. Please try again.");
                    
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <section className='auth'>
            <div className="container auth__container">
                <div className="brand-header">
                    <h1>NEXIS</h1>
                    <p>Welcome back! Sign in to continue</p>
                </div>
                
                <div className="form-wrapper">
                    <h2>Sign In</h2>
                    <form onSubmit={handleSubmit}>
                        {error && <p className='form__error-message'>{error}</p>}
                        
                        <div className="form-group">
                            <label htmlFor="userNameOrEmail">Username or Email</label>
                            <div className="input-with-icon">
                                <FaUser className="input-icon" />
                                <input 
                                    type="text" 
                                    name="userNameOrEmail" 
                                    id="userNameOrEmail"
                                    placeholder="Username or Email" 
                                    value={formData.userNameOrEmail}
                                    onChange={handleInputChange} 
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-with-icon password__controller">
                                <FaLock className="input-icon" />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    name="password" 
                                    id="password"
                                    placeholder="••••••••" 
                                    value={formData.password}
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
                            
                            <div className="forgot-password">
                                <Link to="/forgot-password">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>
                        
                        <div className="form-footer">
                            <button 
                                type='submit' 
                                className='btn primary'
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </button>
                            
                            <p className="register-link">
                                Don't have an account? <Link to="/register">Sign up</Link>
                            </p>
                        </div>
                    </form>
                    
                    {/* <div className="social-login">
                        <div className="divider">
                            <span>Or sign in with</span>
                        </div>
                        
                        <div className="social-buttons">
                            <button className="btn social google">
                                <svg className="social-icon" viewBox="0 0 24 24">
                                    <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
                                </svg>
                                Google
                            </button>
                            
                            <button className="btn social github">
                                <svg className="social-icon" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                                GitHub
                            </button>
                        </div>
                    </div> */}
                    <div className="terms-notice">
                    <p>
                        By logging in, you agree to our{" "}
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

export default Login
import axios from 'axios';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'; 
import { userActions } from '../store/user-slice'; 

const Register = () => {
    const [userData, setUserData] = useState({ 
        fullName: "", 
        userName: "", 
        email: "", 
        password: "", 
        confirmPassword: "" 
    });
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const registeredEmail = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeInputHandler = (e) => {
        setUserData(prevState => ({...prevState, [e.target.name]: e.target.value}));
    }

    const registerUser = async (e) => {
        e.preventDefault();
         try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, userData);
            if (response.status === 201) {
                // Automatically log user in after registration
                const loginResponse = await axios.post(
                    `${import.meta.env.VITE_API_URL}/users/login`,
                    {
                        userNameOrEmail: userData.email,
                        password: userData.password
                    }
                );
                
                if (loginResponse.data.token) {
                    const userData = {
                        id: loginResponse.data.user.id,
                        userName: loginResponse.data.user.userName,
                        profilePhoto: loginResponse.data.user.profilePhoto,
                        token: loginResponse.data.token,
                        refreshToken: loginResponse.data.refreshToken
                    };
                    
                    dispatch(userActions.changeCurrentUser(userData));
                    navigate('/'); // Navigate to home
                }
            }
        } catch(err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        }
    }

    if (isRegistered) {
        return (
            <section className='register'>
                <div className="container register__container">
                    <div className="success-message">
                        <FaCheckCircle className="success-icon" />
                        <h2>Registration Successful!</h2>
                        <p>We've sent a verification email to <strong>{registeredEmail}</strong>.</p>
                        <p>Please check your inbox and click the verification link to activate your account.</p>
                        <div className="action-buttons">
                            <button 
                                className="btn primary"
                                onClick={() => navigate('/login')}
                            >
                                Go to Login
                            </button>
                            <button 
                                className="btn secondary"
                                onClick={() => setIsRegistered(false)}
                            >
                                Register Another
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className='register'>
            <div className="container register__container">
                <div className="brand-header">
                    <h1>NEXIS</h1>
                    <p>Join our community today</p>
                </div>
                
                <div className="form-wrapper">
                    <h2>Create Account</h2>
                    <form onSubmit={registerUser}>
                        {error && <p className='form__error-message'>{error}</p>}
                        
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input 
                                type='text' 
                                name='fullName' 
                                id='fullName'
                                placeholder='Full Name' 
                                value={userData.fullName}
                                onChange={changeInputHandler} 
                                required
                                autoFocus
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="userName">Username</label>
                            <input 
                                type='text' 
                                name='userName' 
                                id='userName'
                                placeholder='Username' 
                                value={userData.userName}
                                onChange={changeInputHandler} 
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input 
                                type='email' 
                                name='email' 
                                id='email'
                                placeholder='Email ' 
                                value={userData.email}
                                onChange={changeInputHandler} 
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password__controller">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    name='password' 
                                    id='password'
                                    placeholder='••••••••' 
                                    value={userData.password}
                                    onChange={changeInputHandler} 
                                    required
                                />
                                <span onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="password__controller">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    name='confirmPassword' 
                                    id='confirmPassword'
                                    placeholder='••••••••' 
                                    value={userData.confirmPassword}
                                    onChange={changeInputHandler} 
                                    required
                                />
                                <span onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>
                        
                        <div className="form-footer">
                            <p className="login-link">
                                Already have an account? <Link to="/login">Sign in</Link>
                            </p>
                            <button type='submit' className='btn primary'>
                                Create Account
                            </button>
                        </div>
                    </form>
                    
                    <div className="terms-notice">
                        <p>By registering, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Register;
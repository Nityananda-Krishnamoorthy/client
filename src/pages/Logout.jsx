import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { userActions } from '../store/user-slice';

const Logout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        // Clear user state properly
        dispatch(userActions.changeCurrentUser(null)); // Pass null instead of {}
        navigate('/login', { replace: true }); // Add replace option
    }, [dispatch, navigate]); // Add dependencies
    
    return <div>Logging out...</div>
}

export default Logout
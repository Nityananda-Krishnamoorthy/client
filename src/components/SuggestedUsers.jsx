import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProfileImage from './ProfileImage';
import { FaUserPlus } from 'react-icons/fa';

const SuggestedUsers = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/suggested`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuggestedUsers(response.data);
      } catch (error) {
        console.error('Error fetching suggested users:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSuggestedUsers();
  }, []);

  if (loading) {
    return <div className="suggested-loading">Loading suggestions...</div>;
  }

  return (
    <div className="suggested-users">
      <h3>Suggested Users</h3>
      <div className="users-list">
        {suggestedUsers.map(user => (
          <div className="suggested-user" key={user._id}>
            <Link to={`/users/${user._id}`}>
              <ProfileImage image={user.profilePhoto} />
              <div className="user-info">
                <strong>{user.fullName}</strong>
                <span>@{user.userName}</span>
              </div>
            </Link>
            <button className="follow-btn">
              <FaUserPlus />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsers;
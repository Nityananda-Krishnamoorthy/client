import React, { useState } from 'react';
import api from '../services/api';

const FollowButton = ({ 
  isFollowing, 
  username, 
  isPrivate, 
  onFollowChange 
}) => {
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  
  const handleFollow = async () => {
    setLoading(true);
    try {
      const response = await api.followUser(username);
      
      if (response.data.status === 'pending') {
        setPending(true);
      } else {
        onFollowChange(true);
      }
    } catch (error) {
      console.error('Follow error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUnfollow = async () => {
    setLoading(true);
    try {
      await api.unfollowUser(username);
      onFollowChange(false);
      setPending(false);
    } catch (error) {
      console.error('Unfollow error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (pending) {
    return (
      <button 
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full font-medium"
        disabled
      >
        Requested
      </button>
    );
  }
  
  if (isFollowing) {
    return (
      <button
        onClick={handleUnfollow}
        disabled={loading}
        className={`px-4 py-2 bg-red-100 text-red-600 rounded-full font-medium hover:bg-red-200 transition-colors ${
          loading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Processing...' : 'Unfollow'}
      </button>
    );
  }
  
  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`px-4 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors ${
        loading ? 'opacity-70 cursor-not-allowed' : ''
      }`}
    >
      {loading ? 'Processing...' : isPrivate ? 'Request' : 'Follow'}
    </button>
  );
};

export default FollowButton;
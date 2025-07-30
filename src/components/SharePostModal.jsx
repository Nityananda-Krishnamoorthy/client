import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaSearch, FaTimes } from 'react-icons/fa';
import ProfileImage from './ProfileImage';

const SharePostModal = ({ post, onClose }) => {
  const [search, setSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const followers = useSelector(state => state.user.currentUser?.followers) || [];

  const filteredFollowers = followers.filter(user => 
    user.fullName.toLowerCase().includes(search.toLowerCase()) ||
    user.userName.toLowerCase().includes(search.toLowerCase())
  );

  const toggleUserSelection = (user) => {
    setSelectedUsers(prev => 
      prev.some(u => u._id === user._id)
        ? prev.filter(u => u._id !== user._id)
        : [...prev, user]
    );
  };

  const handleShare = () => {
    // Implement share functionality
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="share-post-modal">
        <div className="modal-header">
          <h3>Share Post</h3>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        
        <div className="search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Search followers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="selected-users">
          {selectedUsers.map(user => (
            <div key={user._id} className="selected-user">
              <ProfileImage image={user.profilePhoto} small />
              <span>{user.userName}</span>
              <button onClick={() => toggleUserSelection(user)}>
                <FaTimes />
              </button>
            </div>
          ))}
        </div>
        
        <div className="users-list">
          {filteredFollowers.map(user => (
            <div 
              key={user._id} 
              className={`user-item ${selectedUsers.some(u => u._id === user._id) ? 'selected' : ''}`}
              onClick={() => toggleUserSelection(user)}
            >
              <ProfileImage image={user.profilePhoto} />
              <div className="user-info">
                <strong>{user.fullName}</strong>
                <span>@{user.userName}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="modal-footer">
          <button 
            onClick={handleShare} 
            disabled={selectedUsers.length === 0}
            className="btn btn-primary"
          >
            Send to {selectedUsers.length} {selectedUsers.length === 1 ? 'person' : 'people'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharePostModal;
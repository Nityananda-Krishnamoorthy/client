import React from 'react';
import defaultImage from '../assets/default-profile.png';

const ProfileImage = ({ image, className = '' }) => {
  

  return (
    <div className={`profileImage ${className}`}>
      <img 
        src={image || defaultImage} 
        alt="Profile" 
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = defaultImage;
        }}
      />
    </div>
  );
};

export default ProfileImage;
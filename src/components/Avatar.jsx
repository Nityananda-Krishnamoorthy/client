// components/Avatar.js
import React from 'react';

const Avatar = ({ src, name, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  };

  if (src) {
    return (
      <img 
        src={src} 
        alt={name} 
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
    );
  }

  // If no image, show initials
  const initials = name 
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : '?';

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold`}>
      {initials}
    </div>
  );
};

export default Avatar;
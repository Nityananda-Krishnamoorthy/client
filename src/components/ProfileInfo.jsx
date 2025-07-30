import React from 'react';
import { FaGlobe, FaTwitter, FaInstagram, FaGithub, FaLinkedin } from 'react-icons/fa';

const socialIcons = {
  twitter: FaTwitter,
  instagram: FaInstagram,
  github: FaGithub,
  linkedin: FaLinkedin
};

const ProfileInfo = ({ user }) => {
  return (
    <div className="mt-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">{user.fullName}</h1>
        <p className="text-gray-600">@{user.userName}</p>
      </div>
      
      {user.bio && (
        <p className="mb-4 text-gray-700">{user.bio}</p>
      )}
      
      {user.website && (
        <div className="flex items-center mb-2 text-blue-500">
          <FaGlobe className="mr-2" />
          <a 
            href={user.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {user.website.replace(/^https?:\/\//, '')}
          </a>
        </div>
      )}
      
      {user.socialMedia && (
        <div className="flex space-x-3 mt-3">
          {Object.entries(user.socialMedia).map(([platform, url]) => {
            if (!url) return null;
            
            const Icon = socialIcons[platform];
            if (!Icon) return null;
            
            return (
              <a 
                key={platform}
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-500 transition-colors"
                aria-label={platform}
              >
                <Icon className="text-xl" />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;
import React, { useState } from 'react';
import { LuUpload } from 'react-icons/lu';
import { FaCheck, FaTimes } from 'react-icons/fa';
import api from '../services/api';
import { validateImage } from '../utils/helpers';

const AvatarUpload = ({ profilePhoto, userId, onUpdate }) => {
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(profilePhoto);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    const validationError = validateImage(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError(null);
    setAvatar(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!avatar) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('avatar', avatar);
      
      const response = await api.uploadAvatar(formData);
      onUpdate(response.data);
      setAvatar(null);
    } catch (err) {
      setError('Failed to upload avatar. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setAvatar(null);
    setPreview(profilePhoto);
    setError(null);
  };

  return (
    <form className="relative group" onSubmit={handleSubmit}>
      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
        <img 
          src={preview} 
          alt="Profile" 
          className="w-full h-full object-cover"
        />
        <label 
          htmlFor="avatar-upload" 
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <LuUpload className="text-white text-2xl" />
        </label>
      </div>
      
      <input
        id="avatar-upload"
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/jpg, image/webp"
      />
      
      {avatar && (
        <div className="mt-2 flex space-x-2">
          <button
            type="submit"
            disabled={loading}
            className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FaCheck className="text-sm" />
            )}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>
      )}
      
      {error && (
        <p className="mt-2 text-red-500 text-sm max-w-xs">{error}</p>
      )}
    </form>
  );
};

export default AvatarUpload;
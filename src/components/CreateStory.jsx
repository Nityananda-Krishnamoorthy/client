import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FaCamera, FaVideo, FaTimes, FaCheck } from 'react-icons/fa';

const CreateStory = ({ onClose, onStoryCreated }) => {
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const token = useSelector(state => state?.user?.currentUser?.token);
  console.log('Sending token:', token);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.type.split('/')[0];
    if (fileType !== 'image' && fileType !== 'video') {
      alert('Please select an image or video file');
      return;
    }

    setMedia(file);
    setMediaType(fileType);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handlePostStory = async () => {
    if (!media) return;
    
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('media', media);
      formData.append('type', mediaType);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/stories/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      if (onStoryCreated) {
        onStoryCreated(response.data);
      }
      
      onClose();
    } catch (error) {
      console.error('Error posting story:', error);
      alert('Failed to post story');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Create Story</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <FaTimes size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {previewUrl ? (
          <div className="relative">
            {mediaType === 'image' ? (
              <img 
                src={previewUrl} 
                alt="Story preview" 
                className="w-full h-96 object-cover rounded-lg"
              />
            ) : (
              <video 
                src={previewUrl} 
                controls 
                autoPlay 
                muted 
                className="w-full h-96 object-cover rounded-lg"
              />
            )}
            
            <div className="flex justify-center mt-4">
              <button 
                className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-medium disabled:opacity-50"
                onClick={handlePostStory}
                disabled={isUploading}
              >
                {isUploading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  <>
                    <FaCheck className="mr-2" />
                    Post Story
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-10">
            <div className="mb-6 text-center">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Share a moment</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your story will disappear after 24 hours
              </p>
            </div>
            
            <div className="flex space-x-8">
              <div 
                className="flex flex-col items-center cursor-pointer"
                onClick={() => fileInputRef.current.click()}
              >
                <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-2">
                  <FaCamera className="text-blue-500 dark:text-blue-300" size={30} />
                </div>
                <span className="text-gray-700 dark:text-gray-300">Photo</span>
              </div>
              
              <div 
                className="flex flex-col items-center cursor-pointer"
                onClick={() => fileInputRef.current.click()}
              >
                <div className="w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-2">
                  <FaVideo className="text-purple-500 dark:text-purple-300" size={30} />
                </div>
                <span className="text-gray-700 dark:text-gray-300">Video</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,video/*"
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default CreateStory;
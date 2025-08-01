import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCamera, FaVideo, FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const CreateStory = () => {
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const token = useSelector(state => state?.user?.currentUser?.token);

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

    await axios.post(
      `${import.meta.env.VITE_API_URL}/stories/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    navigate('/');
  } catch (error) {
    console.error('Error posting story:', error);
    alert('Failed to post story');
  } finally {
    setIsUploading(false);
  }
};

  return (
    <div className="create-story-container">
      <div className="create-story-header">
        <h2>Create Story</h2>
        <button onClick={() => navigate('/')}>
          <FaTimes size={24} />
        </button>
      </div>

      {previewUrl ? (
        <div className="story-preview">
          {mediaType === 'image' ? (
            <img src={previewUrl} alt="Story preview" />
          ) : (
            <video src={previewUrl} controls autoPlay muted />
          )}
          <button 
            className="post-story-btn"
            onClick={handlePostStory}
            disabled={isUploading}
          >
            {isUploading ? 'Posting...' : 'Post Story'}
          </button>
        </div>
      ) : (
        <div className="story-upload-options">
          <div 
            className="upload-option"
            onClick={() => fileInputRef.current.click()}
          >
            <FaCamera size={48} />
            <span>Photo</span>
          </div>
          <div 
            className="upload-option"
            onClick={() => fileInputRef.current.click()}
          >
            <FaVideo size={48} />
            <span>Video</span>
          </div>
        </div>
      )}

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
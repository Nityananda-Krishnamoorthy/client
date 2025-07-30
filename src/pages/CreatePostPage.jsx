import React, { useState } from 'react';
import axios from 'axios';
import CreatePost from '../components/CreatePost';
import { creatorhelper } from '../helpers/creatorhelper';
import { useNavigate } from 'react-router-dom';

const CreatePostPage = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleCreatePost = async (formData) => {
    try {
      setLoading(true);
      setError('');

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/posts`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      console.log(' Post created successfully:', res.data);

    } catch (err) {
      console.error(' Error creating post:', err);
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="createPostPage " >
        <button className="back-button" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
    
    <h2>{creatorhelper}</h2>
      <CreatePost
        onCreatePost={handleCreatePost}
        error={error}
        loading={loading}
        className ="createPostBar"
      />
    </div>
  );
};



export default CreatePostPage;

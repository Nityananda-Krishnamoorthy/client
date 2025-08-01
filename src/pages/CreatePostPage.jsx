import React, { useState } from 'react';
import axios from 'axios';
import CreatePost from '../components/CreatePost';
import { creatorhelper } from '../helpers/creatorhelper';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

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

      console.log('Post created successfully:', res.data);
      navigate(`/posts/${res.data._id}`);
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-100 rounded-full transition-all"
        >
          <FaArrowLeft size={12} />
          Back
        </button>
      </div>

      {/* Heading */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create New Post</h2>
        <p className="text-gray-600 dark:text-gray-400">{creatorhelper}</p>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl p-6 ">
        {/* Error */}
        {error && (
          <div className="mb-4 p-3 text-sm rounded-md bg-red-100 text-red-700 border border-red-300 dark:bg-red-900 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Form */}
        <CreatePost
          onCreatePost={handleCreatePost}
          error={error}
          loading={loading}
          className="space-y-4"
        />

        {/* Loading State */}
        {loading && (
          <div className="mt-4 text-center text-sm text-blue-500 dark:text-blue-300">
            Creating post...
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePostPage;

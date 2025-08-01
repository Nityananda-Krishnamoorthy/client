import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Feed from '../components/Feed';
import CommentSection from '../components/CommentSection';
import { FaArrowLeft } from 'react-icons/fa';

const SinglePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useSelector(state => state?.user?.currentUser?.token);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/posts/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPost(response?.data);
        

      } catch (err) {
        const status = err.response?.status;
        if (status === 403) {
          setError('Access denied. You may be blocked or this post is private.');
        } else if (status === 404) {
          setError('Post not found.');
        } else {
          setError('Something went wrong.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-500 dark:text-gray-300">
        Loading post...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-red-500 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-500 dark:text-gray-300">
        Post not found.
      </div>
    );
  }


  const handlePostUpdate = (updatedPost) => {
    setPost(updatedPost);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm px-2 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-100 rounded-full transition-all"
        >
          <FaArrowLeft size={12} />
          Back
        </button>
      </div>

      {/* Post Content */}
      
          {post && (
          <Feed 
            post={post} 
            onPostUpdate={handlePostUpdate} 
            className="w-full" 
          />
        )}
      

      {/* Comment Section */}
      <div className="bg-white dark:bg-gray-900 shadow-md rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4 dark:text-white">Comments</h3>
        <CommentSection postId={post._id} comments={post.comments} />
      </div>
    </div>
  );
};

export default SinglePost;

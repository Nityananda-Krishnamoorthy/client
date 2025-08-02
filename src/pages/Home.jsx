import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import CreatePost from '../components/CreatePost';
import Feed from '../components/Feed';
import Stories from '../components/Stories';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const token = useSelector((state) => state?.user?.currentUser?.token);

  const API_URL = import.meta.env.VITE_API_URL;

  // Create new post
  const createPost = async (data) => {
    setError('');
    try {
      const response = await axios.post(`${API_URL}/posts`, data, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      const newPost = response?.data?.post;
      if (newPost) {
        setPosts((prev) => [newPost, ...prev]);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create post.');
    }
  };

  // Get all posts
  const getPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/posts`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response?.data?.posts || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load posts.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update post handler
  const updatePost = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post._id === updatedPost._id ? updatedPost : post))
    );
  };

  // Load posts on mount or token change
  useEffect(() => {
    if (token) {
      getPosts();
    }
  }, [token]);

  return (
    <section className="w-full flex flex-col">
      {/* Stories Section */}
      <div className=" top-20 pt-10 z-10 ">
        <Stories />
      </div>
      
      {/* Main Feed Area */}
      <div className="flex-1 px-4 py-1 mt-4">
        {/* Create Post Section */}
        <div className="max-w-2xl mx-auto mb-6">
          <CreatePost onCreatePost={createPost} error={error} />
        </div>

        {/* Loading, Error, Empty, or Posts */}
        {isLoading ? (
          <div className="text-center text-gray-600 dark:text-gray-300 text-lg py-10">
            Loading posts...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-10">
            No posts available. Start by creating one!
          </div>
        ) : (
          <div className="flex flex-col gap-6 max-w-2xl mx-auto">
            {posts.map((post) => (
              <div key={post._id} className="rounded-xl transition">
                <Feed
                  post={post}
                  onPostUpdate={updatePost}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Home;
// src/pages/UserPosts.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Feed from '../components/FeedItems'; // Adjust path as needed

const UserPosts = () => {
  const { id: userId } = useParams();
  const token = useSelector((state) => state?.user?.currentUser?.token);

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}/posts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchUserPosts();
  }, [userId]);

  const handlePostUpdate = (updatedPost) => {
    setPosts((prev) =>
      prev.map((post) => (post._id === updatedPost._id ? updatedPost : post))
    );
  };

  const handleDeletePost = (postId) => {
    setPosts((prev) => prev.filter((post) => post._id !== postId));
  };

  return (
    <section className="w-full min-h-screen mt-5">
      <div className="flex items-center justify-between max-w-5xl mx-auto mb-6">
        {/* <h2 className="text-xl font-semibold  text-gray-900 dark:text-white">
          User’s Posts
        </h2> */}
        <div />
      </div>

      {isLoading ? (
        <div className="text-center px-4 text-gray-500 dark:text-gray-400">
          Loading posts...
        </div>
      ) : posts.length > 0 ? (
        <div className="grid gap-3 max-w-5xl mx-auto grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post._id} className="rounded overflow-hidden border-none transition">
              <Feed
                post={post}
                onDeletePost={handleDeletePost}
                setPost={handlePostUpdate}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 py-6">
          <p>This user hasn’t posted anything yet.</p>
        </div>
      )}
    </section>
  );
};

export default UserPosts;

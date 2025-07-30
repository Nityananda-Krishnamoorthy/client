// pages/ProfilePage.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Feed from '../components/FeedItems';
import ProfileImage from '../components/ProfileImage';

const ProfilePage = () => {
  const { id } = useParams(); // user ID from route
  const token = useSelector((state) => state.user?.currentUser?.token);

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserAndPosts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      setPosts(res.data.posts);
    } catch (error) {
      console.error('Error fetching user/profile posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndPosts();
  }, [id]);

  const handlePostUpdate = (updatedPost) => {
    setPosts((prev) =>
      prev.map((post) => (post._id === updatedPost._id ? updatedPost : post))
    );
  };

  const handleDeletePost = (postId) => {
    setPosts((prev) => prev.filter((post) => post._id !== postId));
  };

  if (loading) return <div className="text-center py-10">Loading profile...</div>;

  return (
    <section className="max-w-5xl mx-auto mt-8">
      <div className="mb-6 text-center">
        <ProfileImage src={user?.profilePicture} />
        <h1 className="text-xl font-bold mt-2">{user?.username}</h1>
        <p className="text-gray-500">{user?.bio}</p>
      </div>

      <h2 className="text-lg font-semibold mb-4 text-gray-800">Posts by {user?.username}</h2>

      {posts.length > 0 ? (
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post._id} className="rounded overflow-hidden border transition">
              <Feed post={post} onDeletePost={handleDeletePost} setPost={handlePostUpdate} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No posts yet</p>
      )}
    </section>
  );
};

export default ProfilePage;

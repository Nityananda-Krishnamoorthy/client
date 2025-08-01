import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Feed from '../components/Feed';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const RecentDeleted = () => {
  const [deletedPosts, setDeletedPosts] = useState([]);
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const navigate = useNavigate();

  const fetchDeletedPosts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/posts/deleted/list`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setDeletedPosts(response.data);
    } catch (err) {
      console.error('Error fetching deleted posts:', err);
    }
  };

  useEffect(() => {
    fetchDeletedPosts();
  }, []); // only run once on mount

  return (
    <div className="lg:w-[80dvh] md:w-[70dvh] min-h-screen py-16 sm:px-14">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-cyan-600 hover:text-cyan-800 font-medium transition"
          >
            ← Back
          </button>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Recently Deleted Posts
          </h2>
          <div className="w-12" /> {/* spacer for symmetry */}
        </div>

        {deletedPosts.length === 0 ? (
          <p className="text-gray-500 text-center">No deleted posts found.</p>
        ) : (
          <div className="space-y-4">
            {deletedPosts.map((post) => (
              <Feed
                key={post._id}
                post={post}
                onDeletePost={fetchDeletedPosts}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentDeleted;

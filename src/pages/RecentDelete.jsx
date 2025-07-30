import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Feed from '../components/Feed'; // reuse Feed
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
  });

  return (
    
   
    <div className="deleted-posts-page">
         <button className="back-button" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
        
      <h2>Recently Deleted Posts</h2>
      {deletedPosts.length === 0 ? (
        <p>No deleted posts.</p>
      ) : (
        deletedPosts.map((post) => (
          <Feed key={post._id} post={post} onDeletePost={fetchDeletedPosts} />
        ))
      )}
    </div>

  );
};

export default RecentDeleted;

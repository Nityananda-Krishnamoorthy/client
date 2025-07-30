
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { CiSearch } from 'react-icons/ci';
import Feed from '../components/FeedItems';
import ProfileImage from '../components/ProfileImage';
import { createPortal } from 'react-dom';

const Feeds = () => {
  const token = useSelector(state => state?.user?.currentUser?.token);

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPosts, setTotalPosts] = useState(0);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

  // Fetch explore posts
  const fetchExplorePosts = async () => {
    setIsLoadingPosts(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/posts?explore=true&page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(prev => page === 1 ? response.data.posts : [...prev, ...response.data.posts]);
      setTotalPosts(response.data.total);
    } catch (error) {
      console.error('Error fetching explore posts:', error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

    useEffect(() => {
      fetchExplorePosts();
    }, [page]);

     // Handle post updates
      const handlePostUpdate = (updatedPost) => {
        setPosts(prev => prev.map(post => 
          post._id === updatedPost._id ? updatedPost : post
        ));
      };
    
      // Handle post deletion
      const handleDeletePost = (postId) => {
        setPosts(prev => prev.filter(post => post._id !== postId));
      };
    

  return (
        <section className="w-full min-h-screen mt-5">
        <div className="flex items-center justify-between max-w-5xl mx-auto mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Explore Posts</h2>
        <div /> {/* placeholder for alignment */}
      </div>
          {isLoadingPosts && page === 1 ? (
            <div className="text-center px-4 text-gray-500 dark:text-gray-400">Loading posts...</div>
          ) : posts.length > 0 ? (
            

              <div className="grid gap-3  max-w-5xl  max-h-5xl mx-auto grid-cols-2 lg:grid-cols-3 ">
                {posts.map(post => (
                  <div className="rounded overflow-hidden border-none transition" key={post?._id}>
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
              <p>No posts to explore yet</p>
            </div>
          )}
        </section>
  )
}

export default Feeds
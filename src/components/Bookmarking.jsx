import React, { useEffect, useState } from 'react';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Bookmarking = ({ post, onBookmarkRemoved }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const userId = useSelector((state) => state?.user?.currentUser?.id);
  const [loading, setLoading] = useState(false);

  // Check if already bookmarked
useEffect(() => {
  if (!post || !userId) return;

  const isBookmarked =
    post?.isBookmarked !== undefined
      ? post.isBookmarked
      : Array.isArray(post.bookmarks) && post.bookmarks.includes(userId);

  setBookmarked(isBookmarked);
}, [post?._id, post?.bookmarks, post?.isBookmarked, userId]);


  const toggleBookmark = async () => {
    if (!token || !userId) return;
    
    try {
      setLoading(true);
      const url = `${import.meta.env.VITE_API_URL}/posts/${post?._id}/bookmarks`;
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      };

      if (bookmarked) {
        await axios.delete(url, config);
        setBookmarked(false);
        if (onBookmarkRemoved) onBookmarkRemoved();
      } else {
        await axios.post(url, {}, config);
        setBookmarked(true);
      }
    } catch (error) {
      console.error('Bookmarking error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-1 bg-white/70 rounded-full">
        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <button 
      className="p-1 bg-white/70 rounded-full hover:bg-white transition-colors"
      onClick={toggleBookmark}
      disabled={loading}
      aria-label={bookmarked ? "Remove bookmark" : "Bookmark this post"}
    >
      {bookmarked ? 
        <BsBookmarkFill size={20} className="text-blue-600" /> : 
        <BsBookmark size={20} className="text-gray-700" />
      }
    </button>
  );
};

export default Bookmarking;
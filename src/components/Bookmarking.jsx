import React, { useEffect } from 'react';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Bookmarking = ({ post, onPostUpdate }) => {
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const userId = useSelector((state) => state?.user?.currentUser?.id);
  
  // Check if bookmarked
  const isBookmarked = post?.bookmarks?.some(id => id.toString() === userId?.toString());

  const toggleBookmark = async () => {
    if (!token || !userId) return;
    
    try {
      // Optimistic UI update
      const action = isBookmarked ? 'unbookmark' : 'bookmark';
      const updatedBookmarks = isBookmarked 
        ? post.bookmarks.filter(id => id.toString() !== userId)
        : [...post.bookmarks, userId];
      
      onPostUpdate?.({
        ...post,
        bookmarks: updatedBookmarks
      });

      // API call
      const method = isBookmarked ? 'delete' : 'post';
      await axios[method](
        `${import.meta.env.VITE_API_URL}/posts/${post?._id}/bookmarks`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

    } catch (error) {
      // Revert on error
      onPostUpdate?.(post);
      console.error('Bookmarking error:', error);
    }
  };

  return (
    <button 
      className="p-1 bg-white/70 rounded-full hover:bg-white transition-colors"
      onClick={toggleBookmark}
      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this post"}
    >
      {isBookmarked ? 
        <BsBookmarkFill size={20} className="text-blue-600" /> : 
        <BsBookmark size={20} className="text-gray-700" />
      }
    </button>
  );
};

export default Bookmarking;
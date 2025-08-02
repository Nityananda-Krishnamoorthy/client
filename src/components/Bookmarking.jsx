import React, { useState } from 'react';
import axios from 'axios';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Bookmarking = ({ post = {}, onPostUpdate = () => {} }) => {
  const [loading, setLoading] = useState(false);
  const token = useSelector(state => state?.user?.currentUser?.token);

  const toggleBookmark = async () => {
    if (!token || loading) return;

    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_API_URL}/posts/${post?._id}/bookmarks`;
      const method = post?.isBookmarked ? 'delete' : 'post';

      const { data } = await axios[method](url, {}, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      // Update bookmark status
      onPostUpdate({
        ...post,
        bookmarks: data?.bookmarks || [],
        isBookmarked: data?.isBookmarked ?? post?.isBookmarked,
      });
    } catch (err) {
      console.error('Error while bookmarking post:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      disabled={loading}
      title={post?.isBookmarked ? "Remove Bookmark" : "Bookmark this post"}
      aria-label={post?.isBookmarked ? "Remove bookmark" : "Bookmark post"}
      className={`bookmark-btn transition duration-150 ease-in-out ${
        post?.isBookmarked ? 'text-blue-500' : 'text-gray-500'
      } hover:text-blue-600 disabled:opacity-50`}
    >
      {post?.isBookmarked ? <FaBookmark size={20} /> : <FaRegBookmark size={20} />}
    </button>
  );
};

export default Bookmarking;

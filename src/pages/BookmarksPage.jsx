import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Feed from '../components/FeedItems';
import { useNavigate } from 'react-router-dom';

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const navigate = useNavigate();

  const getBookmarks = async () => {
    setError('');
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/bookmarks`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBookmarks(response?.data?.bookmarks || []);
    } catch (err) {
      setError('Failed to load bookmarks.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) getBookmarks();
  }, [token]);

  return (
    <section className="w-full min-h-screen ">
      {/* Header */}
      <div className="flex items-center justify-between max-w-5xl mx-auto mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm px-3 py-1 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
        >
          ← Back
        </button>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Bookmarks</h2>
        <div /> {/* placeholder for alignment */}
      </div>

      {/* States */}
      {isLoading ? (
        <div className="text-center text-gray-600 dark:text-gray-300 text-lg">Loading bookmarked posts...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : bookmarks?.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">No Bookmarked Posts</div>
      ) : (
        // Bookmarks Grid
        <div className="grid gap-3 max-w-5xl mx-auto grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark._id}
              className="rounded overflow-hidden  transition"
            >
              <Feed post={bookmark} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default BookmarksPage;

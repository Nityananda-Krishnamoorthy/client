import { useEffect, useState } from 'react';
import axios from 'axios';

const Suggestion = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSuggestions = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/suggested`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSuggestions(res.data);
    } catch (err) {
      console.error("Failed to fetch suggestions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users/${userId}/follow`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Remove followed user from suggestions list
      setSuggestions(prev => prev.filter(user => user._id !== userId));
    } catch (err) {
      console.error("Follow error:", err);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  if (loading) return <p>Loading suggestions...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">People You May Know</h2>
      {suggestions.length === 0 ? (
        <p className="text-gray-500">No suggestions available</p>
      ) : (
        suggestions.map(user => (
          <div
            key={user._id}
            className="p-4 border rounded-md flex justify-between items-center shadow-sm"
          >
            <div className="flex items-center gap-3">
              <img
                src={user.profilePhoto || '/default-avatar.png'}
                alt={user.userName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{user.userName}</p>
                <p className="text-sm text-gray-500">{user.bio || "No bio"}</p>
              </div>
            </div>
            <button
              onClick={() => handleFollow(user._id)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Follow
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Suggestion;

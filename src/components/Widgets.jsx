import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const RightSidebar = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showRequests, setShowRequests] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const token = useSelector(state => state?.user?.currentUser?.token);
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch pending requests
  const fetchFriendRequests = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/me/pending-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriendRequests(res.data || []);
    } catch (err) {
      console.error("Failed to fetch friend requests", err);
    }
  };

  // Fetch user suggestions
  const fetchSuggestions = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/suggested`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuggestions(res.data || []);
    } catch (err) {
      console.error("Failed to fetch suggestions", err);
    }
  };

  // Accept or reject friend request
  const handleRequestResponse = async (username, action) => {
    if (!username || !["accept", "reject"].includes(action)) return;
    try {
      await axios.post(
        `${API_URL}/users/${username}/follow-requests`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFriendRequests(prev => prev.filter(user => user?.userName !== username));
    } catch (err) {
      console.error(`Failed to ${action} request`, err);
    }
  };

  // Follow suggestion
  const handleFollow = async (username) => {
    if (!username) return;
    try {
      await axios.post(
        `${API_URL}/users/${username}/follow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuggestions(prev => prev.filter(user => user.userName !== username));
    } catch (err) {
      console.error("Failed to follow user", err);
    }
  };

  // Initial load
  useEffect(() => {
    if (token) {
      fetchFriendRequests();
      fetchSuggestions();
    }
  }, [token]);

  return (
    <div className="w-full max-w-xs mt-4 px-4 py-6 bg-white dark:bg-[#282c35] rounded-lg shadow-md space-y-6">
      {/* Friend Requests */}
      <section className="space-y-3">
        <div className="flex items-center justify-between cursor-pointer py-2" onClick={() => setShowRequests(!showRequests)}>
          <h3 className="text-lg font-semibold">Friend Requests</h3>
          {showRequests ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>

        {showRequests && (
          <div className="space-y-3">
            {friendRequests.length === 0 ? (
              <p className="text-sm text-gray-500 py-2">No pending requests</p>
            ) : (
              friendRequests.map(user => (
                <div key={user?._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1f1f1f] rounded-lg hover:bg-gray-100 dark:hover:bg-[#2b2b2b] transition">
                  <Link to={`/users/${user?._id}`} className="flex items-center space-x-3 hover:underline">
                    <img
                      src={user?.profilePhoto || "/default-avatar.png"}
                      alt={user?.userName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white"
                    />
                    <div>
                      <p className="font-medium text-sm">@{user?.userName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user?.fullName}</p>
                    </div>
                  </Link>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleRequestResponse(user?.userName, "accept")}
                      className="p-1.5 rounded-full bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 transition"
                      title="Accept"
                    >
                      <ChevronUp className="text-green-600" size={16} />
                    </button>
                    <button
                      onClick={() => handleRequestResponse(user?.userName, "reject")}
                      className="p-1.5 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 transition"
                      title="Reject"
                    >
                      <ChevronDown className="text-red-600" size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* Suggestions */}
      <section className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between cursor-pointer py-2" onClick={() => setShowSuggestions(!showSuggestions)}>
          <h3 className="text-lg font-semibold">Suggestions</h3>
          {showSuggestions ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>

        {showSuggestions && (
          <div className="space-y-3">
            {suggestions.length === 0 ? (
              <p className="text-sm text-gray-500 py-2">No suggestions</p>
            ) : (
              suggestions.map(user => (
                <div key={user?._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1f1f1f] rounded-lg hover:bg-gray-100 dark:hover:bg-[#2b2b2b] transition">
                  <Link to={`/users/${user?.userName}`} className="flex items-center space-x-3 hover:underline">
                    <img
                      src={user?.profilePhoto || "/default-avatar.png"}
                      alt={user?.userName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white"
                    />
                    <div>
                      <p className="font-medium text-sm">@{user?.userName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Suggested for you</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => handleFollow(user?.userName)}
                    className="px-3 py-1.5 text-xs bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                  >
                    Follow
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default RightSidebar;

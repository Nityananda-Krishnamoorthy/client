// RightSidebar.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useSelector } from "react-redux";

const RightSidebar = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showRequests, setShowRequests] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const token = useSelector(state => state?.user?.currentUser?.token)

  const API_URL = import.meta.env.VITE_API_URL;

  // ===================== FETCH FRIEND REQUESTS =====================
  const fetchFriendRequests = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/follow-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriendRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch friend requests", err);
    }
  };

  // ===================== FETCH SUGGESTIONS =====================
  const fetchSuggestions = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/suggested`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuggestions(res.data);
    } catch (err) {
      console.error("Failed to fetch suggestions", err);
    }
  };

  // ===================== ACCEPT / REJECT REQUEST =====================
  const handleRequestResponse = async (username, action) => {
    try {
      await axios.post(
        `${API_URL}/users/${username}/follow-requests`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh friend requests after action
      fetchFriendRequests();
    } catch (err) {
      console.error(`Failed to ${action} follow request`, err);
    }
  };

  // ===================== FOLLOW USER =====================
  const handleFollow = async (userId) => {
    try {
      await axios.post(
        `${API_URL}/users/${userId}/follow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Optionally remove from suggestions
      setSuggestions((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      console.error("Failed to follow user", err);
    }
  };

  // ===================== INIT FETCH =====================
  useEffect(() => {
    fetchFriendRequests();
    fetchSuggestions();
  }, []);

  return (
    <div className="w-full max-w-xs px-4 py-6 bg-white rounded-lg shadow-md space-y-6">
      {/* Friend Requests */}
      <div className="space-y-2">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowRequests(!showRequests)}
        >
          <h3 className="text-lg font-semibold">Friend Requests</h3>
          {showRequests ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>

        {showRequests && (
          <div className="space-y-3 pt-1">
            {friendRequests.length === 0 ? (
              <p className="text-sm text-gray-500">No pending requests</p>
            ) : (
              friendRequests.map((user) => (
                <div
                  key={user?._id}
                  className="flex items-center justify-between bg-gray-50 rounded px-3 py-2"
                >
                  <div className="flex items-center space-x-2">
                    <img
                      src={user?.profilePhoto}
                      alt={user?.userName}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-medium">@{user?.userName}</span>
                  </div>
                  <div className="space-x-1">
                    <button
                      onClick={() => handleRequestResponse(user?.userName, "accept")}
                      className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => handleRequestResponse(user?.userName, "reject")}
                      className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="space-y-2 pt-4 border-t border-gray-200">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowSuggestions(!showSuggestions)}
        >
          <h3 className="text-lg font-semibold">Suggestions</h3>
          {showSuggestions ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>

        {showSuggestions && (
          <div className="space-y-3 pt-1">
            {suggestions.length === 0 ? (
              <p className="text-sm text-gray-500">No suggestions</p>
            ) : (
              suggestions.map((user) => (
                <div
                  key={user?._id}
                  className="flex items-center justify-between bg-gray-50 rounded px-3 py-2"
                >
                  <div className="flex items-center space-x-2">
                    <img
                      src={user?.profilePhoto}
                      alt={user?.userName}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-medium">@{user?.userName}</span>
                  </div>
                  <button
                    onClick={() => handleFollow(user?._id)}
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Follow
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;

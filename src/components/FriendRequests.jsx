import { useEffect, useState } from 'react';
import axios from 'axios';

const FriendRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingRequests = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/me/pending-requests`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setRequests(res.data); // Array of user objects who sent requests
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (username, action) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users/${username}/follow-requests`, 
        { action },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Optimistically update UI
      setRequests(prev => prev.filter(user => user.userName !== username));
    } catch (err) {
      console.error(`Error handling ${action} for ${username}:`, err);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  if (loading) return <p>Loading friend requests...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Friend Requests</h2>
      {requests.length === 0 ? (
        <p className="text-gray-500">No pending requests</p>
      ) : (
        requests.map((user) => (
          <div
            key={user._id}
            className="p-4 border rounded-md flex justify-between items-center shadow-sm"
          >
            <div className="flex items-center gap-3">
              <img
                src={user.profilePic || '/default-avatar.png'}
                alt={user.userName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-medium">{user.userName}</span>
            </div>
            <div className="flex gap-2">
              <button
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                onClick={() => handleAction(user.userName, 'accept')}
              >
                Accept
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={() => handleAction(user.userName, 'reject')}
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FriendRequests;

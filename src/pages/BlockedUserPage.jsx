import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const BlockedUsersPage = () => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const token = useSelector(state => state?.user?.currentUser?.token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlockedUsers = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/me/blocked-users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBlockedUsers(res.data.blockedUsers);
      } catch (err) {
        console.error('Failed to fetch blocked users:', err);
      }
    };

    fetchBlockedUsers();
  }, [token]);

  const unblockUser = async (userId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/users/${userId}/block`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBlockedUsers(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      console.error('Failed to unblock user:', err);
    }
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-12 md:px-6 lg:px-8">
      <button
        className="mb-6 text-sm text-indigo-600 hover:underline font-medium flex items-center gap-1"
        onClick={() => navigate(-1)}
      >
        <span className="text-lg">&larr;</span> Back
      </button>

      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Blocked Users</h1>

      {blockedUsers.length === 0 ? (
        <p className="text-gray-500">You haven’t blocked anyone yet.</p>
      ) : (
        <ul className="space-y-4">
          {blockedUsers.map((user) => (
            <li
              key={user._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between bg-white shadow-sm border rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex items-center gap-4 mb-3 sm:mb-0">
                <img
                  src={user?.profilePhoto}
                  alt={user?.userName}
                  className="w-12 h-12 rounded-full object-cover border"
                />
                <div>
                  <p className="font-medium text-gray-800">{user?.userName}</p>
                  <p className="text-sm text-gray-500">{user?.fullName || 'User'}</p>
                </div>
              </div>

              <button
                onClick={() => unblockUser(user._id)}
                className="mt-2 sm:mt-0 text-sm px-4 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Unblock
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default BlockedUsersPage;

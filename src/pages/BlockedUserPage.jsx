import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const BlockedUsersPage = () => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const token = useSelector(state => state?.user?.currentUser?.token);
  const userName = useSelector(state => state?.user?.currentUser?.userName)

  useEffect(() => {
    const fetchBlockedUsers = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/blocked-users`, {
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

const unblockUser = async () => {

  try {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/users/${userName}/block`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setBlockedUsers(prev => prev.filter(u => u.userName !== userName));
  } catch (err) {
    console.error('Failed to unblock user:', err);
  }
};


  return (
    <section className="w-full max-w-3xl mx-auto py-8 px-4">
        <button className="back-button mt-0 pt-0" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      <h2 className="text-xl font-bold mb-4">Blocked Users</h2>
      {blockedUsers.length === 0 ? (
        <p className="text-gray-500">You haven't blocked anyone.</p>
      ) : (
        <ul className="space-y-4">
          {blockedUsers.map(user => (
            <li key={user._id} className="flex items-center justify-between bg-gray-100 p-3 rounded">
              <div className="flex items-center gap-3">
                <img src={user?.profilePhoto} alt={user?.userName} className="w-10 h-10 rounded-full" />
                <span>{user?.userName}</span>
              </div>
              <button
                onClick={() => unblockUser(user._id)}
                className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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

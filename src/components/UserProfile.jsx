// src/components/UserProfile.jsx
import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { LuUpload } from 'react-icons/lu';
import { FaCheck, FaEllipsisH } from 'react-icons/fa';
import EditProfileModal from './EditProfileModal';
import UserPosts from '../components/UserPosts';
import { userActions } from '../store/user-slice';
import { Link } from 'react-router-dom';



const UserProfile = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const token = currentUser?.token;
  const loggedInUserId = currentUser?.id;

  const { id: userId } = useParams();
  const dispatch = useDispatch();

  const [user, setUser] = useState(null);
  const [followUser, setFollowUser] = useState(false);
  const [avatar, setAvatar] = useState('');
  const [avatarTouched, setAvatarTouched] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [showBlockMenu, setShowBlockMenu] = useState(false);

  const getUser = useCallback(async () => {
    if (!token || !userId) return;

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
      console.log(res.data);
      setAvatar(res.data?.profilePhoto || '');

      const hasFollowed = Array.isArray(res.data?.followers)
        ? res.data.followers.includes(loggedInUserId)
        : false;

      setFollowUser(hasFollowed);
    } catch (err) {
      console.error('Fetch user error', err);
    }
  }, [token, userId, loggedInUserId]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const changeAvatarHandler = async (e) => {
    e.preventDefault();
    if (!avatar || !token) return;

    const formData = new FormData();
    formData.append('avatar', avatar);

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/me/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const updatedUser = res.data?.updatedUser;
      if (updatedUser) {
        setUser((prev) => ({ ...prev, ...updatedUser }));
        dispatch(userActions.changeCurrentUser({ ...updatedUser, token }));
      }

      setAvatarTouched(false);
    } catch (err) {
      console.error('Avatar update failed', err);
    }
  };

  const followUnfollowUser = async () => {
    if (!token || !user?.userName) return;

    try {
      const url = `${import.meta.env.VITE_API_URL}/users/${user.userName}/follow`;
      const method = followUser ? 'delete' : 'post';

      const res = await axios({
        method,
        url,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.status === 'success' || method === 'delete') {
        setFollowUser(!followUser);
      } else {
        alert('Follow request sent for private account.');
      }

      getUser();
    } catch (error) {
      console.error('Follow/unfollow error', error);
    }
  };

  const handleBlockUnblock = async () => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/users/${user.userName}/block`;
      const method = user?.isBlocked ? 'delete' : 'post';

      await axios({
        method,
        url,
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowBlockMenu(false);
      getUser();
    } catch (err) {
      console.error('Error toggling block status:', err);
    }
  };

  const isCurrentUser = user?._id === loggedInUserId;

  if (user === null) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  return (
    <section className="w-full py-12 max-w-2xl mx-auto px-4 sm:px-6 ">
      {!isCurrentUser && (
        <div className="relative right-0 mt-2 w-32">
          <button onClick={() => setShowBlockMenu(!showBlockMenu)}>
            <FaEllipsisH />
          </button>
          {showBlockMenu && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-md z-10">
              <button
                onClick={handleBlockUnblock}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              >
                {user?.isBlocked ? 'Unblock' : 'Block'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Avatar */}
      <form
        onSubmit={changeAvatarHandler}
        encType="multipart/form-data"
        className="relative w-28 h-28 rounded-full overflow-hidden mx-auto group"
      >
        <img
          src={avatarTouched ? URL.createObjectURL(avatar) : user?.profilePhoto}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
        {!avatarTouched ? (
          <label
            htmlFor="avatar"
            className="absolute inset-0 bg-black bg-opacity-50 text-white flex justify-center items-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
          >
            <LuUpload className="text-2xl" />
          </label>
        ) : (
          <button
            type="submit"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white w-10 h-10 flex items-center justify-center rounded-full"
          >
            <FaCheck />
          </button>
        )}
        <input
          type="file"
          id="avatar"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            setAvatar(e.target.files[0]);
            setAvatarTouched(true);
          }}
        />
      </form>

      {/* User Info */}
      <div className="text-center mt-4 space-y-1">
        <h2 className="text-xl font-semibold">{user?.fullName}</h2>
        <p className="text-gray-500">@{user?.userName}</p>
      </div>

      {/* Stats */}
      <ul className="grid grid-cols-3 gap-4 mt-6 text-center">
        <li>
          <h4 className="text-lg font-semibold">{user?.following?.length || 0}</h4>
          <small className="text-gray-500">Following</small>
        </li>
        <li>
          <h4 className="text-lg font-semibold">{user?.followers?.length || 0}</h4>
          <small className="text-gray-500">Followers</small>
        </li>
        <li>
          <h4 className="text-lg font-semibold">{user?.posts?.length || 0}</h4>
          <small className="text-gray-500">Posts</small>
        </li>
      </ul>
      {/* Bio */}
      <div className="mt-6 text-center px-4">
        <p className="text-gray-600  bold whitespace-pre-wrap">
          {user?.bio || "No bio available."}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {isCurrentUser ? (
          <button
            onClick={() => setEditOpen(true)}
            className="bg-[--color-primary] text-white px-4 py-2 rounded-md"
          >
            Edit Profile
          </button>
        ) : (
          <>
          <button
            onClick={followUnfollowUser}
            className={`px-4 py-2 rounded-md ${
              followUser ? 'bg-gray-300 px-5 py-2' : 'bg-[--color-gray-800] px-5 py-2 text-white'
            }`}
          >
            {followUser ? 'Unfollow' : 'Follow'}
          </button>
          <Link to={`/messages/${userId}`} className="px-5 py-2 border border-gray-100 bg-[--color-primary] text-white rounded-md text-md hover:bg-gray-100 ">
              Message
            </Link>
            </>

        )}
      </div>
      

      {/* Edit Profile Modal */}
      {editOpen && (
  <EditProfileModal
    open={editOpen}
    onClose={() => setEditOpen(false)}
    userData={user}
    onProfileUpdated={getUser}
  />
)}
{/* <Divider primary="Full width variant below" className='dark:bg-white bg-black'/> */}
      {/* Posts Section */}
      <UserPosts />
    </section>
  );
};

export default UserProfile;

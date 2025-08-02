import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegCommentDots, FaEllipsisH } from 'react-icons/fa';
import { IoMdShare } from 'react-icons/io';

import Bookmarking from './Bookmarking';
import ProfileImage from './ProfileImage';
import LikeDislikePost from './LikeDislikePost';
import formatTimeAgo from '../helpers/TimeAgo';
import TrimText from '../helpers/TrimText';

const Feed = ({ post, onDeletePost, setPost, onNewPost }) => {
  const [creator, setCreator] = useState({});
  const [showMenu, setShowMenu] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const navigate = useNavigate();

  const token = useSelector((state) => state.user.currentUser?.token);
  const userId = useSelector((state) => state.user.currentUser?._id);
  const creatorId = post?.creator?._id || post?.creator;

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const getPostCreator = async () => {
      if (!creatorId || post?.creator?.userName) return;
      try {
        const { data } = await axios.get(`${API_URL}/users/${creatorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCreator(data);
      } catch (err) {
        console.error('Error fetching creator:', err);
      }
    };

    getPostCreator();
  }, [creatorId, token]);

  const creatorData = post?.creator?.fullName ? post.creator : creator;

  const handlePostUpdate = (updatedPost) => {
    setPost?.((prev) =>
      Array.isArray(prev)
        ? prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
        : updatedPost
    );
  };

  const handleShare = async () => {
    try {
      const { data } = await axios.post(
        `${API_URL}/posts/${post._id}/share`,
        { message: shareMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      handlePostUpdate(data.originalPost);
      onNewPost?.(data.sharedPost);

      setIsSharing(false);
      setShareMessage('');
      alert('Post shared successfully!');
    } catch (err) {
      console.error('Sharing failed:', err);
      alert('Failed to share post.');
    }
  };

  const deletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await axios.delete(`${API_URL}/posts/${post._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDeletePost?.(post._id);
      setShowMenu(false);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const recoverPost = async () => {
    try {
      const { data } = await axios.patch(
        `${API_URL}/posts/${post._id}/recover`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onDeletePost?.(post._id);
      alert(data?.message || 'Post recovered');
    } catch (err) {
      console.error('Recover failed:', err);
    }
  };

  const deletePostPermanently = async () => {
    if (!window.confirm('Permanently delete this post? This cannot be undone.')) return;

    try {
      await axios.delete(`${API_URL}/posts/${post._id}/permanent`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDeletePost?.(post._id);
      alert('Post permanently deleted.');
    } catch (err) {
      console.error('Permanent delete failed:', err);
    }
  };

  return (
    <article className="feed">
      {/* Header */}
      <header className="feed__header">
        <Link to={`/users/${creatorId}`} className="feed__header-profile">
          <ProfileImage image={creatorData?.profilePhoto} />
          <div className="feed__header-details">
            <h4>{creatorData?.fullName}</h4>
            <small>{formatTimeAgo(post?.createdAt)}</small>
          </div>
        </Link>

        {userId === creatorId && (
          <div className="feed__header-actions">
            <button onClick={() => setShowMenu((prev) => !prev)}>
              <FaEllipsisH />
            </button>
            {showMenu && (
              <div className="feed__header-menu">
                <button onClick={() => navigate(`/edit-post/${post._id}`)}>Edit</button>
                {!post?.deletedAt ? (
                  <button onClick={deletePost}>Move to Trash</button>
                ) : (
                  <>
                    <button onClick={recoverPost}>Recover</button>
                    <button onClick={deletePostPermanently}>Delete Permanently</button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </header>

      {/* Body */}
      <Link to={`/post/${post._id}`} className="feed__body">
        {post?.media?.length > 0 && (
          <div className="feed__media-scroll" onClick={(e) => e.stopPropagation()}>
            {post.media.map((media, idx) => (
              <div className="feed__media-item" key={idx}>
                {media.type === 'image' || media.type === 'gif' ? (
                  <img src={media.url} alt={`Media ${idx}`} className="rounded-lg w-full h-[250px] object-cover" />
                ) : media.type === 'video' ? (
                  <video controls src={media.url} className="rounded-lg w-full h-[250px] object-cover" />
                ) : media.type === 'audio' ? (
                  <audio controls className="w-full">
                    <source src={media.url} type="audio/mpeg" />
                  </audio>
                ) : null}
              </div>
            ))}
          </div>
        )}

        {post?.body && (
          <p className="mt-2">
            <TrimText item={post.body} maxLength={180} />
          </p>
        )}
      </Link>

      {/* Tags & Location */}
      <div className="feed__tags-location">
        {post?.tags?.length > 0 && (
          <div className="feed__tags">
            {(Array.isArray(post.tags) ? post.tags : post.tags.split(',')).map((tag, i) => (
              <span key={i} className="feed__tag">#{tag.trim()}</span>
            ))}
          </div>
        )}
        {post?.location && <div className="feed__location">📍 {post.location}</div>}
      </div>

      {/* Footer */}
      <footer className="feed__footer">
        <div className="feed__footer-actions">
          <div className="gap">
            <LikeDislikePost post={post} onPostUpdate={handlePostUpdate} userId={userId} />
            <Link to={`/post/${post._id}`} className="feed__footer-comments">
              <FaRegCommentDots size={20} />
            </Link>
            <small>{post?.comments?.length || 0}</small>
          </div>

         {isSharing && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
    <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-lg p-5 space-y-4 animate-fadeIn">
      
      {/* Header */}
      {/* <h2 className="text-base font-semibold text-gray-800 dark:text-white">
        Share this Post
      </h2> */}

      {/* Textarea */}
      <textarea
        value={shareMessage}
        onChange={(e) => setShareMessage(e.target.value)}
        placeholder="Say something about this post..."
        rows={3}
        className="w-full text-sm rounded-md p-1 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Action buttons */}
      <div className="flex justify-end space-x-1">
        <button
          onClick={() => setIsSharing(false)}
          className="px-1 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleShare}
          className="px-1 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-md transition"
        >
          Share
        </button>
      </div>
    </div>
  </div>
)}





          <button className="feed__footer-share" onClick={() => setIsSharing(true)}>
            <IoMdShare />
          </button>
        </div>

        <div className="feed__footer-left">
          <Bookmarking post={post} onPostUpdate={handlePostUpdate} />
        </div>
      </footer>
    </article>
  );
};

export default Feed;

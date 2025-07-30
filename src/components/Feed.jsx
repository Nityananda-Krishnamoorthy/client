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

const Feed = ({ post, onDeletePost, setPost }) => {
  const [creator, setCreator] = useState({});
  const [showMenu, setShowMenu] = useState(false);

  const token = useSelector((state) => state?.user?.currentUser?.token);
  const userId = useSelector((state) => state?.user?.currentUser?.id);
  const navigate = useNavigate();

  const creatorId = post?.creator?._id || post?.creator;

  const handlePostUpdate = (updatedPost) => {
    setPost((prev) =>
      prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
  };

  const getPostCreator = async () => {
    if (!creatorId || post?.creator?.userName) return;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${creatorId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCreator(response?.data);
    } catch (err) {
      console.error('Error fetching creator:', err);
    }
  };

  useEffect(() => {
    getPostCreator();
  }, [creatorId, token]);

  const creatorData = post?.creator?.fullName ? post?.creator : creator;

  const deletePost = async () => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this post?');
      if (!confirmDelete) return;

      await axios.delete(`${import.meta.env.VITE_API_URL}/posts/${post?._id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (onDeletePost) onDeletePost(post?._id);
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const recoverPost = async () => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/posts/${post?._id}/recover`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      if (onDeletePost) onDeletePost(post?._id);
      alert(response?.data?.message || 'Post recovered!');
    } catch (err) {
      console.error('Error recovering post:', err);
    }
  };
  const deletePostPermanently = async () => {
  try {
    const confirmDelete = window.confirm(' Are you sure you want to permanently delete this post? This cannot be undone.');
    if (!confirmDelete) return;

    await axios.delete(`${import.meta.env.VITE_API_URL}/posts/${post?._id}/permanent`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    if (onDeletePost) onDeletePost(post?._id);
    alert('Post permanently deleted.');
  } catch (err) {
    console.error('Error permanently deleting post:', err);
    alert('Failed to delete post permanently.');
  }
};


  return (
    <article className="feed">
      <header className="feed__header">
        <Link to={`/users/${creatorId}`} className="feed__header-profile">
          <ProfileImage image={userId?.profilePhoto} />
          <div className="feed__header-details">
            <h4>{creatorData?.fullName}</h4>
            <small>{formatTimeAgo(post?.createdAt)}</small>
          </div>
        </Link>

        {userId === creatorId && (
          <div className="feed__header-actions">
            <button onClick={() => setShowMenu(!showMenu)}>
              <FaEllipsisH />
            </button>
            {showMenu && (
            <div className="feed__header-menu">
                <button onClick={() => navigate(`/edit-post/${post?._id}`)}>Edit</button>

                {!post?.deletedAt ? (
                <button onClick={deletePost}>Move to Trash</button>
                ) : (
                <>
                    <button onClick={recoverPost}>Recover</button>
                    <button onClick={deletePostPermanently}>Delete</button>
                </>
                )}
            </div>
            )}

          </div>
        )}
      </header>

      <Link to={`/post/${post._id}`} className="feed__body">
        {post?.media?.length > 0 && (
          <div className="feed__media-scroll " onClick={(e) => e.stopPropagation()}>
            {post?.media.map((media, index) => (
              <div className="feed__media-item " key={index}>
                {media.type === 'image' || media.type === 'gif' ? (
                  <img src={media.url} alt={`Post media ${index}`} 
                  className='w-full object-cover rounded-lg
                    h-[300px]
                    md:grid-cols-2:h-[250px]
                    lg:grid-cols-3:h-[220px]' />
                ) : media.type === 'video' ? (
                  <video controls src={media.url} 
                   className='w-full object-cover rounded-lg
                    h-[300px]
                    md:grid-cols-2:h-[250px]
                    lg:grid-cols-3:h-[220px]' />
                ) : media.type === 'audio' ? (
                  <audio controls>
                    <source src={media.url} type="audio/mpeg"
                     className='w-full object-cover rounded-lg
                    h-[300px]
                    md:grid-cols-2:h-[250px]
                    lg:grid-cols-3:h-[220px]' />
                    Your browser does not support the audio element.
                  </audio>
                ) : null}
              </div>
            ))}
          </div>
        )}

        {post?.body && (
          <p>
            <TrimText item={post?.body} maxLength={180} />
          </p>
        )}
      </Link>

      <div className="feed__tags-location ">
        {post?.tags?.length > 0 && (
          <div className="feed__tags h-2">
            {post.tags.map((tag, index) => (
              <span key={index} className="feed__tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
        {post?.location && (
          <div className="feed__location">📍 {post?.location}</div>
        )}
      </div>

      <footer className="feed__footer">
        <div className="feed__footer-actions">
          <div className="gap">
            <LikeDislikePost post={post} onPostUpdate={handlePostUpdate} userId={userId} />
            <Link to={`/post/${post?._id}`} className="feed__footer-comments">
              <FaRegCommentDots size={20} />
            </Link>
            <small>{post?.comments?.length || 0}</small>
          </div>
          <button className="feed__footer-share">
            <IoMdShare />
          </button>
        </div>
        <div className="feed__footer-left">
          <Bookmarking post={post} />
        </div>
      </footer>
    </article>
  );
};

export default Feed;

import React, { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
  deletePost, editPost, sharePost, 
  bookmarkPost, removeBookmark 
} from '../features/posts/postThunks';
import { FaEdit, FaTrash, FaShare, FaBookmark, FaRegBookmark } from 'react-icons/fa';

const PostOptionsMenu = ({ post, isOwner, onClose }) => {
  const dispatch = useDispatch();
  const menuRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      dispatch(deletePost(post._id));
      onClose();
    }
  };

  const handleShare = () => {
    dispatch(sharePost(post._id));
    onClose();
  };

  const handleBookmark = () => {
    if (isBookmarked) {
      dispatch(removeBookmark(post._id));
    } else {
      dispatch(bookmarkPost(post._id));
    }
    onClose();
  };

  return (
    <div ref={menuRef} className="post-options-menu">
      {isOwner && (
        <>
          <button onClick={() => {/* Open edit modal */}}>
            <FaEdit /> Edit Post
          </button>
          <button onClick={handleDelete}>
            <FaTrash /> Delete Post
          </button>
        </>
      )}
      <button onClick={handleShare}>
        <FaShare /> Share Post
      </button>
      <button onClick={handleBookmark}>
        {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
        {isBookmarked ? 'Remove Bookmark' : 'Save Post'}
      </button>
    </div>
  );
};

export default PostOptionsMenu;
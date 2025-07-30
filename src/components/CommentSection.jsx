import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ProfileImage from './ProfileImage';
import formatTimeAgo from '../helpers/TimeAgo';
import { FaTrash, FaPaperPlane } from 'react-icons/fa';
import { MdEditSquare } from 'react-icons/md';

const CommentSection = ({ postId, comments }) => {
  const [newComment, setNewComment] = useState('');
  const [postComments, setPostComments] = useState(comments || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
const [editText, setEditText] = useState('');

  const token = useSelector(state => state?.user?.currentUser?.token);
  const currentUser = useSelector(state => state?.user?.currentUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/posts/${postId}/comments`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setPostComments([response.data, ...postComments]);
      setNewComment('');
    } catch (err) {
      console.error('Comment error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleEditSubmit = async (commentId) => {
  if (!editText.trim()) return;

  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_API_URL}/posts/${postId}/comments/${commentId}`,
      { text: editText },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setPostComments(prev =>
      prev.map(comment =>
        comment._id === commentId ? { ...comment, text: response.data.text } : comment
      )
    );
    setEditCommentId(null);
    setEditText('');
  } catch (err) {
    console.error('Edit comment error:', err);
  }
};


  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/posts/${postId}/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setPostComments(postComments.filter(comment => comment._id !== commentId));
    } catch (err) {
      console.error('Delete comment error:', err);
    }
  };
  


  return (
    <div className="comment-section">
      <h3 className="comment-section__title">Comments ({postComments.length})</h3>
      
      <form onSubmit={handleSubmit} className="comment-form">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write your thoughts..."
          className="comment-form__input"
          disabled={isSubmitting}
        />
        <button 
          type="submit" 
          className="comment-form__button"
          disabled={!newComment.trim() || isSubmitting}
        >
          <FaPaperPlane />
        </button>
      </form>

    <div className="comments-list">
  {postComments.length === 0 ? (
    <div className="no-comments">
      <p>No comments yet. Be the first to share your thoughts!</p>
    </div>
  ) : (
    postComments.map(comment => {
      return (
        <div key={comment._id} className="comment">
          <div className="comment__avatar">
            <ProfileImage image={comment.user?.profilePhoto} small />
          </div>

          <div className="comment__content">
            <div className="comment__header">
            <div className="comment__author-info">
                <strong className="comment__author">{comment.user?.fullName}</strong>
                <span className="comment__timestamp">{formatTimeAgo(comment.createdAt)}</span>
            </div>

            {(
                comment.user === currentUser?.id ||
                comment.user?._id === currentUser?.id ||
                currentUser?.isAdmin
            ) && (
                <div className="comment__actions">
                <button
                    onClick={() => {
                    setEditCommentId(comment._id);
                    setEditText(comment.text);
                    }}
                    className="comment__edit-button"
                    aria-label="Edit comment"
                >
                    <MdEditSquare size={15} />
                </button>
                <button 
                    onClick={() => handleDelete(comment._id)}
                    className="comment__delete-button"
                    aria-label="Delete comment"
                >
                    <FaTrash size={13} />
                </button>
                </div>
            )}
            </div>

            {editCommentId === comment._id ? (
                <div className="comment__edit-form">
                    <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="comment__edit-input"
                    />
                    <div className="comment__edit-actions">
                    <button
                        onClick={() => handleEditSubmit(comment._id)}
                        className="comment__edit-save"
                    >
                        Save
                    </button>
                    <button
                        onClick={() => {
                        setEditCommentId(null);
                        setEditText('');
                        }}
                        className="comment__edit-cancel"
                    >
                        Cancel
                    </button>
                    </div>
                </div>
                ) : (
                <p className="comment__text">{comment.text}</p>
                )}
            </div>
        </div>
        );
    })
  )}
  </div>
</div>
);
};

export default CommentSection;
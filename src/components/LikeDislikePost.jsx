// components/LikeDislikePost.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import toast from 'react-hot-toast';
import { hasUserLikedPost } from '../helpers/posthelper'; // import helper

const LikeDislikePost = ({ post, onPostUpdate }) => {
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const userId = useSelector((state) => state?.user?.currentUser?.id);

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post?.likes?.length || 0);
  const [loading, setLoading] = useState(false);

  // Sync like state on mount/update
  useEffect(() => {
    if (post?.likes && userId) {
      setIsLiked(hasUserLikedPost(post.likes, userId));
      setLikesCount(post.likes.length);
    }
  }, [post?.likes, userId]);

  const handleLikeDislike = async (actionType) => {
    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_API_URL}/posts/${post?._id}/like`;

      const res = actionType === 'like'
        ? await axios.post(url, {}, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          })
        : await axios.delete(url, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          });

      const updatedLikes = res?.data?.likes || [];

      setIsLiked(hasUserLikedPost(updatedLikes, userId));
      setLikesCount(updatedLikes.length);

      // Optional: callback to parent to update global post list
      onPostUpdate?.({ ...post, likes: updatedLikes });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update like');
    } finally {
      setLoading(false);
    }
  };

 const toggleLike = () => {
  if (loading) return;

  // Optimistically lock button
  setLoading(true);

  if (isLiked) {
    handleLikeDislike('unlike');
  } else {
    handleLikeDislike('like');
  }
};


  return (
    <div
      className={`feed__footer-like cursor-pointer ${loading ? 'opacity-50 pointer-events-none' : ''}`}
      onClick={toggleLike}
      title={isLiked ? 'Unlike' : 'Like'}
    >
      {isLiked ? <AiFillHeart size={23} color="red" /> : <AiOutlineHeart size={23} />}
      <small>{likesCount}</small>
    </div>
  );
};

export default LikeDislikePost;

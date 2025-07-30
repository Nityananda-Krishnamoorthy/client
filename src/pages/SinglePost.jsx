import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Feed from '../components/Feed';
import CommentSection from '../components/CommentSection';

const SinglePost = () => {
  const { id } = useParams();
  console.log('Post ID:', id);
  const navigate = useNavigate();
  const token = useSelector(state => state?.user?.currentUser?.token);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/posts/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPost(response.data);
        console.log(token)
      } catch (err) {
          const status = err.response?.status;
          if (status === 403) {
            setError('Access denied. You may be blocked or this post is private.');
          } else if (status === 404) {
            setError('Post not found.');
          } else {
            setError('Something went wrong.');
          }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, token]);
  

  if (loading) {
    return <div className="center">Loading post...</div>;
  }

  if (error) {
    return <div className="center">{error}</div>;
  }

  if (!post) {
    return <div className="center">Post not found</div>;
  }

  return (
    <div className="singlePost">
      <button className="back-button" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      
      <Feed post={post} style={{ width: "800px", height: "400px"  }} />
      <CommentSection postId={post._id} comments={post.comments} />
    </div>
  );
};


export default SinglePost;
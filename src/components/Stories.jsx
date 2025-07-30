import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import ProfileImage from './ProfileImage';

const Stories = ({ userId}) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/stories/timeline`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setStories(response.data);
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStories();
  }, []);

  if (loading) {
    return <div className="stories-loading">Loading stories...</div>;
  }

  return (
    <div className="stories-container">
      <div className="stories">
        {/* User's own story */}
        <div className="story your-story">
          <Link to={`/stories/create`}>
            <div className="story-avatar">
              <ProfileImage />
              <div className="add-story">
                <FaPlus />
              </div>
            </div>
            <span>Your Story</span>
          </Link>
        </div>
        
        {/* Friends' stories */}
       {stories.map(story => {
        const isOwnStory = story.user._id === userId;
        return (
            <div className={`story ${isOwnStory ? 'own-story' : ''}`} key={story._id}>
            <Link to={`/stories/${story._id}`}>
                <div className={`story-avatar ${story.seen ? 'seen' : 'unseen'}`}>
                <ProfileImage image={story.user.profilePhoto} />
                </div>
                <span>{story.user.userName}</span>
            </Link>
            </div>
        );
        })}

      </div>
    </div>
  );
};

export default Stories;
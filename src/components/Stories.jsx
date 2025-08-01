import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import ProfileImage from './ProfileImage';
import StoryViewer from './StoryViewer';
import { useSelector } from 'react-redux';

const Stories = () => {
  const [timelineStories, setTimelineStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStoryId, setSelectedStoryId] = useState(null);
  const [userStories, setUserStories] = useState([]);
  const token = useSelector(state => state?.user?.currentUser?.token);
  const userId = useSelector(state => state?.user?.currentUser?._id);

  useEffect(() => {

     if (!token || !userId) return;

const fetchStories = async () => {
  try {
    const [timelineRes, userRes] = await Promise.all([
      axios.get(`${import.meta.env.VITE_API_URL}/stories/timeline`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(`${import.meta.env.VITE_API_URL}/stories/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    ]);
    
    setTimelineStories(timelineRes.data);
    setUserStories(userRes.data);
  } catch (error) {
    console.error('Error fetching stories:', error);
  } finally {
    setLoading(false);
  }
};
    
    fetchStories();
  }, [token, userId]);

  const openStory = (storyId) => {
    setSelectedStoryId(storyId);
  };

  const closeStoryViewer = () => {
    setSelectedStoryId(null);
  };

  if (loading) {
    return <div className="stories-loading">Loading stories...</div>;
  }

  // Group stories by user
  const groupedStories = timelineStories.reduce((acc, story) => {
    const userId = story.user._id;
    if (!acc[userId]) {
      acc[userId] = {
        user: story.user,
        stories: [],
        hasUnseen: false
      };
    }
    
    acc[userId].stories.push(story);
    
    // Check if any story is unseen by current user
    if (!acc[userId].hasUnseen) {
      acc[userId].hasUnseen = !story.viewers.some(viewer => viewer.toString() === userId);
    }
    
    return acc;
  }, {});

  return (
    <div className="stories-container">
      <div className="stories">
        {/* User's own story */}
        <div className="story your-story">
          <Link to={userStories.length > 0 ? "#" : "/stories/create"} onClick={(e) => {
            if (userStories.length > 0) {
              e.preventDefault();
              openStory(userStories[0]._id);
            }
          }}>
            <div className="story-avatar">
              <ProfileImage image={userStories[0]?.user?.profilePhoto} />
              {userStories.length === 0 && (
                <div className="add-story">
                  <FaPlus />
                </div>
              )}
            </div>
            <span>Your Story</span>
          </Link>
        </div>
        
        {/* Friends' stories */}
        {Object.values(groupedStories).map((group, index) => (
          <div 
            className={`story ${group.hasUnseen ? 'unseen' : 'seen'}`} 
            key={group.user._id}
            onClick={() => openStory(group.stories[0]._id)}
          >
            <div className="story-avatar">
              <ProfileImage image={group.user.profilePhoto} />
            </div>
            <span>{group.user.userName}</span>
          </div>
        ))}
      </div>
      
      {selectedStoryId && (
        <StoryViewer 
          storyId={selectedStoryId} 
          onClose={closeStoryViewer} 
        />
      )}
    </div>
  );
};

export default Stories;
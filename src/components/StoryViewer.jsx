import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Stories from 'react-insta-stories';
import { useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';

const StoryViewer = ({ storyId, onClose }) => {
  const [story, setStory] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allStories, setAllStories] = useState([]);
  const token = useSelector(state => state?.user?.currentUser?.token);
  const userId = useSelector(state => state?.user?.currentUser?._id);

  useEffect(() => {
    const fetchStories = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/stories/timeline`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setAllStories(response.data);
    
    const initialIndex = response.data.findIndex(s => s._id === storyId);
    setCurrentIndex(initialIndex >= 0 ? initialIndex : 0);
  } catch (error) {
    console.error('Error fetching stories:', error);
  }
};


    fetchStories();
  }, [storyId, token]);

  useEffect(() => {
    if (allStories.length > 0 && currentIndex >= 0) {
      setStory(allStories[currentIndex]);
      
      // Mark story as seen
      if (!allStories[currentIndex].viewers.includes(userId)) {
        markStoryAsSeen(allStories[currentIndex]._id);
      }
    }
  }, [currentIndex, allStories, userId]);

 const markStoryAsSeen = async (storyId) => {
  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/stories/${storyId}/seen`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    setAllStories(prev => prev.map(s => 
      s._id === storyId ? {...s, viewers: [...s.viewers, userId]} : s
    ));
  } catch (error) {
    console.error('Error marking story as seen:', error);
  }
};

  const handleStoryChange = (newIndex) => {
    setCurrentIndex(newIndex);
  };

  const handleAllStoriesEnd = () => {
    onClose();
  };

  if (!story) return <div className="story-viewer-loading">Loading stories...</div>;

  const formattedStories = allStories.map(s => ({
    url: s.media,
    type: s.type,
    duration: 5000,
    header: {
      heading: s.user.userName,
      subheading: new Date(s.createdAt).toLocaleTimeString(),
      profileImage: s.user.profilePhoto
    }
  }));

  return (
    <div className="story-viewer-overlay">
      <button className="story-close-btn" onClick={onClose}>
        <FaTimes size={24} />
      </button>
      
      <Stories
        stories={formattedStories}
        currentIndex={currentIndex}
        onStoryEnd={(index, count) => {
          if (index + 1 >= count) handleAllStoriesEnd();
        }}
        onAllStoriesEnd={handleAllStoriesEnd}
        onStoryStart={handleStoryChange}
        keyboardNavigation
        defaultInterval={5000}
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default StoryViewer;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Avatar from './Avatar';
import StoryViewer from './StoryViewer';
import CreateStory from './CreateStory';


const Stories = () => {
  const [timelineStories, setTimelineStories] = useState([]);
  const [userStories, setUserStories] = useState([]);
  const [selectedStoryId, setSelectedStoryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState('');

  const token = useSelector((state) => state?.user?.currentUser?.token);
  const currentUserId = useSelector((state) => state?.user?.currentUser?._id);
  const currentUser = useSelector((state) => state?.user?.currentUser);

  // Fetch stories
  useEffect(() => {
    if (!token || !currentUserId) {
      setLoading(false);
      return;
    }

    const fetchStories = async () => {
      try {
        setLoading(true);
        setError('');
        
        const [timelineRes, userRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/stories/timeline`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/stories/user/${currentUserId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        
        // Mock data in case API doesn't return anything
        const mockTimeline = [
          { _id: '1', user: { _id: '2', userName: 'sloanejoie', fullName: 'Sloane Joie', profilePhoto: '' } },
          { _id: '2', user: { _id: '3', userName: 'bobbydunn', fullName: 'Bobby Dunn', profilePhoto: '' } },
          { _id: '3', user: { _id: '4', userName: 'mgsiegler', fullName: 'MG Siegler', profilePhoto: '' } },
          { _id: '4', user: { _id: '5', userName: 'craigr', fullName: 'Craig R', profilePhoto: '' } },
        ];

        // Use mock data if API returns empty
        setTimelineStories(timelineRes.data?.length > 0 ? timelineRes.data : mockTimeline);
        setUserStories(userRes.data?.length > 0 ? userRes.data : []);
      } catch (err) {
        console.error('Error fetching stories:', err);
        setError('Failed to load stories');
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [token, currentUserId]);

  const openStory = (storyId) => {
    setSelectedStoryId(storyId);
  };

  const closeStoryViewer = () => {
    setSelectedStoryId(null);
  };

  const handleStoryCreated = (newStory) => {
    setUserStories(prev => [newStory, ...prev]);
    setShowCreateModal(false);
  };

  if (loading) {
    return <div className="text-center py-2 text-gray-500 dark:text-gray-300">Loading stories...</div>;
  }

  if (error) {
    return <div className="text-center py-2 text-red-500">{error}</div>;
  }

  // Group stories by user to avoid duplicates
  const uniqueUsers = new Set();
  const uniqueStories = timelineStories.filter(story => {
    if (!uniqueUsers.has(story.user._id)) {
      uniqueUsers.add(story.user._id);
      return true;
    }
    return false;
  });

  return (
    <div className="w-full py-4 px-2 overflow-x-auto  border-b border-gray-200 dark:border-gray-800">
      <div className="flex justify-between items-center mb-3 px-2">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">Stories</h2>
      </div>
      
      <div className="flex items-center space-x-4 max-w-full overflow-x-auto scrollbar-hide">
        {/* Your Story */}
        <div className="flex flex-col items-center shrink-0">
          <div
            className={`relative w-16 h-16 rounded-full overflow-hidden flex items-center justify-center cursor-pointer ${
              userStories.length > 0 
                ? 'border-2 border-purple-500' 
                : 'border-2 border-gray-300 dark:border-gray-600'
            }`}
            onClick={() => {
              if (userStories.length > 0) {
                openStory(userStories[0]._id);
              } else {
                setShowCreateModal(true);
              }
            }}
          >
            
            <Avatar src={currentUser?.profilePhoto} size="lg" name="you" />
            
          
          
            {userStories.length === 0 && (
              <div className="absolute bottom-0  bg-blue-500 text-white rounded-full p-1.5">
                <FaPlus size={10 } />
              </div>
            )}
            </div>
          <span className="text-xs mt-1 text-center text-gray-600 dark:text-gray-300 truncate w-16">
            You
          </span>
        </div>

        {/* Other Users' Stories */}
        {uniqueStories.map((story) => {
          // Skip current user since we already showed it
          if (story.user._id === currentUserId) return null;
          
          return (
            <div
              key={story.user._id}
              className="flex flex-col items-center shrink-0 cursor-pointer"
              onClick={() => openStory(story._id)}
            >
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500 p-0.5">
                <ProfileImage image={story.user.profilePhoto} />
              </div>
              <span className="text-xs mt-1 text-center truncate w-16 text-gray-600 dark:text-gray-300">
                {story.user.userName.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Story Viewer */}
      {selectedStoryId && (
        <StoryViewer 
          storyId={selectedStoryId} 
          onClose={closeStoryViewer} 
        />
      )}
      
      {/* Create Story Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
          <CreateStory 
            onClose={() => setShowCreateModal(false)} 
            onStoryCreated={handleStoryCreated}
          />
        </div>
      )}
    </div>
  );
};

export default Stories;
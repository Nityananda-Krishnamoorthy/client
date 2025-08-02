import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfileImage from './ProfileImage';
import { FaTimes, FaFire, FaHeart, FaLaugh, FaSurprise } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const StoryViewer = ({ storyId, onClose }) => {
  const [allStories, setAllStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const token = useSelector(state => state.user?.currentUser?.token);
  const userId = useSelector(state => state.user?.currentUser?._id);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/stories/timeline`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sorted = response.data.sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setAllStories(sorted);
        const index = sorted.findIndex(s => s._id === storyId);
        setCurrentIndex(index >= 0 ? index : 0);
      } catch (err) {
        console.error('Failed to load viewer stories', err);
        onClose();
      }
    };
    load();
  }, [storyId]);

  const story = allStories[currentIndex] || {};

  useEffect(() => {
    setProgress(0);
    const duration = story.duration || 5;
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          handleNext();
          return 0;
        }
        return p + 100 / (duration * 10);
      });
    }, 100);

    if (story.viewers?.every(v => v.user.toString() !== userId)) {
      axios.post(`${import.meta.env.VITE_API_URL}/stories/${story._id}/seen`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(console.error);
    }

    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < allStories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else onClose();
  };
  const handlePrev = () => currentIndex > 0 && setCurrentIndex(currentIndex - 1);

  const reactToStory = emoji => {
    axios.post(`${import.meta.env.VITE_API_URL}/stories/${story._id}/react`, { emoji }, {
      headers: { Authorization: `Bearer ${token}` },
    }).catch(console.error);
  };

  if (!story._id) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="absolute top-4 left-0 right-0 flex px-4 space-x-1 z-50">
        {allStories.map((_, i) => (
          <div key={i} className="h-1 flex-1 bg-gray-600 rounded-full overflow-hidden">
            <div
              className={`h-full ${i === currentIndex ? 'bg-white' : 'bg-gray-400/40'}`}
              style={{ width: i === currentIndex ? `${progress}%` : '100%' }}
            />
          </div>
        ))}
      </div>

      <button className="absolute top-6 right-6 text-white z-50" onClick={onClose}>
        <FaTimes size={24} />
      </button>

      <div className="w-full h-full flex items-center justify-center">
        {story.type === 'video'
          ? <video src={story.media} autoPlay muted className="max-w-full max-h-full" />
          : <img src={story.media} alt="" className="max-w-full max-h-full object-contain" />
        }
      </div>

      <div className="absolute top-6 left-6 flex items-center space-x-3 z-50">
        <ProfileImage image={story.user.profilePhoto} size="sm" />
        <div className="flex flex-col text-white">
          <span className="font-medium">@{story.user.userName}</span>
          <span className="text-xs text-gray-300">
            {new Date(story.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      <div className="absolute bottom-8 w-full flex justify-center gap-4 z-50">
        {[
          { icon: <FaFire />, emoji: '🔥' },
          { icon: <FaHeart />, emoji: '❤️' },
          { icon: <FaLaugh />, emoji: '😂' },
          { icon: <FaSurprise />, emoji: '😮' }
        ].map((it, idx) => (
          <button
            key={idx}
            onClick={() => reactToStory(it.emoji)}
            className="text-white bg-black bg-opacity-50 p-3 rounded-full hover:bg-opacity-75 transition"
          >
            {it.icon}
          </button>
        ))}
      </div>

      <div className="absolute left-0 top-0 bottom-0 w-1/2" onClick={handlePrev} />
      <div className="absolute right-0 top-0 bottom-0 w-1/2" onClick={handleNext} />
    </div>
  );
};

export default StoryViewer;

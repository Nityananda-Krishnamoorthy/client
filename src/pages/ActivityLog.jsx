import React, {useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector(state => state.user.currentUser?.token);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/activities`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setActivities(response.data.activities);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchActivities();
  }, [token]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div>Loading activities...</div>;
  }

  return (
    <div className="activity-log">
      <h2>Activity Log</h2>
      
      {activities.length === 0 ? (
        <p>No activities found</p>
      ) : (
        <div className="activity-list">
          {activities.map(activity => (
            <div key={activity._id} className="activity-item">
              <div className="activity-icon">
                {activity.action === 'login' && '🔒'}
                {activity.action === 'logout' && '🚪'}
                {activity.action === 'create_post' && '✏️'}
                {activity.action === 'like_post' && '❤️'}
                {activity.action === 'comment' && '💬'}
                {activity.action === 'follow' && '👤'}
              </div>
              
              <div className="activity-content">
                <p>
                  {activity.action === 'login' && 'You logged in'}
                  {activity.action === 'logout' && 'You logged out'}
                  {activity.action === 'create_post' && 'You created a post'}
                  {activity.action === 'like_post' && 'You liked a post'}
                  {activity.action === 'comment' && 'You commented on a post'}
                  {activity.action === 'follow' && 'You followed a user'}
                  
                  {activity.details?.ipAddress && (
                    <span> from {activity.details.ipAddress}</span>
                  )}
                </p>
                
                <div className="activity-meta">
                  <span>{formatDate(activity.createdAt)}</span>
                  {activity.details?.browser && (
                    <span> • {activity.details.browser}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
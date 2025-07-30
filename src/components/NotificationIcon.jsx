import React, { useState, useEffect } from 'react';
import { FaBell, FaTrash, FaUser } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import formatTimeAgo  from '../helpers/TimeAgo';
import defaultImage from '../assets/default-profile.png';


const NotificationIcon = ({ isActive, onToggle }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const token = useSelector(state => state?.user?.currentUser?.token);
  const theme = useSelector(state => state?.ui?.theme);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/notifications/`, {
          withCredentials:true,
  headers: { Authorization: `Bearer ${token}` }
});

        setNotifications(response?.data?.notifications);
         const unread = response?.data?.notifications.filter(n => !n.read).length;
      setUnreadCount(unread);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (token) fetchNotifications();
  }, [token]);

  const markAsRead = async (_id) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/notifications/${_id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNotifications(prev => 
        prev.map(n => n._id === _id ? { ...n, read: true } : n)
      );
      
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (_id, e) => {
    e.stopPropagation();
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/notifications/${_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNotifications(prev => prev.filter(n => n._id !== _id));
      setUnreadCount(prev => prev - (notifications.find(n => n._id === _id)?.read ? 0 : 1));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read if unread
    if (!notification?.read) {
      markAsRead(notification?._id);
    }
    
    // Navigate based on notification type
    switch(notification?.type) {
      case 'follow':
        if (notification?.data?.actor?.userName) {
          navigate(`/profile/${notification?.data?.actor?.userName}`);
        }
        break;
      case 'like':
      case 'comment':
        if (notification?.data?.post?._id) {
          navigate(`/post/${notification?.data?.post?._id}`);
        }
        break;
      case 'message':
        if (notification?.data?.conversation?._id) {
          navigate(`/messages/${notification?.data?.conversation?._id}`);
        }
        break;
      default:
        // For activity logs, navigate to activity page
        navigate('/activity');
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/notifications/mark-all-read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return (
    <div className={`notification-icon dropdown-container ${theme}`}>
      <button 
        onClick={() => onToggle()} 
        className="notification-button"
      >
        <FaBell className="icon" />
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>
      
      {isActive && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button 
                className="mark-all-read"
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="notification-list">
            {notifications.length === 0 ? (
              <p className="empty-notifications">No notifications</p>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification._id} 
                  className={`notification-item ${notification.read ? '' : 'unread'}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-avatar">
                    {notification.data?.actor?.profilePhoto ? (
                      <img 
                        src={notification?.data?.actor?.profilePhoto} 
                        alt={notification?.data?.actor?.userName} 
                      />
                    ) : (
                      <img src={defaultImage} alt="default avatar" className="default-avatar" />
                    )}
                  </div>
                  
                  <div className="notification-content">
                    <p className="notification-message">{notification.message}</p>
                    <p className="notification-time">
                      {formatTimeAgo(notification.createdAt)}
                    </p>

                  </div>
                  
                  <button 
                    className="delete-notification"
                    onClick={(e) => deleteNotification(notification._id, e)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;
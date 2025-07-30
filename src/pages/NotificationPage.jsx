import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaBell, FaTrash, FaCheck, FaFilter, FaArrowLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import formatTimeAgo from '../helpers/TimeAgo'; 
import defaultImage from '../assets/default-profile.png';
//import './NotificationPage.css'; 

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'unread'
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  
  const token = useSelector(state => state?.user?.currentUser?.token);
  const theme = useSelector(state => state?.ui?.theme); 
  const navigate = useNavigate();

  // Observer for infinite scrolling
  const observer = useRef();
  const lastNotificationElementRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        setError(''); // Clear previous errors
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/notifications?page=${page}&limit=20`, 
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        const newNotifications = response?.data?.notifications || [];
        setNotifications(prev => {
          // Avoid duplicate notifications when loading more pages
          const uniqueNewNotifications = newNotifications.filter(
            n => !prev.some(existingN => existingN._id === n._id)
          );
          return page === 1 ? newNotifications : [...prev, ...uniqueNewNotifications];
        });
        
        // Correctly calculate unread count for newly fetched notifications
        // This ensures the badge updates properly when new unread notifications are loaded
        setUnreadCount(prev => {
            const currentUnread = newNotifications.filter(n => !n.read).length;
            return page === 1 ? currentUnread : prev + currentUnread;
        });
        
        setHasMore(newNotifications.length === 20); // If less than 20, assume no more pages
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Failed to load notifications. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchNotifications();
  }, [token, page]);

  // Apply filter whenever notifications or filter state changes
  useEffect(() => {
    if (filter === 'unread') {
      setFilteredNotifications(notifications.filter(n => !n.read));
    } else {
      setFilteredNotifications(notifications);
    }
  }, [notifications, filter]);

  // Mark notification as read
  const markAsRead = async (_id) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/notifications/${_id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNotifications(prev => {
        const updatedNotifications = prev.map(n => n._id === _id ? { ...n, read: true } : n);
        // Recalculate unread count based on the updated list
        setUnreadCount(updatedNotifications.filter(n => !n.read).length);
        return updatedNotifications;
      });
      
    } catch (err) {
      console.error('Error marking notification as read:', err);
      // Optionally show a toast notification for failure
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      setIsMarkingAll(true);
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/notifications/mark-all-read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      
      setUnreadCount(0); // All are read, so count becomes 0
    } catch (err) {
      console.error('Error marking all as read:', err);
      setError('Failed to mark all notifications as read. Please try again.');
    } finally {
      setIsMarkingAll(false);
    }
  };

  // Delete notification
  const deleteNotification = async (_id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/notifications/${_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNotifications(prev => {
        const updatedNotifications = prev.filter(n => n._id !== _id);
        // Recalculate unread count if the deleted notification was unread
        setUnreadCount(updatedNotifications.filter(n => !n.read).length);
        return updatedNotifications;
      });
    } catch (err) {
      console.error('Error deleting notification:', err);
      setError('Failed to delete notification. Please try again.');
    }
  };

  // Delete all notifications
  const deleteAllNotifications = async () => {
    // Implement a more visually appealing confirmation dialog if possible (e.g., modal)
    // For now, using window.confirm as in the original code.
    if (!window.confirm('Are you sure you want to delete all notifications? This action cannot be undone.')) {
      return;
    }
    
    try {
      setIsDeletingAll(true);
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/notifications/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNotifications([]); // Clear all notifications from state
      setUnreadCount(0);
      setPage(1); // Reset pagination
      setHasMore(false); // No more notifications
    } catch (err) {
      console.error('Error deleting all notifications:', err);
      setError('Failed to delete all notifications. Please try again.');
    } finally {
      setIsDeletingAll(false);
    }
  };

  // Handle notification click to navigate and mark as read
  const handleNotificationClick = (notification) => {
    if (!notification?.read) {
      markAsRead(notification?._id); // Mark as read on click
    }
    
    // Navigate based on notification type
    switch(notification?.type) {
      case 'follow':
        if (notification?.data?.actor?.userName) {
          navigate(`/users/${notification?.data?.actor?.userName}`);
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
        // Fallback or general activity page
        navigate('/activity'); 
    }
  };

  return (
    <div className={`notification-page ${theme}`}>
      {/* Back button for better navigation experience */}
      <button className="back-button" onClick={() => navigate(-1)} aria-label="Go back">
          <FaArrowLeft /> Back
      </button>
      

      {/* Conditional rendering for loading, error, empty, or notification list states */}
      {isLoading && page === 1 ? (
        <div className="loading-container" role="status" aria-live="polite">
          <div className="loading-spinner"></div>
          <p>Loading notifications...</p>
        </div>
      ) : error ? (
        <div className="error-container" role="alert">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try again</button>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="empty-state">
          <FaBell className="empty-icon" aria-hidden="true" />
          <h3>No notifications yet</h3>
          <p>We'll notify you when something new happens.</p>
        </div>
      ) : (
        <>
          <div className="notifications-list" role="list">
            {filteredNotifications.map((notification, index) => {
                // Attach ref to the last element for infinite scrolling
                const isLastNotification = filteredNotifications.length === index + 1;
                return (
                    <div 
                        key={notification._id}
                        className={`notification-item ${notification.read ? '' : 'unread'}`}
                        onClick={() => handleNotificationClick(notification)}
                        role="listitem"
                        aria-labelledby={`notification-message-${notification._id}`}
                        aria-describedby={`notification-meta-${notification._id}`}
                        ref={isLastNotification ? lastNotificationElementRef : null}
                    >
                        <div className="notification-content">
                            <div className="notification-avatar">
                                <img 
                                    src={notification.data?.actor?.profilePhoto || defaultImage} 
                                    alt={`${notification.data?.actor?.userName || 'User'}'s profile`} 
                                    onError={(e) => { e.target.onerror = null; e.target.src = defaultImage; }} // Fallback for broken image
                                />
                            </div>
                            
                            <div className="notification-details">
                                <p className="notification-message" id={`notification-message-${notification._id}`}>
                                    {notification.message}
                                </p>
                                <div className="notification-meta" id={`notification-meta-${notification._id}`}>
                                    <span className="notification-time">
                                        {formatTimeAgo(notification.createdAt)}
                                    </span>
                                    {/* Make notification type more readable if needed, e.g., 'Follow' instead of 'follow' */}
                                    <span className="notification-type">
                                        {notification.type}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="notification-actions">
                            {!notification.read && (
                                <button 
                                    className="mark-read"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent navigating when marking as read
                                        markAsRead(notification._id);
                                    }}
                                    aria-label="Mark as read"
                                >
                                    <FaCheck aria-hidden="true" />
                                </button>
                            )}
                            <button 
                                className="delete-notification"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent navigating when deleting
                                    deleteNotification(notification._id);
                                }}
                                aria-label="Delete notification"
                            >
                                <FaTrash aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                );
            })}
          </div>
          {/* Footer Controls */}
          <div className="notifications-footer">
            <div className="filters">
              <button 
                className={`filter-button ${filter === 'all' ? 'active' : ''}`} 
                onClick={() => setFilter('all')}
                aria-label="Show all notifications"
              >
                All
              </button>
              <button 
                className={`filter-button ${filter === 'unread' ? 'active' : ''}`} 
                onClick={() => setFilter('unread')}
                aria-label="Show unread notifications"
              >
                Unread ({unreadCount})
              </button>
            </div>

            <div className="actions">
              <button 
                onClick={markAllAsRead}
                disabled={isMarkingAll || unreadCount === 0}
                className="mark-all-read"
                aria-label="Mark all notifications as read"
              >
                {isMarkingAll ? 'Marking...' : 'Mark All as Read'}
              </button>
              <button 
                onClick={deleteAllNotifications}
                disabled={isDeletingAll || notifications.length === 0}
                className="delete-all"
                aria-label="Delete all notifications"
              >
                {isDeletingAll ? 'Deleting...' : 'Delete All'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationPage;
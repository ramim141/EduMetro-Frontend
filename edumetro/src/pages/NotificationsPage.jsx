import React, { useState, useEffect, useContext } from 'react';
import { FaBell, FaComment, FaHeart, FaShare, FaCheck } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import Spinner from '../components/Spinner';
import Message from '../components/Message';

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'comment':
        return <FaComment className="text-blue-500" />;
      case 'like':
        return <FaHeart className="text-red-500" />;
      case 'share':
        return <FaShare className="text-green-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  return (
    <div 
      className={`p-4 ${
        notification.isRead ? 'bg-white' : 'bg-blue-50'
      } hover:bg-gray-50 transition-colors duration-200 rounded-lg`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 p-2 bg-white rounded-full shadow-sm">
          {getIcon(notification.type)}
        </div>
        <div className="flex-1 ml-4">
          <p className={`text-sm ${notification.isRead ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
            {notification.message}
          </p>
          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
        </div>
        {!notification.isRead && (
          <button
            onClick={() => onMarkAsRead(notification.id)}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            title="Mark as read"
          >
            <FaCheck className="text-sm" />
          </button>
        )}
      </div>
    </div>
  );
};

const NotificationsPage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In a real app, fetch notifications from your API
    const fetchNotifications = async () => {
      try {
        // Simulated API call
        const response = await new Promise(resolve => 
          setTimeout(() => resolve({
            data: [
              {
                id: 1,
                type: 'comment',
                message: "John Doe commented on your note 'React Hooks Overview'",
                time: "5 minutes ago",
                isRead: false
              },
              {
                id: 2,
                type: 'like',
                message: "Your note 'Data Structures in JavaScript' was liked by Jane Smith",
                time: "2 hours ago",
                isRead: false
              },
              {
                id: 3,
                type: 'share',
                message: "Alex Johnson shared your note 'Python Basics'",
                time: "1 day ago",
                isRead: true
              }
            ]
          }), 1000)
        );
        setNotifications(response.data);
      } catch (err) {
        setError('Failed to load notifications');
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
    // In a real app, make an API call to mark the notification as read
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, isRead: true }))
    );
    // In a real app, make an API call to mark all notifications as read
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Message 
          type="error" 
          message="Please log in to view your notifications" 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <p className="mt-1 text-sm text-gray-600">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              Mark all as read
            </button>
          )}
        </div>

        {error && (
          <Message 
            type="error" 
            message={error} 
            onClose={() => setError(null)} 
            duration={5000}
            className="mb-6"
          />
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Spinner size="w-12 h-12" />
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center bg-white rounded-lg shadow-sm p-8">
            <FaBell className="text-4xl text-gray-400 mb-4" />
            <p className="text-gray-600">No notifications yet</p>
            <p className="mt-2 text-sm text-gray-500">
              We'll notify you when something important happens
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
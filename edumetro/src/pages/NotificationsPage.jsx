import React from 'react';
import { FaBell, FaComment, FaHeart, FaShare } from 'react-icons/fa';

const NotificationItem = ({ icon: Icon, message, time, isRead }) => { // eslint-disable-line no-unused-vars
  <div className={`p-4 ${isRead ? 'bg-white' : 'bg-purple-50'} hover:bg-gray-50 transition-colors duration-200`}>
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <Icon className={`text-xl ${isRead ? 'text-gray-400' : 'text-purple-600'}`} />
      </div>
      <div className="ml-4 flex-1">
        <p className={`text-sm ${isRead ? 'text-gray-600' : 'text-gray-900'}`}>
          {message}
        </p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  </div>
};

const NotificationsPage = () => {
  const notifications = [
    {
      icon: FaComment,
      message: "John Doe commented on your note 'React Hooks Overview'",
      time: "5 minutes ago",
      isRead: false
    },
    {
      icon: FaHeart,
      message: "Your note 'Data Structures in JavaScript' was liked by Jane Smith",
      time: "2 hours ago",
      isRead: false
    },
    {
      icon: FaShare,
      message: "Alex Johnson shared your note 'Python Basics'",
      time: "1 day ago",
      isRead: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <button className="text-sm text-purple-600 hover:text-purple-800">
            Mark all as read
          </button>
        </div>

        <div className="bg-white rounded-lg shadow divide-y">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <NotificationItem key={index} {...notification} />
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No notifications yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const UserNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const iconMap = {
    resolved: {
      icon: <FaCheckCircle className="text-green-500 text-xl" />,
      border: 'border-l-4 border-green-500',
      label: 'Resolved',
    },
    rejected: {
      icon: <FaTimesCircle className="text-red-500 text-xl" />,
      border: 'border-l-4 border-red-500',
      label: 'Rejected',
    },
  };

  const fetchNotifications = async () => {
    try {
      const storedEmail = localStorage.getItem('email');
      if (!storedEmail) {
        console.error('Email not found in localStorage');
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:8000/user-notifications/${storedEmail}`);
      const data = await response.json();
      setNotifications(data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/user-notifications/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotifications((prev) => prev.filter((notif) => notif._id.toString() !== id.toString()));
      } else {
        console.error('Failed to delete notification');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  if (loading) {
    return <div className="text-white text-center mt-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0D1B2A] p-6">
      <h2 className="text-2xl font-bold text-white mb-6 mt-15">Recent Notifications</h2>
      {notifications.length === 0 ? (
        <div className="text-gray-400 text-center font-semibold">
          No reports have been reviewed or resolved.
        </div>
      ) : (
        <div className="space-y-4 max-h-[70vh] overflow-y-auto mt-8">
          {notifications.map((notif) => {
            const { icon, border, label } = iconMap[notif.status] || {};
            const relativeTime = notif.created_at
              ? formatDistanceToNow(new Date(new Date(notif.created_at).getTime() + (5.5 * 60 * 60 * 1000)), {
                  addSuffix: true,
                })
              : 'Unknown time';

            return (
              <div
                key={notif._id}
                className={`relative flex items-start bg-[#1B263B] text-white rounded shadow p-4 ${border}`}
              >
                {!notif.is_read && (
                  <div className="absolute top-2 right-8 w-2 h-2 bg-blue-500 rounded-full" />
                )}

                <div className="mr-4">{icon}</div>

                <div className="flex-1 flex flex-col">
                  <span className="font-semibold text-lg">Damage Report {label}</span>
                  <span className="text-gray-300">{notif.message}</span>
                  <span className="text-gray-500 text-sm mt-1">{relativeTime}</span>
                </div>

                <button
                  onClick={() => handleDelete(notif._id)}
                  className="text-gray-400 hover:text-red-500 transition-colors text-2xl ml-4 cursor-pointer"
                  title="Delete notification"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserNotification;

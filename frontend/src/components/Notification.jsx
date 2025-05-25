import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

const Notifications = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          "https://newsdata.io/api/1/news?apikey=pub_71624bf67e3a28e68706a8503cd06cd1ce68d&q=road%20damage&country=in&language=en"
        );
        setNews(response.data.results || []);
      } catch (error) {
        setError("Failed to load news.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:8000/admin-notifications/");
      const data = await response.json();
      const sortedNotifications = (data.notifications || []).sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setNotifications(sortedNotifications);
      console.log("Notifications fetched successfully:", sortedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8000/admin-notifications/${id}`, {
        method: "DELETE",
      });
      fetchNotifications();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8 md:px-10">
      {/* Title */}
      <h1 className="fade-in text-4xl font-extrabold text-yellow-400 text-center mb-8 md:text-5xl mt-20">
        🚧 Notifications & Updates 🛑
      </h1>

      {/* 🔔 Latest Notifications */}
      <div className="fade-in bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold text-purple-300 mb-4">
          🔔 Latest Reports
        </h2>
        {notifications.length === 0 ? (
          <p className="text-gray-400 text-center">
            No recent notifications available.
          </p>
        ) : (
          <ul className="space-y-4">
            {notifications
              .slice(0,10)
              .map((notif) => {
                const createdAtIST = new Date(new Date(notif.created_at).getTime() + 5.5 * 60 * 60 * 1000);
                const timeAgo = formatDistanceToNow(createdAtIST, { addSuffix: true }).replace("about ", "");
                return (
                  <li
                    key={notif._id}
                    className="bg-gray-700 p-4 rounded-md shadow-sm border-l-4 border-yellow-400 flex justify-between items-start"
                  >
                    <div>
                      📍 New road damage reported at{" "}
                      <span className="text-yellow-300 font-medium">
                        {notif.address}
                      </span>{" "}
                      —{" "}
                      <span className="text-red-300">{notif.damage_type}</span>,{" "}
                      <span className="text-orange-300">{notif.severity}</span> by
                      user: <span className="text-blue-300">{notif.email}</span>
                      <p className="text-sm text-gray-400 mt-1">
                        {timeAgo}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(notif._id)}
                      aria-label="Delete notification"
                      className="ml-4 text-red-400 hover:text-red-600 text-xl mt-1"
                      title="Delete notification"
                    >
                      <i className="ri-delete-bin-6-line"></i>
                    </button>
                  </li>
                );
              })}
          </ul>
        )}
      </div>

      {/* News Section */}
      <div className="fade-in bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-green-300 mb-4">
          📰 Latest Road Damage News
        </h2>

        {loading ? (
          <p className="text-gray-400 mt-2 text-center">Loading news...</p>
        ) : error ? (
          <p className="text-red-400 mt-2 text-center">{error}</p>
        ) : news.length === 0 ? (
          <p className="text-gray-400 mt-2 text-center">No recent news available.</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
            {news.map((article, index) => (
              <li
                key={index}
                className="news-card fade-in bg-gray-700 p-5 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-2 transition-transform duration-300"
              >
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline text-lg font-semibold block mb-2"
                >
                  {article.title}
                </a>
                <p className="text-sm text-gray-400">
                  📅 {new Date(article.pubDate).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Fade-In Animation */}
      <style jsx>{`
        .fade-in {
          opacity: 0;
          animation: fadeIn 1s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Notifications;

import React, { useEffect, useState } from "react";
import axios from "axios";

const Notifications = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch news about road damage cases in India
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
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8 md:px-10">
      {/* Title */}
      <h1 className="fade-in text-4xl font-extrabold text-yellow-400 text-center mb-8 md:text-5xl mt-20">
        🚧 Notifications & Updates 🛑
      </h1>

      {/* Placeholder for backend synchronization */}
      <div className="fade-in bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold text-blue-300">⚠️ System Alerts</h2>
        <p className="text-gray-400 mt-2">[Backend synchronization will be added here]</p>
      </div>

      {/* News Section */}
      <div className="fade-in bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-green-300 mb-4">📰 Latest Road Damage News</h2>

        {loading ? (
          <p className="text-gray-400 mt-2 text-center">Loading news...</p>
        ) : error ? (
          <p className="text-red-400 mt-2 text-center">{error}</p>
        ) : news.length === 0 ? (
          <p className="text-gray-400 mt-2 text-center">No recent news available.</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
            {news.map((article, index) => (
              <li key={index} className="news-card fade-in bg-gray-700 p-5 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-2 transition-transform duration-300">
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

      {/* CSS for Fade-In Animation */}
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

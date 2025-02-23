import React from "react";
import { FaChartBar, FaUser, FaExclamationTriangle } from "react-icons/fa";
import { motion } from "framer-motion";

const AdminPanel = () => {
  // Dummy report stats (replace with real API data)
  const reports = [
    { id: 1, type: "Pothole", status: "Pending", severity: "High" },
    { id: 2, type: "Crack", status: "Resolved", severity: "Medium" },
    { id: 3, type: "Erosion", status: "In Progress", severity: "Low" },
    { id: 4, type: "Pothole", status: "Pending", severity: "High" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col items-center p-8">
      {/* Header */}
      <motion.h1
        className="text-4xl font-bold text-yellow-400 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Admin Dashboard
      </motion.h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <motion.div
          className="bg-black/60 backdrop-blur-lg p-6 rounded-lg shadow-lg flex flex-col items-center border border-gray-700"
          whileHover={{ scale: 1.05 }}
        >
          <FaChartBar className="text-4xl text-blue-400 mb-2" />
          <h2 className="text-2xl font-semibold">Total Reports</h2>
          <p className="text-3xl font-bold mt-2">50</p>
        </motion.div>

        <motion.div
          className="bg-black/60 backdrop-blur-lg p-6 rounded-lg shadow-lg flex flex-col items-center border border-gray-700"
          whileHover={{ scale: 1.05 }}
        >
          <FaUser className="text-4xl text-green-400 mb-2" />
          <h2 className="text-2xl font-semibold">Total Users</h2>
          <p className="text-3xl font-bold mt-2">150</p>
        </motion.div>

        <motion.div
          className="bg-black/60 backdrop-blur-lg p-6 rounded-lg shadow-lg flex flex-col items-center border border-gray-700"
          whileHover={{ scale: 1.05 }}
        >
          <FaExclamationTriangle className="text-4xl text-red-400 mb-2" />
          <h2 className="text-2xl font-semibold">Pending Issues</h2>
          <p className="text-3xl font-bold mt-2">12</p>
        </motion.div>
      </div>

      {/* Reports Table */}
      <div className="mt-10 w-full max-w-5xl bg-black/60 backdrop-blur-lg p-6 rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-2xl font-semibold text-yellow-300 mb-4">Recent Reports</h2>
        <table className="w-full border-collapse border border-gray-600">
          <thead>
            <tr className="bg-gray-800">
              <th className="border border-gray-600 px-4 py-2">ID</th>
              <th className="border border-gray-600 px-4 py-2">Type</th>
              <th className="border border-gray-600 px-4 py-2">Status</th>
              <th className="border border-gray-600 px-4 py-2">Severity</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr
                key={report.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-700" : "bg-gray-800"
                } hover:bg-gray-600 transition-all`}
              >
                <td className="border border-gray-600 px-4 py-2">{report.id}</td>
                <td className="border border-gray-600 px-4 py-2">{report.type}</td>
                <td
                  className={`border border-gray-600 px-4 py-2 ${
                    report.status === "Pending"
                      ? "text-red-400"
                      : report.status === "Resolved"
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  {report.status}
                </td>
                <td className="border border-gray-600 px-4 py-2">{report.severity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;

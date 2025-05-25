import React, { useEffect, useState, useMemo } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const History = () => {
  const [reports, setReports] = useState([]);
  const [sortType, setSortType] = useState("date-desc");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchReports = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/reports/${email}`);
      if (!response.ok) {
        if (response.status === 404) {
          setReports([]);
          setError("No reports found for this user.");
        } else {
          throw new Error("Failed to fetch reports");
        }
      } else {
        const data = await response.json();
        setReports(data.reports || []);
      }
    } catch (error) {
      setError(error.message || "Something went wrong");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      fetchReports(email);
    } else {
      setLoading(false);
      setError("User email not found. Please login.");
    }
  }, []);

  const totalCount = reports.length;
  const pendingCount = reports.filter(
    (r) => r.status?.toLowerCase() === "pending"
  ).length;
  const resolvedCount = reports.filter(
    (r) => r.status?.toLowerCase() === "resolved"
  ).length;

  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Severe":
        return "bg-red-600";
      case "Moderate":
        return "bg-yellow-600";
      case "Minor":
        return "bg-green-600";
      default:
        return "bg-gray-600";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-600";
      case "resolved":
        return "bg-green-600";
      default:
        return "bg-gray-600";
    }
  };

  const severityRank = {
    Severe: 3,
    Moderate: 2,
    Mild: 1,
  };

  const sortedReports = useMemo(() => {
    if (!reports) return [];
    return [...reports].sort((a, b) => {
      if (sortType === "date-desc")
        return new Date(b.created_at) - new Date(a.created_at);
      if (sortType === "date-asc")
        return new Date(a.created_at) - new Date(b.created_at);
      if (sortType === "severity-desc")
        return severityRank[b.severity] - severityRank[a.severity];
      if (sortType === "severity-asc")
        return severityRank[a.severity] - severityRank[b.severity];
      return 0;
    });
  }, [reports, sortType]);

  const formatDateTimeIST = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  };

  return (
    <div className="min-h-screen bg-[#0C1327] p-6 text-indigo-100 w-full">
      <div className="max-w-7xl mx-auto mt-16">
        <h2 className="text-center text-3xl font-bold mb-8">History</h2>

        {/* Loading state */}
        {loading && (
          <p className="text-center text-indigo-200">Loading reports...</p>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="text-center">
            <p className="text-red-400 font-semibold mb-4">{error}</p>
            {/* Show "Report Now" button when no reports found */}
            {(error === "No reports found for this user." ||
              error ===
                "User email not found. Please login.") && (
              <button
                onClick={() => navigate("/report")}
                className="bg-indigo-600 hover:bg-indigo-700 transition rounded-md px-6 py-2 font-semibold text-white"
              >
                Report Now
              </button>
            )}
          </div>
        )}

        {/* No reports but no error (just in case) */}
        {!loading && !error && reports.length === 0 && (
          <div className="text-center">
            <p className="text-indigo-200 font-semibold mb-4">
              No reports available for this user.
            </p>
            <button
              onClick={() => navigate("/report")}
              className="bg-indigo-600 hover:bg-indigo-700 transition rounded-md px-6 py-2 font-semibold text-white cursor-pointer"
            >
              Report Now
            </button>
          </div>
        )}

        {/* Render counts and reports only if reports exist and no error */}
        {!loading && !error && reports.length > 0 && (
          <>
            {/* Counts */}
            <div className="flex justify-center gap-6 mb-10 flex-wrap">
              <div className="bg-purple-600 rounded-lg px-4 py-4 min-w-[120px] text-center shadow-lg">
                <div className="text-white font-semibold text-lg">Total</div>
                <div className="text-3xl font-extrabold">{totalCount}</div>
              </div>
              <div className="bg-yellow-700 rounded-lg px-6 py-4 min-w-[120px] text-center shadow-lg">
                <div className="text-white font-semibold text-lg">Pending</div>
                <div className="text-3xl font-extrabold">{pendingCount}</div>
              </div>
              <div className="bg-green-700 rounded-lg px-6 py-4 min-w-[120px] text-center shadow-lg">
                <div className="text-white font-semibold text-lg">Resolved</div>
                <div className="text-3xl font-extrabold">{resolvedCount}</div>
              </div>
            </div>

            {/* Sort dropdown */}
            <div className="mb-10 w-72 mx-auto">
              <select
                className="w-full rounded-md bg-[#19203a] p-3 text-indigo-200 focus:outline-none shadow-md"
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
              >
                <option value="date-desc">Sort by Newest</option>
                <option value="date-asc">Sort by Oldest</option>
                <option value="severity-desc">Severity: High to Low</option>
                <option value="severity-asc">Severity: Low to High</option>
              </select>
            </div>

            {/* Report cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedReports.map((report) => (
                <div
                  key={report._id}
                  className="bg-[#19203a] rounded-xl overflow-hidden shadow-md transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl"
                >
                  <img
                    src={`data:${report.image_type};base64,${report.image_base64}`}
                    alt={`Report ${report._id}`}
                    className="w-full h-56 object-cover"
                  />

                  <div className="p-5 space-y-3">
                    <p className="font-semibold">
                      Summary:{" "}
                      <span className="font-normal text-indigo-200">
                        {report.summary}
                      </span>
                    </p>
                    <p className="flex items-center gap-2 text-indigo-300 text-sm">
                      <FaMapMarkerAlt /> {report.address}
                    </p>
                    <p className="text-indigo-400 text-sm">
                      {formatDateTimeIST(report.submission_date)}
                    </p>

                    <div className="flex flex-wrap gap-3 mt-3">
                      <span
                        className={`rounded-full px-4 py-1 text-sm font-semibold text-white ${getSeverityColor(
                          report.severity
                        )}`}
                      >
                        {report.severity}
                      </span>
                      <span
                        className={`rounded-full px-4 py-1 text-sm font-semibold text-white ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {capitalizeFirstLetter(report.status)}
                      </span>
                      {report.damage_type && (
                        <span className="rounded-full px-4 py-1 text-sm font-semibold bg-indigo-900 text-indigo-200">
                          {report.damage_type}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default History;

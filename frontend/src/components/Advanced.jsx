import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Advanced = () => {
  const navigate = useNavigate();
  const reportsRef = useRef([]);
  const [reports, setReports] = useState([]);
  const [sortType, setSortType] = useState("newest");

  const fetchReports = async () => {
    try {
      const response = await fetch("http://localhost:8000/reports");
      if (!response.ok) {
        throw new Error("error fetching reports");
      }
      const data = await response.json();
      setReports(data.reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const navigateAnalysis = () => {
    navigate('/analysis');
  };

  useGSAP(() => {
    gsap.fromTo(
      '.cards',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.3, ease: "power3.out" }
    );
  });

  const handleResolved = (id) => {
    toast.success(`Report #${id}: The damage has been successfully repaired.`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleNotDamaged = (id) => {
    toast.error(`Report #${id}: After careful review, it has been determined that this is not a damaged road.`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const sortedReports = useMemo(() => {
    const sorted = [...reports];
    switch (sortType) {
      case "oldest":
        return sorted.sort((a, b) => new Date(a.submission_date) - new Date(b.submission_date));
      case "status":
        return sorted.sort((a, b) => (a.status || "").localeCompare(b.status || ""));
      case "severity":
        const severityOrder = { "Severe": 1, "Moderate": 2, "Minor": 3 };
        return sorted.sort((a, b) => (severityOrder[a.severity] || 4) - (severityOrder[b.severity] || 4));
      default: // "newest"
        return sorted.sort((a, b) => new Date(b.submission_date) - new Date(a.submission_date));
    }
  }, [reports, sortType]);

  return (
    <div className="font-[Poppins] min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 font-semibold overflow-auto">
      <button
        className="fixed bottom-6 right-6 z-30 cursor-pointer border-gray-400 px-4 py-2 rounded-lg bg-red-500 transition-all duration-200 ease-in-out"
        onClick={navigateAnalysis}
        style={{ backgroundColor: '#e53e3e' }}
      >
        <i className="ri-arrow-left-line cursor-pointer"></i> Go back
      </button>

      <h1 className="text-3xl text-center w-full mb-6 mt-15 text-amber-300">
        Advanced Report Details
      </h1>

      {/* Sort Dropdown */}
      <div className="mb-6 flex justify-start">
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 
                      text-white px-5 py-3 rounded-lg shadow-lg hover:shadow-xl
                      border border-gray-600 hover:border-gray-500
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                      transition-all duration-300 ease-in-out
                      cursor-pointer font-medium
                      appearance-none bg-no-repeat bg-right pr-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.75rem center',
            backgroundSize: '1.25rem 1.25rem'
          }}
        >
          <option className="bg-gray-800 text-white" value="newest">Sort by: Newest</option>
          <option className="bg-gray-800 text-white" value="oldest">Oldest</option>
          <option className="bg-gray-800 text-white" value="status">Status</option>
          <option className="bg-gray-800 text-white" value="severity">Severity</option>
        </select>

      </div>

      {/* Reports */}
      <div className="flex flex-wrap justify-center gap-6">
        {sortedReports.map((report, index) => (
          <div
            key={index}
            ref={(el) => (reportsRef.current[index] = el)}
            className="cards bg-black/80 backdrop-blur-lg text-white p-6 rounded-lg shadow-lg border border-gray-700 w-80 h-auto"
          >
            <h2 className="text-xl font-semibold text-yellow-300 mb-4">
              Report #{index + 1}
            </h2>
            <img
              src={`data:${report.image_type};base64,${report.image_base64}`}
              alt="Reported Damage"
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <p><span className="text-gray-400">📍 Location:</span> {report.address}</p>
            <p><span className="text-gray-400">🚧 Damage Type:</span> {report.damage_type}</p>
            <p className="text-gray-400">📅 Date: {new Date(report.submission_date).toLocaleString()}</p>
            <p className="text-gray-400">
              📝 Summary: <span className="text-white">{report.summary}</span>
            </p>
            <p className={`${
              report.severity === "Severe"
                ? "text-red-400"
                : report.severity === "Moderate"
                ? "text-yellow-400"
                : "text-green-400"
            } font-semibold mt-2`}>
              ⚠ Severity: {report.severity}
            </p>

            <div className="mt-6 flex flex-col gap-4">
              <button
                onClick={() => handleResolved(index + 1)}
                className="bg-green-600 px-6 py-3 rounded-lg shadow-md font-semibold text-white focus:outline-none cursor-pointer"
              >
                Resolved
              </button>
              <button
                onClick={() => handleNotDamaged(index + 1)}
                className="bg-red-600 px-6 py-3 rounded-lg shadow-md font-semibold text-white focus:outline-none cursor-pointer"
                aria-label="Mark as not damaged"
              >
                &#x2716;
              </button>
            </div>
          </div>
        ))}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Advanced;

import React, { useEffect, useRef, useState } from "react";
import {
  FaChartBar,
  FaClock,
  FaCalendarDay,
  FaExclamationTriangle,
} from "react-icons/fa";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

const Analysis = () => {
  const statsRef = useRef([]);
  const tableRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const response = await fetch("http://localhost:8000/reports");
      if (!response.ok) {
        throw new Error("Error fetching reports");
      }
      const data = await response.json();
      setReports(data.reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Single useGSAP hook to handle all animations
  useGSAP(() => {
    if (isLoading || !reports.length) return;

    // Create a timeline for coordinated animations
    const tl = gsap.timeline();

    // Set initial states to prevent flickering
    gsap.set(statsRef.current, { opacity: 0, y: 50 });
    gsap.set(tableRef.current, { opacity: 0, y: 50 });

    // Animate stats cards
    tl.to(statsRef.current, {
      opacity: 1, 
      y: 0, 
      duration: 0.8, 
      stagger: 0.2, 
      ease: "power2.out"
    })
    // Animate table after stats
    .to(tableRef.current, {
      opacity: 1, 
      y: 0, 
      duration: 0.8, 
      ease: "power2.out"
    }, "-=0.3") // Start slightly before stats finish
    // Animate floating button separately
    .to(".advanced-btn", {
      y: -10,
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: "power1.inOut"
    }, "+=0.5");

    // Cleanup function
    return () => {
      tl.kill();
    };
  }, [reports, isLoading]); // Dependencies to re-run when data changes

  // Hover animations for stats cards
  const handleStatsHover = (index, isEntering) => {
    if (!statsRef.current[index]) return;
    
    gsap.to(statsRef.current[index], {
      scale: isEntering ? 1.05 : 1,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  // Dynamic stats
  const totalReports = reports.length;
  const pendingReports = reports.filter(
    (r) => r.status?.toLowerCase() === "pending"
  ).length;

  const today = new Date();
  const todayString = today.toISOString().split("T")[0];
  const todayReports = reports.filter((r) => {
    const dateStr =
      r.submission_date ||
      r.date ||
      r.created_at ||
      r.createdAt ||
      "";
    if (!dateStr) return false;
    const reportDate = new Date(dateStr);
    const reportDateString = reportDate.toISOString().split("T")[0];
    return reportDateString === todayString;
  }).length;

  // Severity Pie Chart
  const severityCounts = {
    Severe: 0,
    Moderate: 0,
    Minor: 0,
  };

  reports.forEach((r) => {
    const sev = r.severity;
    if (sev in severityCounts) severityCounts[sev]++;
  });

  const pieData = [
    { name: "High", value: severityCounts.Severe, color: "#EF4444" },
    { name: "Medium", value: severityCounts.Moderate, color: "#FACC15" },
    { name: "Low", value: severityCounts.Minor, color: "#22C55E" },
  ];

  const navigateAdvanced = () => {
    navigate("/advanced");
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-wrap p-8 font-semibold overflow-auto"
    >
      {/* Left: Stats & Table */}
      <div className="w-full lg:w-2/3 flex flex-col items-center pr-0 lg:pr-4 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-10">
          {[
            {
              icon: <FaChartBar className="text-4xl text-blue-400 mb-2" />,
              title: "Total Reports",
              value: totalReports,
            },
            {
              icon: <FaClock className="text-4xl text-yellow-400 mb-2" />,
              title: "Pending Reports",
              value: pendingReports,
            },
            {
              icon: <FaCalendarDay className="text-4xl text-green-400 mb-2" />,
              title: "Reports Today",
              value: todayReports,
            },
          ].map((item, index) => (
            <div
              key={index}
              ref={(el) => (statsRef.current[index] = el)}
              className="bg-black/60 backdrop-blur-lg p-6 rounded-lg shadow-lg flex flex-col items-center border border-gray-700"
              onMouseEnter={() => handleStatsHover(index, true)}
              onMouseLeave={() => handleStatsHover(index, false)}
            >
              {item.icon}
              <h2 className="text-2xl font-semibold">{item.title}</h2>
              <p className="text-3xl font-bold mt-2">{item.value}</p>
            </div>
          ))}
        </div>

        <div
          ref={tableRef}
          className="mt-10 w-full max-w-5xl bg-black/60 backdrop-blur-lg p-6 rounded-lg shadow-lg border border-gray-700"
        >
          <h2 className="text-2xl font-semibold text-yellow-300 mb-4">
            Recent Reports
          </h2>
          <table className="w-full border-collapse border border-gray-600">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-600 px-4 py-2">Index</th>
                <th className="border border-gray-600 px-4 py-2">Damage Type</th>
                <th className="border border-gray-600 px-4 py-2">Severity</th>
                <th className="border border-gray-600 px-4 py-2">Date</th>
                <th className="border border-gray-600 px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.slice(0,10).map((report, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-700" : "bg-gray-800"
                  } hover:bg-gray-600 transition-all`}
                >
                  <td className="border border-gray-600 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-600 px-4 py-2">{report.damage_type}</td>
                  <td
                    className={`border border-gray-600 px-4 py-2 ${
                      report.severity === "Severe"
                        ? "text-red-400"
                        : report.severity === "Minor"
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {report.severity}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {new Date(report.submission_date).toLocaleDateString()}
                  </td>
                  <td
                    className={`border border-gray-600 px-4 py-2 capitalize ${
                      report.status?.toLowerCase() === "pending"
                        ? "text-yellow-400"
                        : "text-green-400"
                    }`}
                  >
                    {report.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right: Pie Chart */}
      <div className="w-full lg:w-1/3 flex flex-col items-center justify-center p-4">
        <div className="bg-black/60 backdrop-blur-lg p-6 rounded-lg shadow-lg border border-gray-700 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-yellow-300 mb-4 text-center">
            Severity Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex justify-around mt-4 bg-gray-800 p-2 rounded-lg">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-4 h-4 mr-2 rounded"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Button */}
      <div>
        <button
          className="text-xl advanced-btn fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-110"
          onClick={navigateAdvanced}
        >
          Advanced details
        </button>
      </div>
    </div>
  );
};

export default Analysis;
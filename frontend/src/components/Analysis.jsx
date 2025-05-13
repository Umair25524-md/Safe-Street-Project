import React, { useEffect, useRef, useState } from "react";
import { FaChartBar, FaUser, FaExclamationTriangle } from "react-icons/fa";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";

const Analysis = () => {
  const statsRef = useRef([]);
  const tableRef = useRef(null);
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch reports from API
  const getReports = async () => {
    try {
      const res = await fetch("http://localhost:5000/getReports", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch reports");

      const result = await res.json();
      console.log(result);

      setReports(result); // Save to state
      setLoading(false); // Set loading to false once data is fetched
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again later.");
    }
  };

  useEffect(() => {
    getReports();
  }, []);

  // Status counts and data for PieChart
  const statusCounts = reports.reduce(
    (acc, report) => {
      if (report.status === "resolved") acc.resolved += 1;
      else acc.unresolved += 1;
      return acc;
    },
    { resolved: 0, unresolved: 0 }
  );

  const statusData = [
    { name: "Resolved", value: statusCounts.resolved },
    { name: "Unresolved", value: statusCounts.unresolved },
  ];

  // GSAP animations
  useEffect(() => {
    gsap.fromTo(
      statsRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.3, ease: "power3.out" }
    );

    gsap.fromTo(
      tableRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, delay: 0.8, ease: "power3.out" }
    );
  }, []);

  useGSAP(() => {
    gsap.fromTo(
      ".advanced-btn",
      { y: 10 },
      { y: -10, repeat: -1, yoyo: true, duration: 1.5, ease: "power1.inOut" }
    );
  });

  // Handle navigation for advanced details
  const navigateAdvanced = () => {
    navigate("/advanced");
  };

  // Pie chart data for severity distribution
  const pieData = [
    { name: "High", value: 12, color: "#EF4444" },
    { name: "Medium", value: 20, color: "#FACC15" },
    { name: "Low", value: 18, color: "#22C55E" },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-wrap p-8 font-semibold overflow-auto">
      {/* Left Side: Analysis Section */}
      <div className="w-full lg:w-2/3 flex flex-col items-center pr-0 lg:pr-4 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-10">
          {[ 
            {
              icon: <FaChartBar className="text-4xl text-blue-400 mb-2" />,
              title: "Total Reports",
              value: "50",
            },
            {
              icon: <FaUser className="text-4xl text-green-400 mb-2" />,
              title: "Total Users",
              value: "150",
            },
            {
              icon: (
                <FaExclamationTriangle className="text-4xl text-red-400 mb-2" />
              ),
              title: "New Reports Today",
              value: "12",
            },
          ].map((item, index) => (
            <div
              key={index}
              ref={(el) => (statsRef.current[index] = el)}
              className="bg-black/60 backdrop-blur-lg p-6 rounded-lg shadow-lg flex flex-col items-center border border-gray-700"
              onMouseEnter={() =>
                gsap.to(statsRef.current[index], { scale: 1.05, duration: 0.3 })
              }
              onMouseLeave={() =>
                gsap.to(statsRef.current[index], { scale: 1, duration: 0.3 })
              }
            >
              {item.icon}
              <h2 className="text-2xl font-semibold">{item.title}</h2>
              <p className="text-3xl font-bold mt-2">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Status Pie Chart */}
        <div className="mt-10 w-full max-w-md bg-black/60 backdrop-blur-lg p-6 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-yellow-300 mb-4">Report Status Distribution</h2>
          <PieChart width={300} height={300}>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {statusData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.name === "Resolved" ? "#00C49F" : "#FF8042"}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Reports Table */}
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
                <th className="border border-gray-600 px-4 py-2">ID</th>
                <th className="border border-gray-600 px-4 py-2">Address</th>
                <th className="border border-gray-600 px-4 py-2">Landmark</th>
                <th className="border border-gray-600 px-4 py-2">Road Type</th>
                <th className="border border-gray-600 px-4 py-2">Damage Summary</th>
                <th className="border border-gray-600 px-4 py-2">Status</th>
                <th className="border border-gray-600 px-4 py-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr
                  key={report._id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-700" : "bg-gray-800"
                  } hover:bg-gray-600 transition-all`}
                >
                  <td className="border border-gray-600 px-4 py-2">{report._id}</td>
                  <td className="border border-gray-600 px-4 py-2">{report.address}</td>
                  <td className="border border-gray-600 px-4 py-2">{report.landmark}</td>
                  <td className="border border-gray-600 px-4 py-2">{report.roadType}</td>
                  <td className="border border-gray-600 px-4 py-2">{report.damage_summary}</td>
                  <td className={`border border-gray-600 px-4 py-2 ${report.status === "unresolved" ? "text-red-400" : "text-green-400"}`}>{report.status}</td>
                  <td className="border border-gray-600 px-4 py-2">{new Date(report.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Side: Pie Chart */}
      <div className="w-full lg:w-1/3 flex flex-col items-center justify-center p-4">
        <div className="bg-black/60 backdrop-blur-lg p-6 rounded-lg shadow-lg border border-gray-700 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-yellow-300 mb-4 text-center">
            Severity Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Advanced Button */}
        <div
          onClick={navigateAdvanced}
          className="advanced-btn text-center mt-8 py-3 px-6 bg-yellow-400 text-black rounded-lg cursor-pointer hover:bg-yellow-500"
        >
          View Advanced Reports
        </div>
      </div>
    </div>
  );
};

export default Analysis;


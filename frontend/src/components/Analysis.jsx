import React, { useEffect, useRef, useState } from "react";
import { FaChartBar, FaUser, FaExclamationTriangle } from "react-icons/fa";
import gsap from "gsap";
import { useGSAP } from '@gsap/react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {useNavigate} from "react-router-dom";

const Analysis = () => {
  const statsRef = useRef([]);
  const tableRef = useRef(null);
  const navigate = useNavigate();

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
  })

  const reports = [
    { id: 1, type: "Pothole", severity: "High", Date: "2021-09-01" },
    { id: 2, type: "Crack", severity: "Medium", Date: "2021-09-01" },
    { id: 3, type: "Erosion", severity: "Low", Date: "2021-09-01" },
    { id: 4, type: "Pothole", severity: "High", Date: "2021-09-01" },
  ];

  const pieData = [
    { name: "High", value: 12, color: "#EF4444" },
    { name: "Medium", value: 20, color: "#FACC15" },
    { name: "Low", value: 18, color: "#22C55E" },
  ];

 const navigateAdvanced = () => {
    navigate('/advanced');
  }
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-wrap p-8 font-semibold overflow-auto">
      {/* Left Side: Analysis Section */}
      <div className="w-full lg:w-2/3 flex flex-col items-center pr-0 lg:pr-4 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-10">
          {[
            { icon: <FaChartBar className="text-4xl text-blue-400 mb-2" />, title: "Total Reports", value: "50" },
            { icon: <FaUser className="text-4xl text-green-400 mb-2" />, title: "Total Users", value: "150" },
            { icon: <FaExclamationTriangle className="text-4xl text-red-400 mb-2" />, title: "New Reports Today", value: "12" }
          ].map((item, index) => (
            <div
              key={index}
              ref={(el) => (statsRef.current[index] = el)}
              className="bg-black/60 backdrop-blur-lg p-6 rounded-lg shadow-lg flex flex-col items-center border border-gray-700"
              onMouseEnter={() => gsap.to(statsRef.current[index], { scale: 1.05, duration: 0.3 })}
              onMouseLeave={() => gsap.to(statsRef.current[index], { scale: 1, duration: 0.3 })}
            >
              {item.icon}
              <h2 className="text-2xl font-semibold">{item.title}</h2>
              <p className="text-3xl font-bold mt-2">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Reports Table */}
        <div ref={tableRef} className="mt-10 w-full max-w-5xl bg-black/60 backdrop-blur-lg p-6 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-2xl font-semibold text-yellow-300 mb-4">Recent Reports</h2>
          <table className="w-full border-collapse border border-gray-600">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-600 px-4 py-2">ID</th>
                <th className="border border-gray-600 px-4 py-2">Type</th>
                <th className="border border-gray-600 px-4 py-2">Severity</th>
                <th className="border border-gray-600 px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr
                  key={report.id}
                  className={`${index % 2 === 0 ? "bg-gray-700" : "bg-gray-800"} hover:bg-gray-600 transition-all`}
                >
                  <td className="border border-gray-600 px-4 py-2">{report.id}</td>
                  <td className="border border-gray-600 px-4 py-2">{report.type}</td>
                  <td
                    className={`border border-gray-600 px-4 py-2 ${
                      report.severity === "High"
                        ? "text-red-400"
                        : report.severity === "Low"
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {report.severity}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">{report.Date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Side: Pie Chart */}
      <div className="w-full lg:w-1/3 flex flex-col items-center justify-center p-4">
        <div className="bg-black/60 backdrop-blur-lg p-6 rounded-lg shadow-lg border border-gray-700 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-yellow-300 mb-4 text-center">Severity Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend Box */}
          <div className="flex justify-around mt-4 bg-gray-800 p-2 rounded-lg">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-4 h-4 mr-2 rounded" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
          <div>
              <button className="text-xl advanced-btn fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-110"
                      onClick={navigateAdvanced}>
                Advanced details
              </button>
          </div>
    </div>
  );
};

export default Analysis;

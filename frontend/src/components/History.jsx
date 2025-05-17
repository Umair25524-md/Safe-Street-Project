
// import React, { useEffect, useState, useMemo } from "react";
// import { FaMapMarkerAlt } from "react-icons/fa";

// const History = () => {
//   const [reports, setReports] = useState([]);
//   const [sortType, setSortType] = useState("date-desc");

//   const dummyReports = [
//     {
//       id: "RPT001",
//       image: "/img1.jpg",
//       date: "2025-05-04T09:30:00",
//       status: "Pending",
//       severity: "Severe",
//       summary: "Deep pothole, high risk for two-wheelers.",
//       location: "Narayanaguda, Hyderabad",
//       damageType: "Alligator Crack",
//     },
//     {
//       id: "RPT002",
//       image: "/img2.jpg",
//       date: "2025-05-02T11:00:00",
//       status: "Resolved",
//       severity: "Moderate",
//       summary: "Cracks forming along the lane lines.",
//       location: "Ameerpet, Hyderabad",
//       damageType: "Longitudinal Crack",
//     },
//     {
//       id: "RPT003",
//       image: "/img3.jpg",
//       date: "2025-05-01T18:45:00",
//       status: "Resolved",
//       severity: "Mild",
//       summary: "Minor edge cracks, low traffic disruption.",
//       location: "Madhapur, Hyderabad",
//       damageType: "",
//     },
//   ];

//   useEffect(() => {
//     setReports(dummyReports);
//   }, []);

//   const totalCount = reports.length;
//   const pendingCount = reports.filter((r) => r.status === "Pending").length;
//   const resolvedCount = reports.filter((r) => r.status === "Resolved").length;

//   const getSeverityColor = (severity) => {
//     switch (severity) {
//       case "Severe":
//         return "bg-red-600";
//       case "Moderate":
//         return "bg-yellow-600";
//       case "Mild":
//         return "bg-green-600";
//       default:
//         return "bg-gray-600";
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Pending":
//         return "bg-yellow-600";
//       case "Resolved":
//         return "bg-green-600";
//       default:
//         return "bg-gray-600";
//     }
//   };

//   const severityRank = {
//     Severe: 3,
//     Moderate: 2,
//     Mild: 1,
//   };

//   const sortedReports = useMemo(() => {
//     if (!reports) return [];
//     return [...reports].sort((a, b) => {
//       if (sortType === "date-desc") return new Date(b.date) - new Date(a.date);
//       if (sortType === "date-asc") return new Date(a.date) - new Date(b.date);
//       if (sortType === "severity-desc")
//         return severityRank[b.severity] - severityRank[a.severity];
//       if (sortType === "severity-asc")
//         return severityRank[a.severity] - severityRank[b.severity];
//       return 0;
//     });
//   }, [reports, sortType]);

//   return (
//     <div className="min-h-screen bg-[#0C1327] p-6 text-indigo-100 w-full">
//       <div className="max-w-7xl mx-auto">
//         <h2 className="text-center text-3xl font-bold mb-8">History</h2>

//     {/* Counts */}
//     <div className="flex justify-center gap-6 mb-10 flex-wrap">
//     <div className="bg-purple-600 rounded-lg px-4 py-4 min-w-[120px] text-center shadow-lg">
//         <div className="text-white font-semibold text-lg">Total</div>
//         <div className="text-3xl font-extrabold">{totalCount}</div>
//     </div>
//     <div className="bg-yellow-700 rounded-lg px-6 py-4 min-w-[120px] text-center shadow-lg">
//         <div className="text-white font-semibold text-lg">Pending</div>
//         <div className="text-3xl font-extrabold">{pendingCount}</div>
//     </div>
//     <div className="bg-green-700 rounded-lg px-6 py-4 min-w-[120px] text-center shadow-lg">
//         <div className="text-white font-semibold text-lg">Resolved</div>
//         <div className="text-3xl font-extrabold">{resolvedCount}</div>
//     </div>
//     </div>


//         {/* Sort dropdown */}
//         <div className="mb-10 w-64 mx-auto">
//           <select
//             className="w-full rounded-md bg-[#19203a] p-3 text-indigo-200 focus:outline-none shadow-md"
//             value={sortType}
//             onChange={(e) => setSortType(e.target.value)}
//           >
//             <option value="date-desc">Sort by Newest</option>
//             <option value="date-asc">Sort by Oldest</option>
//             <option value="severity-desc">Severity: High to Low</option>
//             <option value="severity-asc">Severity: Low to High</option>
//           </select>
//         </div>

//         {/* Report cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {sortedReports.map((report) => (
//             <div
//               key={report.id}
//               className="bg-[#19203a] rounded-xl overflow-hidden shadow-md"
//             >
//               <img
//                 src={report.image}
//                 alt={`Report ${report.id}`}
//                 className="w-full h-56 object-cover"
//               />
//               <div className="p-5 space-y-3">
//                 <p className="font-semibold">
//                   Summary:{" "}
//                   <span className="font-normal text-indigo-200">
//                     {report.summary}
//                   </span>
//                 </p>
//                 <p className="flex items-center gap-2 text-indigo-300 text-sm">
//                   <FaMapMarkerAlt /> {report.location}
//                 </p>
//                 <p className="text-indigo-400 text-sm">
//                   {new Date(report.date).toLocaleDateString("en-GB", {
//                     day: "2-digit",
//                     month: "2-digit",
//                     year: "numeric",
//                   })}{" "}
//                   {new Date(report.date).toLocaleTimeString([], {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     hour12: true,
//                   })}
//                 </p>
//                 <div className="flex flex-wrap gap-3 mt-3">
//                   <span
//                     className={`rounded-full px-4 py-1 text-sm font-semibold text-white ${getSeverityColor(
//                       report.severity
//                     )}`}
//                   >
//                     {report.severity}
//                   </span>
//                   <span
//                     className={`rounded-full px-4 py-1 text-sm font-semibold text-white ${getStatusColor(
//                       report.status
//                     )}`}
//                   >
//                     {report.status}
//                   </span>
//                   {report.damageType && (
//                     <span className="rounded-full px-4 py-1 text-sm font-semibold bg-indigo-900 text-indigo-200">
//                       {report.damageType}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default History;

import React, { useEffect, useState, useMemo } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

const History = () => {
  const [reports, setReports] = useState([]);
  const [sortType, setSortType] = useState("date-desc");

  const dummyReports = [
    {
      id: "RPT001",
      image: "/img1.jpg",
      date: "2025-05-04T09:30:00",
      status: "Pending",
      severity: "Severe",
      summary: "Deep pothole, high risk for two-wheelers.",
      location: "Narayanaguda, Hyderabad",
      damageType: "Alligator Crack",
    },
    {
      id: "RPT002",
      image: "/img2.jpg",
      date: "2025-05-02T11:00:00",
      status: "Resolved",
      severity: "Moderate",
      summary: "Cracks forming along the lane lines.",
      location: "Ameerpet, Hyderabad",
      damageType: "Longitudinal Crack",
    },
    {
      id: "RPT003",
      image: "/img3.jpg",
      date: "2025-05-01T18:45:00",
      status: "Resolved",
      severity: "Mild",
      summary: "Minor edge cracks, low traffic disruption.",
      location: "Madhapur, Hyderabad",
      damageType: "",
    },
  ];

  useEffect(() => {
    setReports(dummyReports);
  }, []);

  const totalCount = reports.length;
  const pendingCount = reports.filter((r) => r.status === "Pending").length;
  const resolvedCount = reports.filter((r) => r.status === "Resolved").length;

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Severe":
        return "bg-red-600";
      case "Moderate":
        return "bg-yellow-600";
      case "Mild":
        return "bg-green-600";
      default:
        return "bg-gray-600";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-600";
      case "Resolved":
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
      if (sortType === "date-desc") return new Date(b.date) - new Date(a.date);
      if (sortType === "date-asc") return new Date(a.date) - new Date(b.date);
      if (sortType === "severity-desc")
        return severityRank[b.severity] - severityRank[a.severity];
      if (sortType === "severity-asc")
        return severityRank[a.severity] - severityRank[b.severity];
      return 0;
    });
  }, [reports, sortType]);

  return (
    <div className="min-h-screen bg-[#0C1327] p-6 text-indigo-100 w-full">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-3xl font-bold mb-8">History</h2>

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
              key={report.id}
              className="bg-[#19203a] rounded-xl overflow-hidden shadow-md transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              <img
                src={report.image}
                alt={`Report ${report.id}`}
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
                  <FaMapMarkerAlt /> {report.location}
                </p>
                <p className="text-indigo-400 text-sm">
                  {new Date(report.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}{" "}
                  {new Date(report.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
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
                    {report.status}
                  </span>
                  {report.damageType && (
                    <span className="rounded-full px-4 py-1 text-sm font-semibold bg-indigo-900 text-indigo-200">
                      {report.damageType}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;

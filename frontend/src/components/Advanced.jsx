import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React,{useRef} from 'react';
import { useNavigate } from 'react-router-dom';

const Advanced = () => {
    const navigate = useNavigate();
    const reportsRef = useRef([]);
  const reports = [
    {
      id: 1,
      image: "/img1.jpg", // Replace with dynamic data
      location: "5th Avenue, NY",
      reporter: "John Doe",
      summary : "A pothole in the middle of the road",
      severity: "High",
      type: "Pothole",
      date: "2021-09-01",
    },
    {
      id: 2,
      image: "/img2.jpg",
      location: "Sunset Blvd, LA",
      reporter: "Jane Smith",
      summary : "A pothole in the middle of the road",
      severity: "Medium",
      type: "Crack",
      date: "2021-09-05",
    },
    {
      id: 3,
      image: "/img3.jpg",
      location: "Downtown, Chicago",
      reporter: "Michael Johnson",
      severity: "Low",
      summary : "A pothole in the middle of the road",
      type: "Uneven Surface",
      date: "2021-09-10",
    },
    {
      id: 4,
      image: "/img3.jpg",
      location: "Downtown, Chicago",
      reporter: "Michael Johnson",
      severity: "Low",
      summary : "A pothole in the middle of the road",
      type: "Uneven Surface",
      date: "2021-09-10",
    },
    {
      id: 5,
      image: "/img3.jpg",
      location: "Downtown, Chicago",
      reporter: "Michael Johnson",
      severity: "Low",
      summary : "A pothole in the middle of the road",
      type: "Uneven Surface",
      date: "2021-09-10",
    },
  ];

  const navigateAnalysis = () => {
    navigate('/analysis');
  }

  useGSAP(() => {
    gsap.fromTo('.cards',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.3, ease: "power3.out" }
    )
  })


  return (
    <div className="font-[Poppins] min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 font-semibold overflow-auto">
        <button className='fixed bottom-6 right-6 z-30 cursor-pointer border-gray-400 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition-all duration-200 ease-in-out' onClick={navigateAnalysis}><i className="ri-arrow-left-line cursor-pointer"></i> Go back</button>
      {/* Centered Heading */}
      <h1 className="text-3xl text-center w-full mb-6 mt-15 text-amber-300 ">Advanced Report Details</h1>

      {/* Responsive Grid for Cards */}
      <div className="flex flex-wrap justify-center gap-6">
        {reports.map((report,index) => (
          <div
            key={report.id}
            ref={(el) => (reportsRef.current[index] = el)}
            className="cards bg-black/80 backdrop-blur-lg text-white p-6 rounded-lg shadow-lg border border-gray-700 w-80 h-auto"
            onMouseEnter={() => gsap.to(reportsRef.current[index],{scale:1.05,duration:0.3,ease:'power2.inOut'})}
            onMouseLeave={() => gsap.to(reportsRef.current[index],{scale:1,duration:0.3,ease:'power2.inOut'})}
            
          >
            <h2 className="text-xl font-semibold text-yellow-300 mb-4">Report #{report.id}</h2>
            <img
              src={report.image}
              alt="Reported Damage"
              className="w-full h-40 object-cover rounded-lg mb-4"
            />

            <p>
              <span className="text-gray-400">📍 Location:</span> {report.location}
            </p>
            <p>
              <span className="text-gray-400">👤 Reporter:</span> {report.reporter}
            </p>
            <p>
              <span className="text-gray-400">🚧 Damage Type:</span> {report.type}
            </p>
            <p className="text-gray-400">📅 Date: {report.date}</p>
            <p className='text-gray-400'>📝 Summary: <span className='text-white'>{report.summary}</span></p>
            <p
              className={`${
                report.severity === "High"
                  ? "text-red-400"
                  : report.severity === "Medium"
                  ? "text-yellow-400"
                  : "text-green-400"
              } font-semibold mt-2`}
            >
              ⚠ Severity: {report.severity}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Advanced;

import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { FaEnvelope, FaUserAlt } from 'react-icons/fa';
import { useGSAP } from '@gsap/react';
import Footer from './Footer';
import ScrollTrigger from 'gsap/ScrollTrigger';

const AboutPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    '/construction1.jpg',
    '/construction2.jpg',
    '/construction3.jpg',
    '/construction4.jpg',
    '/construction5.jpg',
  ];

  gsap.registerPlugin(ScrollTrigger);

  useGSAP(() => {
    gsap.from('.about-box', {
      opacity: 0,
      y: 100,
      duration: 1,
      ease: 'power3.out',
      
    });

    gsap.from('.contributors-box', {
      opacity: 0,
      y: 100,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.contributors-section',
        start: 'top 85%',
        scrub:2,
      },
      stagger:2,
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Section Divider */}
      {/* <div className="relative w-full h-16 bg-gradient-to-b from-transparent to-gray-900"></div> */}

      {/* About Section */}
      <div className="relative w-full min-h-screen flex items-center text-white text-left px-4 sm:px-10 font-[Poppins] about-section">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          {images.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url(${img})` }}
            ></div>
          ))}
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* About Content */}
        <div className="about-box relative z-10 max-w-3xl p-6 sm:p-10 bg-black/40 backdrop-blur-md rounded-lg shadow-lg mx-auto">
          <h1 className="text-3xl sm:text-5xl font-bold text-blue-300">About SafeStreet</h1>
          <p className="text-lg text-gray-200 mt-4 leading-relaxed">
            SafeStreet is a revolutionary platform designed to enhance road safety by detecting and analyzing damage in real-time.
            Our AI-powered solution helps authorities quickly assess the condition of roads, prioritize repairs, and improve public safety.
          </p>
          <div className="mt-6">
            <h3 className="text-2xl font-semibold text-blue-400">How It Works</h3>
            <p className="text-lg text-gray-200 leading-relaxed">
              Our platform uses cutting-edge computer vision and machine learning algorithms to analyze road images, detecting cracks, potholes, and other types of damage.
            </p>
          </div>
          <div className="mt-6">
            <h3 className="text-2xl font-semibold text-blue-400">Key Features</h3>
            <ul className="list-disc list-inside text-lg text-gray-200 space-y-2">
              <li>Real-time road damage detection</li>
              <li>Severity-based prioritization</li>
              <li>Automated reports</li>
              <li>Interactive user interface</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contributors Section */}
{/* Contributors Section */}
<div className="relative w-full py-16 bg-zinc-900 text-white contributors-section">
  <h2 className="text-3xl sm:text-4xl font-bold text-center text-yellow-200 mb-12 tracking-wide underline">
    Meet Our Contributors
  </h2>

  {/* Contributors Wrapper */}
    <div className="flex justify-center flex-wrap gap-6 px-6 max-w-7xl mx-auto contributors-box">
      {[
        { name: 'Viraj', roll: '23BD1A057V', email: 'viraj@gmail.com' },
        { name: 'Umair', roll: '23BD1A057B', email: 'md.umair25524@gmail.com' },
        { name: 'Rayan', roll: '23BD1A056R', email: 'rayan@gmail.com' },
        { name: 'Rohan Reddy', roll: '23BD1A0576', email: 'rohan@gmail.com' },
        { name: 'Aditya', roll: '23BD1A057M', email: 'aditya@gmail.com' },
      ].map((c, i) => (
        <div
          key={i}
          className="bg-black/60 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-lg text-center border border-gray-700 
                    hover:scale-105 hover:shadow-xl hover:bg-gradient-to-r hover:from-zinc-900 hover:to-cyan-800 
                    transform transition-all duration-300 w-72"
        >
          <div className="mb-4">
            <FaUserAlt className="text-4xl text-blue-400 mx-auto" />
          </div>
          <h3 className="text-2xl font-semibold text-white">{c.name}</h3>
          <p className="text-lg text-gray-200 mt-2">{c.roll}</p>
          <p className="text-sm text-gray-300 mt-2">
            <FaEnvelope className="inline mr-2 text-white" />
            {c.email}
          </p>
        </div>
      ))}
    </div>
  </div>


    </>
  );
};

export default AboutPage;


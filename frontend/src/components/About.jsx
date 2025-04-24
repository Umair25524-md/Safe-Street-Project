import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { FaEnvelope, FaUserAlt } from 'react-icons/fa';
import { useGSAP } from '@gsap/react';
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
        scrub: 2,
      },
      stagger: 2,
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const contributors = [
    {
      name: 'Viraj',
      roll: '23BD1A057V',
      email: 'virajpalnitkar@gmail.com',
      contribution: 'Integrated the core Transformer model and seamlessly connected it with the backend to power real-time road analysis.',
    },
    {
      name: 'Umair',
      roll: '23BD1A057B',
      email: 'md.umair25524@gmail.com',
      contribution: 'Contributed to building and refining the website frontend for a smooth and responsive user experience with precision.',
    },
    {
      name: 'Rayan',
      roll: '23BD1A056R',
      email: 'skrayan0017@gmail.com',
      contribution: 'Crafted the web frontend and played a key role in implementing the Transformer-based analysis engine.',
    },
    {
      name: 'Rohan Reddy',
      roll: '23BD1A0576',
      email: 'talasanirohan006@gmail.com',
      contribution: 'Worked on the React Native mobile interface, enhancing usability and field reporting capabilities',
    },
    {
      name: 'Aditya',
      roll: '23BD1A057M',
      email: 'charybros12345@gmail.com',
      contribution: 'Developed the mobile app using React Native, making road reporting accessible on the go.',
    },
  ];

  return (
    <>
      <div className="relative w-full min-h-screen flex items-center text-white text-left px-4 sm:px-10 font-[Poppins] about-section">
        <div className="absolute inset-0 w-full h-full">
          {images.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="about-box relative z-10 max-w-3xl p-6 sm:p-10 bg-black/40 backdrop-blur-md rounded-lg shadow-lg mx-auto mt-10 h-auto">
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

      <div className="relative w-full py-16 bg-zinc-900 text-white contributors-section">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-yellow-200 mb-12 tracking-wide underline">
          Meet Our Contributors
        </h2>
        <div className="flex flex-wrap justify-center gap-12 px-6 contributors-box">
          {contributors.map((c, i) => (
            <div key={i} className="group w-80 h-96 [perspective:1000px]">
              <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-xl rounded-xl ">
                {/* Front Side */}
                <div className="absolute w-full h-full backface-hidden bg-zinc-800/80 backdrop-blur-md border border-cyan-500 p-6 rounded-xl flex flex-col justify-center items-center">
                  <FaUserAlt className="text-4xl text-cyan-400 mb-4" />
                  <h3 className="text-2xl font-semibold text-white text-center">{c.name}</h3>
                  <p className="text-md text-gray-300 mt-2">{c.roll}</p>
                  <p className="text-sm text-gray-400 mt-1 text-center break-words">
                    <FaEnvelope className="inline mr-1 text-cyan-400" />{c.email}
                  </p>
                </div>
                {/* Back Side */}
                <div className="absolute w-full h-full backface-hidden [transform:rotateY(180deg)] bg-gradient-to-br from-zinc-900 to-cyan-800 p-6 rounded-xl flex items-center justify-center">
                  <p className="text-lg text-white text-center leading-relaxed px-2">{c.contribution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AboutPage;
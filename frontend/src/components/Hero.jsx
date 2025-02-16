import React, { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Hero = () => {
  const images = ['./img1.jpg', './img2.jpg', './img3.jpg', './img4.jpg'];
  const [currentIndex,setcurrentIndex] = useState(0);

  // useGSAP(() => {
  //   setInterval(() => {
  //     setcurrentIndex((currentIndex+1)%4);
  //   },10000);

  //   gsap.fromTo('#hero-img', { opacity: 0 }, { opacity: 1, duration: 2 });

  // },[currentIndex]);

  

  return (
    <div className='relative w-full h-[100vh] font-montserrat overflow-hidden'>
      {/* Background Image */}
      <img
        src={images[currentIndex]}
        alt=""
        className='object-cover w-full h-full'
        id='hero-img'
      />

      {/* Overlay */}
      <div className='absolute inset-0 bg-black/50'></div>

      {/* Text Content */}
      <div className='absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4'>
        <h1 className='text-4xl md:text-6xl font-bold mb-4 '>
          Welcome to SafeStreet
        </h1>
        <p className='text-lg md:text-2xl max-w-2xl text-amber-300'>
          Ensuring safer roads by detecting and reporting road damages efficiently.
        </p>
      </div>
    </div>
  );
};

export default Hero;

import React, { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Hero = () => {

  const [animationDone, setAnimationDone] = useState(false);

  const containerRef = useRef(null)

  useGSAP(
    () => {
      gsap.fromTo(".hero-head span", { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, ease: "power4.out" })

      gsap.fromTo(".hero-sub", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: "power4.out", delay: 2 })
    },
    { scope: containerRef, dependencies: [] },
  )


  const splitText = (text) => {
    return text.split('').map((letter, index) => (
      <span key={index}>{letter}</span>
    ));
  };
    

  return (
    <div ref={containerRef} className='relative w-full h-[100vh] font-[Montserrat] overflow-hidden'>
      {/* Background Image */}
      <img
        src='./hero_bg.jpg'
        alt=""
        className='object-cover w-full h-full'
        id='hero-img'
      />

      {/* Overlay */}
      <div className='absolute inset-0 bg-black/30'></div>

      {/* Text Content */}
      <div className='absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4'>
        <h1 className='hero-head text-4xl md:text-6xl font-bold mb-4 '>
          {splitText("Welcome to SafeStreet")}
        </h1>
        <p className='hero-sub text-lg md:text-2xl max-w-2xl text-amber-300'>
          Ensuring safer roads by detecting and reporting road damages efficiently.
        </p>
      </div>
    </div>
  );
};

export default Hero;

import React from 'react';
import { motion } from 'framer-motion';
import heroImg from '../assets/homepageone.png';

const Hero = () => {
  return (
    <section className="relative w-full h-screen min-h-[500px] md:min-h-[800px] flex items-center justify-center overflow-hidden">
      {/* Background Image & Overlay */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        {/* Dark gradient overlay to make text readable and blend edges */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/20"></div>
        {/* Radial dark overlay to match the shadow around the edges */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.6)_100%)]"></div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 md:px-8 lg:px-16 flex flex-col items-center text-center text-white pt-20">
        
        {/* Headline */}
        <motion.h1 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-6xl lg:text-[85px] font-bold font-serif mb-8 leading-[1.1]"
        >
          Design Your <br />
          Dream Space
        </motion.h1>

        {/* Subtext */}
        <motion.p 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.0, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[700px] text-lg md:text-xl text-gray-200 font-sans leading-relaxed mb-12"
        >
          Experience the future of interior design. Calculate customized quotes, get instant cost evaluations, and bring your vision to life.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.0, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-6 mb-16"
        >
          <a 
            href="/get-quote" 
            className="flex items-center justify-center gap-3 bg-[#D97736] text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-sans font-medium text-base md:text-lg hover:bg-[#b86128] transition-colors min-w-[180px] md:min-w-[220px]"
          >
            Get Quote
          </a>
          <a 
            href="/services" 
            className="flex items-center justify-center border border-white/70 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-sans font-medium text-base md:text-lg hover:bg-white/10 transition-colors min-w-[180px] md:min-w-[220px]"
          >
            Explore Services
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

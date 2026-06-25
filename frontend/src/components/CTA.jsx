import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ctaBg from '../assets/homelast.png';
import {
  staggerContainerVariant,
  staggerItemVariant,
  scaleUpVariant,
  viewportOptions
} from '../hooks/useScrollAnimation';

const CTA = () => {
  return (
    <section className="relative py-32 flex items-center justify-center min-h-[500px]">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${ctaBg})` }}
        variants={scaleUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOptions}
      >
        {/* White overlay */}
        <div className="absolute inset-0 bg-white/40"></div>
      </motion.div>

      <motion.div
        className="relative z-10 text-center px-4 md:px-6 max-w-3xl mx-auto flex flex-col items-center"
        variants={staggerContainerVariant}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOptions}
      >
        <motion.h2
          variants={staggerItemVariant}
          className="text-5xl md:text-[56px] font-bold font-serif text-[#1A1A1A] mb-6"
        >
          Ready to Transform Your Space?
        </motion.h2>
        <motion.p
          variants={staggerItemVariant}
          className="text-white text-lg md:text-xl font-sans mb-10 max-w-2xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-medium"
        >
          Get started with our cost estimator or schedule a free consultation with our team
        </motion.p>

        <motion.div
          variants={staggerItemVariant}
          className="flex flex-col sm:flex-row gap-6 items-center"
        >
          <a
            href="/get-quote"
            className="flex items-center justify-center bg-[#D97736] text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-sans font-medium text-[15px] md:text-[17px] hover:bg-[#b86128] transition-colors min-w-[160px] md:min-w-[200px]"
          >
            Get Quote
          </a>
          <a
            href="/contact"
            className="flex items-center justify-center gap-2 border border-[#1A1A1A] text-[#1A1A1A] px-6 py-3 md:px-8 md:py-4 rounded-xl font-sans font-medium text-[15px] md:text-[17px] hover:bg-[#1A1A1A] hover:text-white transition-colors min-w-[160px] md:min-w-[200px]"
          >
            Book Consultation
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CTA;

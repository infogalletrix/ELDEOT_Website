import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import {
  staggerContainerVariant,
  staggerItemVariant,
  viewportOptions
} from '../hooks/useScrollAnimation';

const Testimonials = () => {
  const testimonials = [
    {
      text: "Intério transformed our living space beyond our wildest dreams. The AI design tool gave us the perfect starting point, and the team executed flawlessly",
      name: "Sarah Mitchell",
      role: "Homeowner"
    },
    {
      text: "AI-powered design suggestions made our office transformation faster, smarter, and more professional than we imagined.",
      name: "James Chen",
      role: "CEO, TechCorp"
    },
    {
      text: "The commercial design service helped us create an atmosphere that our customers absolutely love. Revenue is up 30% since the renovation",
      name: "Maria Garcia",
      role: "Restaurant Owner"
    }
  ];

  return (
    <section className="bg-[#FAF7F2] pt-16 pb-24 px-4 md:px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={staggerContainerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
        >
          <motion.p
            variants={staggerItemVariant}
            className="text-[#D97736] font-sans font-medium tracking-widest uppercase text-sm mb-4"
          >
            TESTIMONIALS
          </motion.p>
          <motion.h2
            variants={staggerItemVariant}
            className="text-5xl md:text-6xl font-bold font-serif text-[#1A1A1A]"
          >
            What Our Clients Say
          </motion.h2>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={staggerItemVariant}
              className="bg-white rounded-[2rem] p-10 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300"
            >
              {/* Quote Icon */}
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#D97736] opacity-30 mb-8">
                <path d="M10 11L8 15H5L7 11H5V5H11V11H10ZM18 11L16 15H13L15 11H13V5H19V11H18Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>

              {/* Stars */}
              <div className="flex gap-2 mb-8">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-[22px] h-[22px] text-[#D97736] fill-[#D97736]" />
                ))}
              </div>

              {/* Text */}
              <p className="text-[#666666] font-sans text-[17px] leading-[1.7] mb-12 flex-grow">
                {testimonial.text}
              </p>

              {/* Author */}
              <div>
                <h4 className="font-bold font-sans text-[#1A1A1A] text-lg mb-1">
                  {testimonial.name}
                </h4>
                <p className="text-[#999999] font-sans text-sm">
                  {testimonial.role}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Testimonials;

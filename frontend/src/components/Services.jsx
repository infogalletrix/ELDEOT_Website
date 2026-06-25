import React from 'react';
import { motion } from 'framer-motion';
import { Home, Building2, Store, ArrowUpRight, ArrowRight } from 'lucide-react';
import img1 from '../assets/hometwo1.png';
import img2 from '../assets/hometwoim2.png';
import img3 from '../assets/hometwoim3.png';
import {
  fadeUpVariant,
  staggerContainerVariant,
  staggerItemVariant,
  viewportOptions
} from '../hooks/useScrollAnimation';

const Services = () => {
  const services = [
    {
      title: "Home Design",
      desc: "Transform your living spaces with personalized interiors that blend comfort, elegance, and modern lifestyle needs.",
      img: img1,
      icon: <Home className="w-6 h-6 text-[#D97736]" />,
      href: "/services#home-interior"
    },
    {
      title: "Office Design",
      desc: "Craft modern and efficient workspaces that inspire productivity, collaboration, and professional growth.",
      img: img2,
      icon: <Building2 className="w-6 h-6 text-[#D97736]" />,
      href: "/services#office-design"
    },
    {
      title: "Commercial Design",
      desc: "Create impactful commercial interiors designed to attract customers and elevate brand experiences.",
      img: img3,
      icon: <Store className="w-6 h-6 text-[#D97736]" />,
      href: "/services#commercial-design"
    }
  ];

  return (
    <section className="bg-[#FAF7F2] pt-24 pb-12 px-4 md:px-6 lg:px-12">
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
            className="text-[#D97736] font-sans font-medium tracking-wide uppercase text-sm mb-4"
          >
            What We Do
          </motion.p>
          <motion.h2
            variants={staggerItemVariant}
            className="text-5xl md:text-6xl font-bold font-serif text-[#1A1A1A] mb-6"
          >
            Our Services
          </motion.h2>
          <motion.p
            variants={staggerItemVariant}
            className="text-gray-500 font-sans text-lg md:text-xl max-w-2xl mx-auto"
          >
            From cozy homes to grand commercial spaces, we craft environments that inspire.
          </motion.p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
        >
          {services.map((service, index) => (
            <motion.a
              key={index}
              href={service.href}
              variants={staggerItemVariant}
              className="bg-white rounded-[2rem] p-4 flex flex-col shadow-[0_10px_35px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(217,119,54,0.08)] hover:-translate-y-2 transition-all duration-500 group cursor-pointer no-underline block"
            >
              {/* Image Container Wrapper */}
              <div className="relative w-full aspect-[4/3] mb-12 rounded-[1.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.05)] group-hover:shadow-[0_25px_50px_rgba(217,119,54,0.18)] group-hover:-translate-y-2 group-hover:scale-[1.02] transition-all duration-500 ease-out z-10">
                {/* Image Mask */}
                <div className="absolute inset-0 w-full h-full rounded-[1.5rem] overflow-hidden">
                  <img
                    src={service.img}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>

                {/* Icon Block */}
                <div className="absolute -bottom-6 left-6 w-14 h-14 bg-[#FAF7F2] rounded-2xl flex items-center justify-center shadow-md z-20 border border-white/50">
                  {service.icon}
                </div>
              </div>

              {/* Content */}
              <div className="px-4 pb-4 flex-grow flex flex-col">
                <h3 className="text-3xl font-bold font-serif text-[#1A1A1A] mb-4">
                  {service.title}
                </h3>
                <p className="text-[#666666] leading-relaxed font-sans flex-grow">
                  {service.desc}
                </p>

                {/* Arrow */}
                <div className="mt-6 flex justify-end">
                  <ArrowUpRight className="w-6 h-6 text-[#D97736] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Bottom Link */}
        <motion.div
          className="mt-16 text-center"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
        >
          <a
            href="/services"
            className="inline-flex items-center gap-2 bg-transparent hover:bg-[#D97736] border-2 border-[#D97736] text-[#D97736] hover:text-white px-6 py-3 md:px-8 md:py-3.5 rounded-full font-sans font-medium text-base md:text-lg transition-all duration-300 shadow-sm hover:shadow-[0_8px_20px_rgba(217,119,54,0.15)] group"
          >
            Explore All Services
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default Services;

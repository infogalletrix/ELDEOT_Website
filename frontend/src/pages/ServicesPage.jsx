import React, { useEffect } from 'react';
import { Home, Building2, Store, CheckCircle2, ArrowRight, Lightbulb, PenTool, Ruler, Paintbrush } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import servicesHeroBg from '../assets/2.png';
import servicesImage1 from '../assets/services 2a.png';
import servicesImage2 from '../assets/service3a.png';
import servicesImage3 from '../assets/service4a.png';

const ServicesPage = () => {

  useEffect(() => {
    const handleScrollToHash = () => {
      if (window.location.hash) {
        setTimeout(() => {
          const element = document.getElementById(window.location.hash.slice(1));
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } else {
        window.scrollTo(0, 0);
      }
    };

    handleScrollToHash();
    
    // Listen for hash changes if navigating within the same page
    window.addEventListener('hashchange', handleScrollToHash);
    return () => window.removeEventListener('hashchange', handleScrollToHash);
  }, []);
  const homeServiceFeatures = [
    "Living Room & Bedroom Design",
    "Custom Furniture Selection",
    "Lighting Design",
    "Kitchen & Bathroom Remodeling",
    "color & Material Consultation"
  ];

  const officeServiceFeatures = [
    "Open Plan & Private Offices",
    "Reception & Lobby Areas",
    "Brand Integration",
    "Meeting Room Design",
    "Ergonomic Solutions"
  ];

  const commercialServiceFeatures = [
    "Restaurant & Café Design",
    "Retail Store Layouts",
    "Customer Journey Mapping",
    "Hotel & Hospitality Spaces",
    "Exhibition & Showroom Design"
  ];

  const processSteps = [
    {
      step: "Step 1",
      title: "Consultation",
      description: "We discuss your vision, needs, and budget",
      icon: <Lightbulb className="w-8 h-8 text-[#D97736]" />
    },
    {
      step: "Step 2",
      title: "Design",
      description: "We create detailed plans and moodboards for your space",
      icon: <PenTool className="w-8 h-8 text-[#D97736]" />
    },
    {
      step: "Step 3",
      title: "Execution",
      description: "Our team manages every detail of the construction",
      icon: <Ruler className="w-8 h-8 text-[#D97736]" />
    },
    {
      step: "Step 4",
      title: "Final Styling",
      description: "We add the finishing touches to bring your vision to life",
      icon: <Paintbrush className="w-8 h-8 text-[#D97736]" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans selection:bg-[#D97736] selection:text-white">
      {/* Navbar with transparent background and active Services link */}
      <Navbar isTransparent={true} activeLink="Services" />
      
      {/* Services Hero Section */}
      <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center">
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${servicesHeroBg})` }}
        >
          {/* Dark gradient overlay to make text readable and blend edges */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/20"></div>
          {/* Radial dark overlay to match the shadow around the edges */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 md:px-6 text-center text-white flex flex-col items-center pt-24">
          <p className="text-[#D97736] font-sans font-medium tracking-widest uppercase text-sm mb-6 drop-shadow-md">
            OUR SERVICES
          </p>
          <h1 className="text-5xl md:text-[64px] font-bold font-serif mb-8 leading-[1.1] drop-shadow-lg">
            Design Solutions for <br /> Every Space
          </h1>
          <p className="text-lg md:text-xl text-gray-200 font-sans leading-relaxed max-w-[700px] drop-shadow-md">
            From residential havens to commercial landmarks, we bring creativity and expertise to every project.
          </p>
        </div>
      </section>

      {/* Detailed Service Section 1 (Home) */}
      <section id="home-interior" className="py-24 px-4 md:px-6 lg:px-12 bg-white">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Image */}
          <div className="w-full relative rounded-2xl overflow-hidden shadow-lg">
            <img 
              src={servicesImage1} 
              alt="Home Interior Design" 
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Right Content */}
          <div className="flex flex-col items-start">
            {/* Icon */}
            <div className="mb-6">
              <Home className="w-[42px] h-[42px] text-[#D97736]" strokeWidth={2} />
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-[42px] font-bold font-serif text-[#1A1A1A] mb-6">
              Home Interior Design
            </h2>

            {/* Description */}
            <p className="text-[#666666] font-sans text-lg leading-relaxed mb-10 max-w-[600px]">
              Create a home that tells your story. Our residential design service covers everything from single rooms to complete home makeovers.
            </p>

            {/* Features List */}
            <ul className="flex flex-col gap-4 mb-12">
              {homeServiceFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-4 text-[#333333] font-sans text-[17px]">
                  <CheckCircle2 className="w-[22px] h-[22px] text-green-600 shrink-0" strokeWidth={1.5} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <a 
              href="/get-quote?section=details" 
              className="flex items-center justify-center gap-2 bg-[#D97736] text-white px-8 py-4 rounded-xl font-sans font-medium text-[17px] hover:bg-[#b86128] transition-colors shadow-lg shadow-[#D97736]/20"
            >
              Get a Quote
              <ArrowRight className="w-5 h-5 ml-1" />
            </a>
          </div>
        </div>
      </section>

      {/* Detailed Service Section 2 (Office) */}
      <section id="office-design" className="py-24 px-4 md:px-6 lg:px-12 bg-[#FAF7F2]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Content */}
          <div className="flex flex-col items-start order-2 lg:order-1">
            {/* Icon */}
            <div className="mb-6">
              <Building2 className="w-[42px] h-[42px] text-[#D97736]" strokeWidth={2} />
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-[42px] font-bold font-serif text-[#1A1A1A] mb-6">
              Office Interior Design
            </h2>

            {/* Description */}
            <p className="text-[#666666] font-sans text-lg leading-relaxed mb-10 max-w-[600px]">
              Design workspaces that boost productivity and reflect your brand identity. From startups to corporate office
            </p>

            {/* Features List */}
            <ul className="flex flex-col gap-4 mb-12">
              {officeServiceFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-4 text-[#333333] font-sans text-[17px]">
                  <CheckCircle2 className="w-[22px] h-[22px] text-green-600 shrink-0" strokeWidth={1.5} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <a 
              href="/get-quote?section=details" 
              className="flex items-center justify-center gap-2 bg-[#D97736] text-white px-8 py-4 rounded-xl font-sans font-medium text-[17px] hover:bg-[#b86128] transition-colors shadow-lg shadow-[#D97736]/20"
            >
              Get a Quote
              <ArrowRight className="w-5 h-5 ml-1" />
            </a>
          </div>

          {/* Right Image */}
          <div className="w-full relative rounded-2xl overflow-hidden shadow-lg order-1 lg:order-2">
            <img 
              src={servicesImage2} 
              alt="Office Interior Design" 
              className="w-full h-auto object-cover"
            />
          </div>

        </div>
      </section>

      {/* Detailed Service Section 3 (Commercial) */}
      <section id="commercial-design" className="py-24 px-4 md:px-6 lg:px-12 bg-white">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Image */}
          <div className="w-full relative rounded-2xl overflow-hidden shadow-lg">
            <img 
              src={servicesImage3} 
              alt="Commercial Design" 
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Right Content */}
          <div className="flex flex-col items-start">
            {/* Icon */}
            <div className="mb-6">
              <Store className="w-[42px] h-[42px] text-[#D97736]" strokeWidth={2} />
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-[42px] font-bold font-serif text-[#1A1A1A] mb-6">
              Commercial Design
            </h2>

            {/* Description */}
            <p className="text-[#666666] font-sans text-lg leading-relaxed mb-10 max-w-[600px]">
              Create memorable customer experiences with our commercial design expertise. Hotels, restaurants, retail, and more
            </p>

            {/* Features List */}
            <ul className="flex flex-col gap-4 mb-12">
              {commercialServiceFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-4 text-[#333333] font-sans text-[17px]">
                  <CheckCircle2 className="w-[22px] h-[22px] text-green-600 shrink-0" strokeWidth={1.5} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <a 
              href="/get-quote?section=details" 
              className="flex items-center justify-center gap-2 bg-[#D97736] text-white px-8 py-4 rounded-xl font-sans font-medium text-[17px] hover:bg-[#b86128] transition-colors shadow-lg shadow-[#D97736]/20"
            >
              Get a Quote
              <ArrowRight className="w-5 h-5 ml-1" />
            </a>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-4 md:px-6 lg:px-12 bg-[#FAF7F2]">
        <div className="max-w-[1400px] mx-auto text-center">
          <p className="text-[#D97736] font-sans font-medium tracking-widest uppercase text-sm mb-4">
            OUR PROCESS
          </p>
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-[#1A1A1A] mb-20">
            How We Work
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {processSteps.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                {/* Icon Container */}
                <div className="w-20 h-20 bg-[#E8E2D9] rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                  {item.icon}
                </div>
                
                {/* Step Label */}
                <p className="text-[#D97736] font-sans font-medium mb-3">
                  {item.step}
                </p>

                {/* Heading */}
                <h3 className="text-2xl font-bold font-serif text-[#1A1A1A] mb-4">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-[#666666] font-sans leading-relaxed max-w-[280px]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesPage;

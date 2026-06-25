import React from 'react';
import { Sparkles, Wand2, Zap, Palette, ArrowRight } from 'lucide-react';
import img3 from '../assets/homethree.png';

const AITechnology = () => {
  const features = [
    {
      icon: <Wand2 className="w-6 h-6 text-[#D97736]" />,
      title: "AI Design Generation",
      desc: "Describe your dream room and watch AI bring it to life"
    },
    {
      icon: <Zap className="w-6 h-6 text-[#D97736]" />,
      title: "Instant Quotations",
      desc: "Get detailed cost breakdowns in seconds"
    },
    {
      icon: <Palette className="w-6 h-6 text-[#D97736]" />,
      title: "Style Customization",
      desc: "Choose from multiple styles, colors, and budgets"
    }
  ];

  return (
    <section className="bg-white py-24 px-4 md:px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Left Content */}
        <div className="flex flex-col items-start">
          
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 mb-6 text-[#D97736] font-sans font-medium tracking-wide uppercase text-sm">
            <Sparkles className="w-4 h-4" />
            <span>AI TECHNOLOGY</span>
          </div>

          {/* Headline */}
          <h2 className="text-5xl md:text-[56px] font-bold font-serif text-[#1A1A1A] leading-[1.1] mb-6">
            Design Powered by <br />
            <span className="text-[#D97736]">Artificial Intelligence</span>
          </h2>

          {/* Description */}
          <p className="text-[#666666] font-sans text-lg leading-relaxed mb-12 max-w-[500px]">
            Our AI interior design tool uses cutting-edge technology to generate photorealistic room designs based on your preferences. Simply select your room type, style, and color palette.
          </p>

          {/* Features List */}
          <div className="flex flex-col gap-8 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-6">
                <div className="w-[60px] h-[60px] shrink-0 bg-white rounded-2xl flex items-center justify-center shadow-[0_8px_30px_rgb(217,119,54,0.12)]">
                  {feature.icon}
                </div>
                <div className="pt-1">
                  <h3 className="text-[22px] font-bold font-serif text-[#1A1A1A] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[#666666] font-sans text-[15px]">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button 
            type="button"
            className="inline-flex items-center gap-3 bg-[#D97736] text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-sans font-medium text-[15px] md:text-[17px] hover:bg-[#b86128] transition-colors shadow-lg shadow-[#D97736]/20 cursor-pointer"
          >
            AI Designer
            <ArrowRight className="w-5 h-5 ml-1" />
          </button>
        </div>

        {/* Right Image */}
        <div className="w-full relative rounded-[2rem] overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.06)] hover:shadow-[0_30px_60px_rgba(217,119,54,0.12)] transition-all duration-500 group">
          <img 
            src={img3} 
            alt="AI Interior Design Technology" 
            className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>

      </div>
    </section>
  );
};

export default AITechnology;

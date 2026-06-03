import React, { useState, useEffect } from 'react';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import portfolioBg from '../assets/portfoliocover.png';
import p2a1 from '../assets/p2a1.png';
import p2a2 from '../assets/p2a2.png';
import p2a3 from '../assets/p2a3.png';
import p2b1 from '../assets/p2b1.png';
import p2b2 from '../assets/p2b2.png';
import p2b3 from '../assets/p2b3.png';
import p2c1 from '../assets/p2c1.png';
import p2c2 from '../assets/p2c2.png';
import { API_BASE_URL } from '../config';

const ProjectCard = ({ project }) => {
  const images = [project.image, ...(project.additionalImages || [])];
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevImage = () => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300">
      <div className="relative w-full h-[280px] group">
        <img src={images[currentIndex]} alt={project.title} className="w-full h-full object-cover transition-opacity duration-500" />
        
        {images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white backdrop-blur-md p-1.5 rounded-full text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white backdrop-blur-md p-1.5 rounded-full text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentIndex ? 'bg-white' : 'bg-white/40'}`} 
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="p-8">
        <h3 className="text-[26px] font-bold font-serif text-[#1A1A1A] mb-3">
          {project.title}
        </h3>
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="w-[18px] h-[18px] text-[#D97736]" />
          <span className="text-[#666666] font-sans text-[15px]">{project.location}</span>
        </div>
        <div className="inline-block bg-[#FAF7F2] text-[#D97736] px-4 py-1.5 rounded-full text-xs font-semibold tracking-[0.05em] uppercase">
          {project.category}
        </div>
      </div>
    </div>
  );
};

const PortfolioPage = () => {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [dbProjects, setDbProjects] = useState([]);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/Portfolio`)
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Backend responded with error");
      })
      .then(data => {
        const formatted = data.map(item => {
          let addImages = [];
          try {
            if (item.additionalImages && item.additionalImages !== '[]') {
              addImages = JSON.parse(item.additionalImages).map(p => `${API_BASE_URL}${p}`);
            }
          } catch (e) {
            console.error("Failed to parse additional images for item:", item.id);
          }
          return {
            id: `db-${item.id}`,
            title: item.title,
            location: item.location,
            category: item.category,
            image: `${API_BASE_URL}${item.imagePath}`,
            additionalImages: addImages
          };
        });
        setDbProjects(formatted);
        setUseFallback(false);
      })
      .catch(err => {
        console.error("Error fetching db portfolio, falling back to static projects:", err);
        setUseFallback(true);
      });
  }, []);

  const categories = ['ALL', 'Residential', 'Commercial', 'Office', 'Hospitality'];

  const projects = [
    { id: 1, title: 'Modern Loft Apartment', location: 'New York, NY', category: 'Residential', image: p2a1 },
    { id: 2, title: 'Luxury Boutique Hotel', location: 'Miami, FL', category: 'Hospitality', image: p2a2 },
    { id: 3, title: 'Artisan Café', location: 'Austin, TX', category: 'Commercial', image: p2a3 },
    { id: 4, title: 'The Copper Bean', location: 'Melbourne, Australia', category: 'Commercial', image: p2b1 },
    { id: 5, title: 'Contemporary Urban Living', location: 'Chicago, IL', category: 'Residential', image: p2b2 },
    { id: 6, title: 'Nexa Creative Workspace', location: 'London, UK', category: 'Office', image: p2b3 },
    { id: 7, title: 'Vertex Corporate', location: 'Toronto, Canada', category: 'Office', image: p2c1 },
    { id: 8, title: 'Nexa Creative Office Room', location: 'New York, NY', category: 'Office', image: p2c2 }
  ];

  const allProjects = useFallback ? projects : dbProjects;

  const filteredProjects = activeFilter === 'ALL' 
    ? allProjects 
    : allProjects.filter(p => p.category.toUpperCase() === activeFilter.toUpperCase());

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans selection:bg-[#D97736] selection:text-white">
      {/* Navbar with transparent background and active Portfolio link */}
      <Navbar isTransparent={true} activeLink="Portfolio" />
      
      {/* Portfolio Hero Section */}
      <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center">
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${portfolioBg})` }}
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
          <p className="text-lg md:text-xl text-gray-200 font-sans leading-relaxed max-w-[700px] drop-shadow-md mb-8">
            From residential havens to commercial landmarks, we bring creativity and expertise to every project.
          </p>


        </div>
      </section>

      {/* Portfolio Grid Section */}
      <section className="py-24 px-4 md:px-6 lg:px-12 bg-white">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Filters */}
          <div className="flex justify-center mb-16 px-4">
            <div className="flex flex-wrap sm:inline-flex items-center justify-center gap-2.5 sm:gap-2 bg-transparent sm:bg-[#F5F2ED] p-0 sm:p-1.5 rounded-full max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-5 sm:px-6 py-2.5 sm:py-2 rounded-full font-sans text-[15px] whitespace-nowrap transition-all duration-300 cursor-pointer font-medium ${
                    activeFilter === cat 
                      ? 'bg-[#D97736] sm:bg-white text-white sm:text-[#1A1A1A] shadow-[0_4px_12px_rgba(217,119,54,0.2)] sm:shadow-[0_2px_8px_rgb(0,0,0,0.08)]' 
                      : 'bg-white sm:bg-transparent border border-gray-200 sm:border-transparent text-[#666666] hover:text-[#1A1A1A] hover:border-gray-300'
                  }`}
                >
                  {cat === 'ALL' ? 'ALL' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PortfolioPage;

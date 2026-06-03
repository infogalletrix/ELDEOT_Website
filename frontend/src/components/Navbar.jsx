import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import logoImg from '../assets/Logo.png';

const Navbar = ({ isTransparent = true, activeLink = 'Home' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/', active: activeLink === 'Home' },
    { name: 'Services', href: '/services', active: activeLink === 'Services' },
    { name: 'Portfolio', href: '/portfolio', active: activeLink === 'Portfolio' },
    // { name: 'AI Designer', href: '/ai-designer', active: activeLink === 'AI Designer' },
    { name: 'Get Quote', href: '/get-quote', active: activeLink === 'Get Quote' },
    { name: 'Contact', href: '/contact', active: activeLink === 'Contact' },
  ];

  const navBgClass = isTransparent ? 'bg-transparent absolute top-0 left-0' : 'bg-white sticky top-0 border-b border-gray-100 shadow-sm';
  const logoTextClass = isTransparent ? 'text-white' : 'text-[#1A1A1A]';
  const menuIconClass = isTransparent ? 'text-white' : 'text-gray-800';
  const linkTextClass = isTransparent ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-[#1A1A1A]';
  const profileBorderClass = isTransparent ? 'border-gray-400 text-white hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-50';

  return (
    <nav className={`${navBgClass} z-50 w-full min-h-[140px] py-4 flex items-center`}>
      <div className="w-full max-w-[1400px] mx-auto px-8 lg:px-16 flex items-center justify-between">
        
        {/* Logo Section */}
        <a href="/" className="flex items-center gap-3 cursor-pointer">
          <img 
            src={logoImg} 
            alt="ELDE'OT Logo" 
            className="h-16 w-auto object-contain transition-transform duration-300 hover:scale-105" 
          />
        </a>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center gap-8 font-sans font-medium text-[15px]">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a 
                href={link.href} 
                className={`transition-colors duration-200 ${
                  link.active ? 'text-[#D97736]' : linkTextClass
                }`}
              >
                {link.name}
              </a>
            </li>
          ))}
          <li className={`flex items-center gap-5 border-l ${isTransparent ? 'border-white/20' : 'border-gray-200'} pl-6 ml-2`}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={`${linkTextClass} hover:text-[#D97736] transition-transform hover:scale-110`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={`${linkTextClass} hover:text-[#D97736] transition-transform hover:scale-110`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
          </li>
        </ul>



        {/* Mobile Menu Toggle */}
        <button 
          className={`lg:hidden p-2 focus:outline-none ${menuIconClass}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-black/90 backdrop-blur-md shadow-lg font-sans border-t border-white/10">
          <ul className="flex flex-col px-8 py-6 gap-6 text-lg font-medium">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a 
                  href={link.href} 
                  className={`block transition-colors ${
                    link.active ? 'text-[#D97736]' : 'text-gray-300 hover:text-white'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              </li>
            ))}
            
            <li className="flex items-center gap-6 mt-4 pt-6 border-t border-white/10">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#D97736] transition-transform hover:scale-110">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#D97736] transition-transform hover:scale-110">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

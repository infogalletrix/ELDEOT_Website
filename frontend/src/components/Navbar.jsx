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

          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

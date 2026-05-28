import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import logoImg from '../assets/GREY logo.jpg';
import whatsappLogoImg from '../assets/WhatsApp-BW-Logo.png';

const Footer = () => {
  return (
    <footer className="bg-[#2c2825] pt-20 pb-3 px-8 lg:px-16">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Column 1: Brand */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-3 mb-6 cursor-pointer">
              <img 
                src={logoImg} 
                alt="ELDE'OT Logo" 
                className="h-16 w-auto object-contain" 
              />
            </div>
            {/* Social Icons */}
            <div className="flex gap-4 justify-center w-full max-w-[208px] mt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 hover:border-[#D97736] hover:bg-[#D97736] text-gray-400 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 hover:border-[#D97736] hover:bg-[#D97736] text-gray-400 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-serif font-bold text-lg mb-8">Quick Links</h4>
            <ul className="flex flex-col gap-4">
              {[
                { name: 'Services', href: '/services' },
                { name: 'Portfolio', href: '/portfolio' },
                { name: 'Get Quote', href: '/get-quote' }
              ].map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-400 hover:text-[#D97736] transition-colors font-sans text-[15px]">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4 className="text-white font-serif font-bold text-lg mb-8">Services</h4>
            <ul className="flex flex-col gap-4">
              {[
                { name: 'Home Interior Design', href: '/services' },
                { name: 'Office Design', href: '/services' },
                { name: 'Commercial Spaces', href: '/services' }
              ].map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-400 hover:text-[#D97736] transition-colors font-sans text-[15px]">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-white font-serif font-bold text-lg mb-8">Contact</h4>
            <ul className="flex flex-col gap-5">
              <li className="text-gray-400 font-sans text-[15px]">
                <a href="mailto:hello@eldeot.design" className="flex items-center gap-3 hover:text-[#D97736] transition-colors group">
                  <Mail className="w-5 h-5 text-gray-400 group-hover:text-[#D97736] transition-colors shrink-0" />
                  <span>hello@eldeot.design</span>
                </a>
              </li>
              <li className="text-gray-400 font-sans text-[15px]">
                <a href="tel:+919790370405" className="flex items-center gap-3 hover:text-[#D97736] transition-colors group">
                  <Phone className="w-5 h-5 text-gray-400 group-hover:text-[#D97736] transition-colors shrink-0" />
                  <span>+91 97903 70405</span>
                </a>
              </li>
              <li className="text-gray-400 font-sans text-[15px]">
                <a href="https://wa.me/919790370405" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#D97736] transition-colors group">
                  <div 
                    className="w-5 h-5 shrink-0 bg-gray-400 group-hover:bg-[#D97736] transition-colors"
                    style={{
                      WebkitMaskImage: `url(${whatsappLogoImg})`,
                      WebkitMaskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                      maskImage: `url(${whatsappLogoImg})`,
                      maskSize: 'contain',
                      maskRepeat: 'no-repeat',
                      maskPosition: 'center'
                    }}
                    aria-label="WhatsApp"
                  />
                  <span>+91 97903 70405 (WhatsApp)</span>
                </a>
              </li>
              <li className="text-gray-400 font-sans text-[15px]">
                <a href="https://maps.app.goo.gl/KNjPHsLbsqbhjPBk6?g_st=ic" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:text-[#D97736] transition-colors group">
                  <MapPin className="w-5 h-5 text-gray-400 group-hover:text-[#D97736] transition-colors shrink-0 mt-0.5" />
                  <span>ELDE'OT Interiors, BY- pass road, Kanjanayakanpatti, Vellai Kottai, Aruppukkottai, Tamil Nadu 626101</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-6 pt-3 border-t border-white/10 text-center">
          <p className="text-gray-400 font-sans text-sm">
            &copy; {new Date().getFullYear()} ELDE'OT Interiors. All rights reserved.
          </p>
        </div>

        {/* Credit */}
        <div className="mt-16 text-right">
          <span className="text-gray-500 font-sans text-[10px] tracking-wide opacity-80">
            Developed by Galletrix Innovations
          </span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

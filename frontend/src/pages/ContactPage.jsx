import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import contactBg from '../assets/contact.png';
import contactInfoImage from '../assets/cdown.png';
import { API_BASE_URL } from '../config';
import whatsappLogoImg from '../assets/WhatsApp-BW-Logo.png';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceNeeded: '',
    message: ''
  });
  const [countryCode, setCountryCode] = useState('+91');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: digitsOnly }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.phone.length !== 10) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }
    try {
      const submissionData = {
        ...formData,
        phone: `${countryCode} ${formData.phone}`
      };
      const response = await fetch(`${API_BASE_URL}/api/Contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });
      if (response.ok) {
        alert('Message sent successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          serviceNeeded: '',
          message: ''
        });
        setCountryCode('+91');
      } else {
        alert('Failed to send message.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans selection:bg-[#D97736] selection:text-white">
      <Navbar isTransparent={true} activeLink="Contact" />
      
      {/* Contact Hero Section */}
      <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center">
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${contactBg})` }}
        >
          {/* Dark gradient overlay to make text readable and blend edges */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/20"></div>
          {/* Radial dark overlay to match the shadow around the edges */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 md:px-6 text-center text-white flex flex-col items-center pt-24">
          
          {/* Pill Badge */}
          <div className="bg-[#FAF7F2] text-[#D97736] px-8 py-2.5 rounded-full font-sans font-medium text-[17px] mb-8 shadow-lg">
            Get in Touch
          </div>

          <h1 className="text-5xl md:text-[68px] font-bold font-serif mb-8 leading-[1.1] drop-shadow-lg">
            Contact Us
          </h1>
          <p className="text-lg md:text-[21px] text-gray-200 font-sans leading-relaxed max-w-[800px] drop-shadow-md">
            Ready to start your project? Reach out for a free consultation
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 px-4 md:px-6 lg:px-12 bg-[#FAF7F2] mt-4">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left Column: Contact Info & Image */}
          <div className="flex flex-col gap-12">
            
            {/* Contact Details Grid */}
            <div className="flex flex-col gap-8 ml-2">
              {/* Email */}
              <a href="mailto:hello@eldeol.design" className="flex items-center gap-6 group">
                <div className="w-[64px] h-[64px] bg-[#F5E6DA] rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#D97736] group-hover:text-white transition-colors duration-300">
                  <Mail className="w-7 h-7 text-[#D97736] group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-gray-500 font-sans text-[15px] mb-1">Email</p>
                  <p className="text-[#1A1A1A] font-sans font-medium text-[17px] group-hover:text-[#D97736] transition-colors">hello@eldeol.design</p>
                </div>
              </a>

              {/* Phone */}
              <a href="tel:+919790370405" className="flex items-center gap-6 group">
                <div className="w-[64px] h-[64px] bg-[#F5E6DA] rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#D97736] group-hover:text-white transition-colors duration-300">
                  <Phone className="w-7 h-7 text-[#D97736] group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-gray-500 font-sans text-[15px] mb-1">Phone</p>
                  <p className="text-[#1A1A1A] font-sans font-medium text-[17px] group-hover:text-[#D97736] transition-colors">+91 97903 70405</p>
                </div>
              </a>

              {/* WhatsApp */}
              <a href="https://wa.me/919790370405" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 group">
                <div className="w-[64px] h-[64px] bg-[#F5E6DA] rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#D97736] group-hover:text-white transition-colors duration-300">
                  <div 
                    className="w-7 h-7 bg-[#D97736] group-hover:bg-white transition-colors duration-300"
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
                </div>
                <div>
                  <p className="text-gray-500 font-sans text-[15px] mb-1">WhatsApp</p>
                  <p className="text-[#1A1A1A] font-sans font-medium text-[17px] group-hover:text-[#D97736] transition-colors">
                    +91 97903 70405
                  </p>
                </div>
              </a>

              {/* Address */}
              <a href="https://maps.app.goo.gl/KNjPHsLbsqbhjPBk6?g_st=ic" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 group">
                <div className="w-[64px] h-[64px] bg-[#F5E6DA] rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#D97736] group-hover:text-white transition-colors duration-300">
                  <MapPin className="w-7 h-7 text-[#D97736] group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-gray-500 font-sans text-[15px] mb-1">Address</p>
                  <p className="text-[#1A1A1A] font-sans font-medium text-[17px] group-hover:text-[#D97736] transition-colors">ELDE'OT Interiors, BY- pass road, Kanjanayakanpatti, Vellai Kottai, Aruppukkottai, Tamil Nadu 626101</p>
                </div>
              </a>

              {/* Hours */}
              <div className="flex items-center gap-6">
                <div className="w-[64px] h-[64px] bg-[#F5E6DA] rounded-2xl flex items-center justify-center shrink-0">
                  <Clock className="w-7 h-7 text-[#D97736]" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-gray-500 font-sans text-[15px] mb-1">Hours</p>
                  <p className="text-[#1A1A1A] font-sans font-medium text-[17px]">Mon-Fir : 9 am-6pm</p>
                </div>
              </div>
            </div>

            {/* Social Media Profiles */}
            <div className="flex flex-wrap gap-8 ml-2 mt-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                <div className="w-[64px] h-[64px] bg-[#F5E6DA] rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#D97736] group-hover:text-white transition-colors duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-[#D97736] group-hover:text-white transition-colors duration-300">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 font-sans text-[15px] mb-1">Facebook</p>
                  <p className="text-[#1A1A1A] font-sans font-medium text-[17px] group-hover:text-[#D97736] transition-colors">eldeol.design</p>
                </div>
              </a>

              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                <div className="w-[64px] h-[64px] bg-[#F5E6DA] rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#D97736] group-hover:text-white transition-colors duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-[#D97736] group-hover:text-white transition-colors duration-300">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 font-sans text-[15px] mb-1">Instagram</p>
                  <p className="text-[#1A1A1A] font-sans font-medium text-[17px] group-hover:text-[#D97736] transition-colors">@eldeol.design</p>
                </div>
              </a>
            </div>

            {/* Bottom Image */}
            <div className="w-full h-64 md:h-[300px] rounded-[24px] overflow-hidden mt-4 shadow-[0_4px_24px_rgb(0,0,0,0.06)]">
              <img src={contactInfoImage} alt="Interior detail" className="w-full h-full object-cover" />
            </div>

          </div>

          {/* Right Column: Form */}
          <div className="bg-white rounded-[24px] p-8 md:p-12 shadow-[0_4px_24px_rgb(0,0,0,0.04)] h-fit">
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Full Name */}
                <div>
                  <label className="block text-[#333333] font-sans mb-3 text-[15px]">Full Name *</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="John Doe"
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 text-gray-500 font-sans focus:outline-none focus:border-[#D97736] bg-white placeholder-gray-400"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[#333333] font-sans mb-3 text-[15px]">Email *</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="John Doe" 
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 text-gray-500 font-sans focus:outline-none focus:border-[#D97736] bg-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Phone */}
                <div>
                  <label className="block text-[#333333] font-sans mb-3 text-[15px]">Phone Number *</label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="h-12 px-3 rounded-xl border border-gray-200 text-gray-500 font-sans focus:outline-none focus:border-[#D97736] bg-white w-[110px] shrink-0"
                    >
                      <option value="+91">India (+91)</option>
                      <option value="+1">USA (+1)</option>
                      <option value="+44">UK (+44)</option>
                      <option value="+61">Aus (+61)</option>
                      <option value="+971">UAE (+971)</option>
                    </select>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="10-digit number" 
                      className="flex-1 h-12 px-4 rounded-xl border border-gray-200 text-gray-500 font-sans focus:outline-none focus:border-[#D97736] bg-white placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Service Needed */}
                <div>
                  <label className="block text-[#333333] font-sans mb-3 text-[15px]">Service Needed</label>
                  <select 
                    name="serviceNeeded"
                    value={formData.serviceNeeded}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 text-gray-500 font-sans focus:outline-none focus:border-[#D97736] appearance-none bg-white"
                  >
                    <option value="" disabled>Select a service</option>
                    <option value="Residential Design">Residential Design</option>
                    <option value="Commercial Design">Commercial Design</option>
                    <option value="Office Design">Office Design</option>
                    <option value="Consultation">Consultation</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-[#333333] font-sans mb-3 text-[15px]">Message *</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 rounded-xl border border-gray-200 text-gray-600 font-sans focus:outline-none focus:border-[#D97736] bg-white min-h-[160px] resize-y"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                className="w-full h-14 bg-[#D97736] text-white rounded-xl font-sans font-medium text-[17px] flex items-center justify-center hover:bg-[#b86128] transition-colors mt-2"
              >
                Send Message
              </button>

            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;

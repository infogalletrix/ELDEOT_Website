// AIDesignerPage.jsx has been disabled as per requirements.
// Below is the placeholder component, followed by the commented-out original code.

import React from 'react';

const AIDesignerPage = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2>AI Designer Page</h2>
      <p>This page has been disabled.</p>
    </div>
  );
};

export default AIDesignerPage;

/*
import React, { useState, useRef } from 'react';
import { Armchair, PaintBucket, Palette, DollarSign, Sparkles, Upload, FileUp, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import aiBg from '../assets/AI.png';
import { API_BASE_URL } from '../config';

const AIDesignerPage = () => {
  const [formData, setFormData] = useState({
    roomType: '',
    designStyle: '',
    colorPreferences: '',
    budgetRange: '',
    additionalNotes: ''
  });
  
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [floorPlan, setFloorPlan] = useState(null);
  const fileInputRef = useRef(null);
  const floorPlanInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  const handleImageFile = (file) => {
    if (file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage({ file, preview: e.target.result });
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image file.');
    }
  };

  const handleFloorPlanChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFloorPlan({ file: e.target.files[0], name: e.target.files[0].name });
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFloorPlan = () => {
    setFloorPlan(null);
    if (floorPlanInputRef.current) floorPlanInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitData = new FormData();
    submitData.append('RoomType', formData.roomType);
    submitData.append('DesignStyle', formData.designStyle);
    submitData.append('ColorPreferences', formData.colorPreferences);
    submitData.append('BudgetRange', formData.budgetRange);
    submitData.append('AdditionalNotes', formData.additionalNotes);
    
    if (uploadedImage?.file) {
      submitData.append('Image', uploadedImage.file);
    }
    if (floorPlan?.file) {
      submitData.append('FloorPlan', floorPlan.file);
    }

    try {
      // Connect to the ASP.NET Core backend
      const response = await fetch(`${API_BASE_URL}/AIDesign`, {
        method: 'POST',
        body: submitData
      });

      if (response.ok) {
        alert('AI Design Request Submitted successfully! Our AI is processing your request.');
        // Reset form
        setFormData({
          roomType: '',
          designStyle: '',
          colorPreferences: '',
          budgetRange: '',
          additionalNotes: ''
        });
        setUploadedImage(null);
        setFloorPlan(null);
      } else {
        alert('Failed to submit request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the request. Make sure the backend is running.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans selection:bg-[#D97736] selection:text-white">
      {/* Navbar with transparent background and active AI Designer link * /}
      <Navbar isTransparent={true} activeLink="AI Designer" />
      
      {/* AI Designer Hero Section * /}
      <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center pt-20">
        {/* Background Image & Overlay * /}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${aiBg})` }}
        >
          {/* Dark gradient overlay to make navigation text readable * /}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/20"></div>
          {/* Radial dark overlay to match the shadow around the edges * /}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]"></div>
        </div>

        {/* Content Box with dark semi-transparent background * /}
        <div className="relative z-10 w-full max-w-[1000px] mx-auto px-4 md:px-6 py-16 text-center text-white bg-black/60 backdrop-blur-[2px]">
          <p className="font-sans text-[19px] mb-5 font-medium tracking-wide">
            AI-powered interior Design
          </p>
          <h1 className="text-5xl md:text-[68px] font-bold font-serif mb-6 leading-[1.1] drop-shadow-lg">
            AI Interior Designer
          </h1>
          <p className="text-[19px] text-gray-200 font-sans leading-relaxed max-w-[800px] mx-auto">
            Select your preferences and let our AI generate a stunning interior design for your space.
          </p>
        </div>
      </section>

      {/* Design Preferences Form Section * /}
      <section className="py-20 px-4 md:px-6 lg:px-12 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            
            {/* Left Column: Form Fields * /}
            <div>
              {/* Heading * /}
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="text-[#D97736] w-8 h-8" fill="#D97736" />
                  <h2 className="text-[32px] md:text-[40px] font-bold font-serif text-[#1A1A1A]">
                    Design Preferences
                  </h2>
                </div>
                <p className="text-[#666666] font-sans text-[17px] pl-10">
                  Tell your style and preferences
                </p>
              </div>

              <div className="space-y-6">
                {/* Room Type * /}
                <div className="flex gap-4">
                  <div className="w-12 h-12 shrink-0 bg-[#F5E6DA] rounded-xl flex items-center justify-center mt-1">
                    <Armchair className="text-[#D97736] w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[#333333] font-sans font-medium mb-2">Room Type *</label>
                    <select 
                      name="roomType"
                      value={formData.roomType}
                      onChange={handleInputChange}
                      required
                      className="w-full h-12 px-4 rounded-xl border border-gray-200 text-gray-600 font-sans focus:outline-none focus:border-[#D97736] appearance-none bg-white"
                    >
                      <option value="" disabled>Select room type</option>
                      <option value="Living Room">Living Room</option>
                      <option value="Bedroom">Bedroom</option>
                      <option value="Kitchen">Kitchen</option>
                      <option value="Bathroom">Bathroom</option>
                      <option value="Office">Office</option>
                    </select>
                  </div>
                </div>

                {/* Design Style * /}
                <div className="flex gap-4">
                  <div className="w-12 h-12 shrink-0 bg-[#F5E6DA] rounded-xl flex items-center justify-center mt-1">
                    <PaintBucket className="text-[#D97736] w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[#333333] font-sans font-medium mb-2">Design Style *</label>
                    <select 
                      name="designStyle"
                      value={formData.designStyle}
                      onChange={handleInputChange}
                      required
                      className="w-full h-12 px-4 rounded-xl border border-gray-200 text-gray-600 font-sans focus:outline-none focus:border-[#D97736] appearance-none bg-white"
                    >
                      <option value="" disabled>Select design style</option>
                      <option value="Modern">Modern</option>
                      <option value="Minimalist">Minimalist</option>
                      <option value="Industrial">Industrial</option>
                      <option value="Bohemian">Bohemian</option>
                      <option value="Scandinavian">Scandinavian</option>
                    </select>
                  </div>
                </div>

                {/* Color Preferences * /}
                <div className="flex gap-4">
                  <div className="w-12 h-12 shrink-0 bg-[#F5E6DA] rounded-xl flex items-center justify-center mt-1">
                    <Palette className="text-[#D97736] w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[#333333] font-sans font-medium mb-2">Color Preferences</label>
                    <div className="relative">
                      <input 
                        type="text"
                        name="colorPreferences"
                        value={formData.colorPreferences}
                        onChange={handleInputChange}
                        placeholder="e.g., Warm earth tones, blue and white"
                        className="w-full h-12 px-4 rounded-xl border border-gray-200 text-gray-600 font-sans focus:outline-none focus:border-[#D97736] bg-white pr-10"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Budget Range * /}
                <div className="flex gap-4">
                  <div className="w-12 h-12 shrink-0 bg-[#F5E6DA] rounded-xl flex items-center justify-center mt-1">
                    <DollarSign className="text-[#D97736] w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[#333333] font-sans font-medium mb-2">Budget Range</label>
                    <select 
                      name="budgetRange"
                      value={formData.budgetRange}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 rounded-xl border border-gray-200 text-gray-600 font-sans focus:outline-none focus:border-[#D97736] appearance-none bg-white"
                    >
                      <option value="" disabled>Select budget range</option>
                      <option value="$1k - $5k">$1k - $5k</option>
                      <option value="$5k - $10k">$5k - $10k</option>
                      <option value="$10k - $25k">$10k - $25k</option>
                      <option value="$25k+">$25k+</option>
                    </select>
                  </div>
                </div>

                {/* Additional Notes * /}
                <div className="flex gap-4">
                  <div className="w-12 h-12 shrink-0"></div>
                  <div className="flex-1">
                    <label className="block text-[#333333] font-sans font-medium mb-2">Additional Notes (Optional)</label>
                    <textarea 
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleInputChange}
                      placeholder="Any specific ideas or requirements ?"
                      className="w-full p-4 rounded-xl border border-gray-200 text-gray-600 font-sans focus:outline-none focus:border-[#D97736] bg-white min-h-[120px] resize-y"
                    ></textarea>
                  </div>
                </div>

                {/* Submit Button * /}
                <div className="flex gap-4 mt-8">
                  <div className="w-12 h-12 shrink-0"></div>
                  <button 
                    type="submit"
                    className="flex-1 h-14 bg-[#D97736] text-white rounded-xl font-sans font-semibold text-[17px] flex items-center justify-center gap-2 hover:bg-[#b86128] transition-colors shadow-lg shadow-[#D97736]/20"
                  >
                    <Sparkles className="w-5 h-5 text-white" fill="white" />
                    Generate Designer
                  </button>
                </div>

              </div>
            </div>

            {/* Right Column: Upload Area * /}
            <div>
              {/* Heading (Repeated as per design) * /}
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="text-[#D97736] w-8 h-8" fill="#D97736" />
                  <h2 className="text-[32px] md:text-[40px] font-bold font-serif text-[#1A1A1A]">
                    Design Preferences
                  </h2>
                </div>
                <p className="text-[#666666] font-sans text-[17px] pl-10">
                  Tell your style and preferences
                </p>
              </div>

              {/* Drag & Drop Zone * /}
              <div 
                className={`relative w-full h-[320px] rounded-2xl border-2 border-dashed ${dragActive ? 'border-[#D97736] bg-[#F5E6DA]/20' : 'border-[#D97736]/30 bg-[#FAF7F2]'} flex flex-col items-center justify-center transition-colors cursor-pointer`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange}
                />
                <div className="w-16 h-16 bg-[#F5E6DA] rounded-2xl flex items-center justify-center mb-6">
                  <Upload className="w-8 h-8 text-[#D97736]" />
                </div>
                <p className="text-xl font-serif font-medium text-[#1A1A1A] mb-2">
                  Drag & Drop your image here
                </p>
                <p className="text-gray-500 font-sans text-sm mb-6">
                  or click to browse
                </p>
                <p className="text-gray-400 font-sans text-xs">
                  Supports : JPG, PNG, WebP | Max size : 10 MB
                </p>
              </div>

              {/* Divider * /}
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-[#666666] font-sans text-sm px-4 py-2 rounded-full border border-gray-200 bg-white">or</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* Floor Plan Upload * /}
              <div className="flex justify-center mb-8">
                <input 
                  ref={floorPlanInputRef}
                  type="file" 
                  accept=".pdf,image/*" 
                  className="hidden" 
                  onChange={handleFloorPlanChange}
                />
                <button 
                  type="button"
                  onClick={() => floorPlanInputRef.current?.click()}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#D97736] text-[#D97736] font-sans font-medium hover:bg-[#F5E6DA]/20 transition-colors"
                >
                  <FileUp className="w-5 h-5" />
                  Upload Floor Plan
                </button>
              </div>

              {/* Recently Uploaded Previews * /}
              {(uploadedImage || floorPlan) && (
                <div>
                  <p className="text-[#1A1A1A] font-sans font-medium mb-4">Recently Uploaded</p>
                  <div className="flex flex-wrap gap-4">
                    {uploadedImage && (
                      <div className="relative w-[100px] h-[100px] rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                        <img src={uploadedImage.preview} alt="Upload preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeImage(); }}
                          className="absolute top-1 right-1 w-6 h-6 bg-black/40 rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    {floorPlan && (
                      <div className="relative w-[100px] h-[100px] rounded-xl bg-gray-50 border border-gray-200 shadow-sm flex flex-col items-center justify-center p-2 text-center">
                        <FileUp className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-[10px] text-gray-600 truncate w-full px-1">{floorPlan.name}</span>
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeFloorPlan(); }}
                          className="absolute top-1 right-1 w-6 h-6 bg-black/40 rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AIDesignerPage;
*/

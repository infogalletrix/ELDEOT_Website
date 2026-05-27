import React, { useState, useEffect, useRef } from 'react';
import { Calculator, X, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import quoteBg from '../assets/quote.png';
import { API_BASE_URL } from '../config';

const QuotePage = () => {
  const detailsRef = useRef(null);

  const [calcStep, setCalcStep] = useState(1);
  const [calcData, setCalcData] = useState({
    roomType: '',
    roomSize: '',
    packageType: 'Premium',
    designComplexity: 'Medium',
    name: '',
    phone: '',
    email: '',
    countryCode: '+91'
  });
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    // Check if the URL contains the instruction to scroll to details or calculator
    if (window.location.search.includes('section=calculator') || window.location.search.includes('section=details') || window.location.hash.includes('section=details')) {
      setTimeout(() => {
        detailsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  const handleCalculatorSubmit = async (e) => {
    e.preventDefault();
    if (calcData.phone.length !== 10) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }
    setIsCalculating(true);

    // Simulate calculating for 1.5 seconds
    setTimeout(async () => {
      const size = parseFloat(calcData.roomSize) || 200;

      setIsCalculating(false);
      setCalcStep(6); // Show success screen

      try {
        const fullPhone = `${calcData.countryCode} ${calcData.phone}`;
        const payload = {
          roomSize: size.toString(),
          roomType: calcData.roomType,
          materialQuality: calcData.packageType,
          designComplexity: calcData.designComplexity,
          additionalNotes: `Calculator Lead | Name: ${calcData.name} | Phone: ${fullPhone} | Email: ${calcData.email} | Room Type: ${calcData.roomType} | Room Size: ${size} sqft | Quality: ${calcData.packageType} | Complexity: ${calcData.designComplexity}`
        };

        await fetch(`${API_BASE_URL}/api/Quote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.error('Error submitting calculator lead:', err);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans selection:bg-[#D97736] selection:text-white">
      <Navbar isTransparent={true} activeLink="Get Quote" />
      
      {/* Quote Hero Section */}
      <section className="relative w-full h-screen min-h-[500px] md:min-h-[700px] flex items-center justify-center">
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${quoteBg})` }}
        >
          {/* Dark gradient overlay to make text readable and blend edges */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/20"></div>
          {/* Radial dark overlay to match the shadow around the edges */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center text-white flex flex-col items-center pt-24">
          
          {/* Pill Badge */}
          <div className="bg-[#FAF7F2] text-[#D97736] px-8 py-2.5 rounded-full font-sans font-medium text-[17px] mb-8 shadow-lg">
            Design Consultation
          </div>

          <h1 className="text-5xl md:text-[68px] font-bold font-serif mb-8 leading-[1.1] drop-shadow-lg">
            Get Your Quote
          </h1>
          <p className="text-lg md:text-[21px] text-gray-200 font-sans leading-relaxed max-w-[800px] drop-shadow-md mb-8">
            Enter your project details and our team will provide a customized cost estimate<br className="hidden md:block" /> and detailed project plan.
          </p>

          {/* Action Buttons */}
          <div className="flex gap-6 mt-6 justify-center">
            <button 
              onClick={() => {
                setTimeout(() => {
                  detailsRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="flex items-center justify-center gap-3 bg-[#D97736] text-white px-8 py-4 rounded-xl font-sans font-semibold text-lg hover:bg-[#b86128] transition-all duration-300 hover:scale-[1.03] shadow-lg shadow-[#D97736]/25 cursor-pointer"
            >
              <Calculator className="w-5 h-5" />
              Calculate Quote
            </button>
          </div>
        </div>
      </section>

      {/* Quote Form Section */}
      <section ref={detailsRef} id="details" className="py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-[1200px] mx-auto">
          
          {/* Multi-step Calculator View */}
          <div className="max-w-[800px] mx-auto bg-[#FAF7F2] rounded-[32px] p-8 md:p-12 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            {/* Progress header */}
            {calcStep <= 5 && (
              <div className="mb-10 flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm font-sans font-semibold text-gray-500">
                  <span className="text-[#D97736] uppercase tracking-wider">Step {calcStep} of 5</span>
                  <span>{Math.round(((calcStep - 1) / 4) * 100)}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#D97736] h-full transition-all duration-500" 
                    style={{ width: `${((calcStep - 1) / 4) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* STEP 1: ROOM TYPE */}
            {calcStep === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-3xl font-bold font-serif text-[#1A1A1A] mb-3">Select Room Type</h2>
                <p className="text-gray-500 font-sans mb-8">Choose the type of room to get an instant quote estimate.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Office', 'Full Home'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setCalcData({ ...calcData, roomType: type });
                        setCalcStep(2);
                      }}
                      className={`h-24 rounded-2xl font-sans font-bold text-lg transition-all flex items-center justify-center p-4 border text-center cursor-pointer ${
                        calcData.roomType === type 
                          ? 'bg-[#D97736] border-[#D97736] text-white shadow-lg shadow-[#D97736]/20 scale-[1.02]' 
                          : 'bg-white border-gray-200 text-gray-700 hover:border-[#D97736]/50 hover:bg-[#F5E6DA]/10'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: ROOM SIZE */}
            {calcStep === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-3xl font-bold font-serif text-[#1A1A1A] mb-3">Enter Room Size</h2>
                <p className="text-gray-500 font-sans mb-8">Provide the approximate size of the room in square feet.</p>
                
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="block text-[#333333] font-sans font-medium text-sm mb-2">Size (sq.ft) *</label>
                    <input 
                      type="text" 
                      inputMode="numeric"
                      pattern="[0-9]*"
                      required
                      value={calcData.roomSize}
                      onChange={(e) => {
                        const val = e.target.value;
                        const digitsOnly = val.replace(/\D/g, '');
                        setCalcData({ ...calcData, roomSize: digitsOnly });
                      }}
                      placeholder="e.g., 250"
                      className="w-full h-12 px-4 rounded-xl border border-gray-200 text-gray-600 font-sans focus:outline-none focus:border-[#D97736] bg-white"
                    />
                  </div>
                </div>

                <div className="mt-10 flex justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setCalcStep(1)}
                    className="px-6 h-12 rounded-xl border border-gray-300 font-sans text-gray-600 hover:bg-gray-50 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={!calcData.roomSize || parseFloat(calcData.roomSize) <= 0}
                    onClick={() => setCalcStep(3)}
                    className="px-8 h-12 rounded-xl bg-[#D97736] text-white font-sans font-medium hover:bg-[#b86128] transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: QUALITY PACKAGE */}
            {calcStep === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-3xl font-bold font-serif text-[#1A1A1A] mb-3">Choose Quality Tier</h2>
                <p className="text-gray-500 font-sans mb-8">Select a package tier based on modular finishing and custom options.</p>
                
                <div className="flex flex-col gap-4">
                  {[
                    { name: 'Standard', desc: 'Essential finishes, quality laminates, standard modular accessories, budget-friendly.' },
                    { name: 'Premium', desc: 'Acrylic/membrane cabinet finishes, heavy-duty modular hardware, false ceilings, lighting.' },
                    { name: 'Luxury', desc: 'High-end PU/veneer custom woodwork, fully custom designs, smart automation fittings, premium styling.' }
                  ].map((pkg) => (
                    <button
                      key={pkg.name}
                      type="button"
                      onClick={() => {
                        setCalcData({ ...calcData, packageType: pkg.name });
                        setCalcStep(4);
                      }}
                      className={`p-6 rounded-2xl font-sans text-left transition-all border flex flex-col gap-2 cursor-pointer ${
                        calcData.packageType === pkg.name 
                          ? 'border-[#D97736] bg-[#F5E6DA]/15 shadow-sm' 
                          : 'bg-white border-gray-200 hover:border-[#D97736]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg text-[#1A1A1A]">{pkg.name}</span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          calcData.packageType === pkg.name ? 'border-[#D97736] bg-[#D97736]' : 'border-gray-300'
                        }`}>
                          {calcData.packageType === pkg.name && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 leading-relaxed">{pkg.desc}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-10 flex justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setCalcStep(2)}
                    className="px-6 h-12 rounded-xl border border-gray-300 font-sans text-gray-600 hover:bg-gray-50 cursor-pointer"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: DESIGN COMPLEXITY */}
            {calcStep === 4 && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-3xl font-bold font-serif text-[#1A1A1A] mb-3">Select Design Complexity</h2>
                <p className="text-gray-500 font-sans mb-8">Choose the styling complexity you prefer for this space.</p>
                
                <div className="flex flex-col gap-4">
                  {[
                    { name: 'Low', desc: 'Simple layout, basic wall treatments, essential shelving and lighting.' },
                    { name: 'Medium', desc: 'Modern custom panels, curated accent walls, premium partitions, and false ceilings.' },
                    { name: 'High', desc: 'Intricate custom woodwork, luxury marble/veneer overlays, smart automation, and premium styling.' }
                  ].map((comp) => (
                    <button
                      key={comp.name}
                      type="button"
                      onClick={() => {
                        setCalcData({ ...calcData, designComplexity: comp.name });
                        setCalcStep(5);
                      }}
                      className={`p-6 rounded-2xl font-sans text-left transition-all border flex flex-col gap-2 cursor-pointer ${
                        calcData.designComplexity === comp.name 
                          ? 'border-[#D97736] bg-[#F5E6DA]/15 shadow-sm' 
                          : 'bg-white border-gray-200 hover:border-[#D97736]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg text-[#1A1A1A]">{comp.name} Complexity</span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          calcData.designComplexity === comp.name ? 'border-[#D97736] bg-[#D97736]' : 'border-gray-300'
                        }`}>
                          {calcData.designComplexity === comp.name && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 leading-relaxed">{comp.desc}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-10 flex justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setCalcStep(3)}
                    className="px-6 h-12 rounded-xl border border-gray-300 font-sans text-gray-600 hover:bg-gray-50 cursor-pointer"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: CONTACT INFO */}
            {calcStep === 5 && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-3xl font-bold font-serif text-[#1A1A1A] mb-3">Almost done!</h2>
                <p className="text-gray-500 font-sans mb-8">Enter your information to generate the cost estimate breakdown.</p>
                
                <form onSubmit={handleCalculatorSubmit} className="flex flex-col gap-6">
                  <div>
                    <label className="block text-[#333333] font-sans font-medium text-sm mb-2">Full Name *</label>
                    <input 
                      type="text" 
                      required
                      value={calcData.name}
                      onChange={(e) => setCalcData({ ...calcData, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full h-12 px-4 rounded-xl border border-gray-200 text-gray-600 font-sans focus:outline-none focus:border-[#D97736] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[#333333] font-sans font-medium text-sm mb-2">Email Address (Optional)</label>
                    <input 
                      type="email" 
                      value={calcData.email}
                      onChange={(e) => setCalcData({ ...calcData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full h-12 px-4 rounded-xl border border-gray-200 text-gray-600 font-sans focus:outline-none focus:border-[#D97736] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[#333333] font-sans font-medium text-sm mb-2">Phone Number *</label>
                    <div className="flex gap-2">
                      <select
                        value={calcData.countryCode}
                        onChange={(e) => setCalcData({ ...calcData, countryCode: e.target.value })}
                        className="h-12 px-3 rounded-xl border border-gray-200 text-gray-600 font-sans focus:outline-none focus:border-[#D97736] bg-white w-[110px] shrink-0"
                      >
                        <option value="+91">India (+91)</option>
                        <option value="+1">USA (+1)</option>
                        <option value="+44">UK (+44)</option>
                        <option value="+61">Aus (+61)</option>
                        <option value="+971">UAE (+971)</option>
                      </select>
                      <input 
                        type="tel" 
                        required
                        value={calcData.phone}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, '');
                          if (digits.length <= 10) {
                            setCalcData({ ...calcData, phone: digits });
                          }
                        }}
                        placeholder="10-digit number"
                        className="flex-1 h-12 px-4 rounded-xl border border-gray-200 text-gray-600 font-sans focus:outline-none focus:border-[#D97736] bg-white placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between gap-4">
                    <button
                      type="button"
                      disabled={isCalculating}
                      onClick={() => setCalcStep(4)}
                      className="px-6 h-12 rounded-xl border border-gray-300 font-sans text-gray-600 hover:bg-gray-50 cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isCalculating}
                      className="px-8 h-12 rounded-xl bg-[#D97736] text-white font-sans font-medium hover:bg-[#b86128] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#D97736]/20"
                    >
                      {isCalculating ? (
                        <>
                          <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                          Calculating...
                        </>
                      ) : (
                        'View Estimate'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 6: SUCCESS SCREEN */}
            {calcStep === 6 && (
              <div className="animate-in fade-in zoom-in-95 duration-500 text-center py-6">
                <div className="w-20 h-20 bg-green-50 rounded-2xl border-[2px] border-green-200 flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <CheckCircle2 className="w-10 h-10 text-green-500" strokeWidth={1.5} />
                </div>
                <h2 className="text-3xl font-bold font-serif text-[#1A1A1A] mb-3">Details Submitted!</h2>
                <p className="text-[#666666] font-sans text-[17px] mb-10 max-w-md mx-auto leading-relaxed">
                  Thank you for submitting your project details. Our team is evaluating your requirements and will contact you shortly with a customized price quote.
                </p>
                
                <div className="max-w-xs mx-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setCalcStep(1);
                      setCalcData({
                        roomType: '',
                        roomSize: '',
                        packageType: 'Premium',
                        designComplexity: 'Medium',
                        name: '',
                        phone: '',
                        email: '',
                        countryCode: '+91'
                      });
                    }}
                    className="w-full h-12 rounded-xl border border-gray-300 font-sans text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    New Calculation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default QuotePage;

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import logoImg from '../assets/Logo.png';
import whatsappLogoImg from '../assets/WhatsApp-Logo.png';
import { API_BASE_URL } from '../config';

const ChatbotContactForm = ({ onSubmit, submitted }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (submitted) {
    return (
      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl text-green-800 text-[12px] font-medium w-full">
        ✓ Thank you! Your details have been submitted successfully.
      </div>
    );
  }

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length <= 10) {
      setPhone(digitsOnly);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMsg('Name and Phone number are required.');
      return;
    }
    if (phone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit phone number.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const success = await onSubmit({ name, phone: `${countryCode} ${phone}`, email });
      if (!success) {
        setErrorMsg('Failed to submit. Please try again.');
      }
    } catch (err) {
      setErrorMsg('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-3 p-2 bg-[#FAF7F2] border border-gray-100 rounded-lg flex flex-col gap-2 text-gray-800 w-full">
      <p className="text-[12px] font-bold text-gray-700">Quick Contact Inquiry</p>
      
      <div className="flex flex-col gap-2">
        <input 
          type="text" 
          placeholder="Name *" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required
          className="w-full h-8 px-2.5 rounded-lg border border-gray-200 bg-white text-xs focus:outline-none focus:border-[#D97736]"
        />
        
        <div className="flex gap-1 w-full">
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="h-8 px-1 rounded-lg border border-gray-200 bg-white text-[11px] focus:outline-none focus:border-[#D97736] shrink-0 w-[86px] text-gray-600"
          >
            <option value="+91">🇮🇳 +91 (India)</option>
            <option value="+1">🇺🇸 +1 (US)</option>
            <option value="+44">🇬🇧 +44 (UK)</option>
            <option value="+61">🇦🇺 +61 (Australia)</option>
            <option value="+971">🇦🇪 +971 (UAE)</option>
            <option value="+1">🇨🇦 +1 (Canada)</option>
            <option value="+65">🇸🇬 +65 (Singapore)</option>
            <option value="+966">🇸🇦 +966 (Saudi)</option>
            <option value="+49">🇩🇪 +49 (Germany)</option>
            <option value="+33">🇫🇷 +33 (France)</option>
          </select>
          <input 
            type="tel" 
            placeholder="Phone Number *" 
            value={phone} 
            onChange={handlePhoneChange} 
            required
            className="flex-1 h-8 px-2.5 rounded-lg border border-gray-200 bg-white text-xs focus:outline-none focus:border-[#D97736] min-w-0"
          />
        </div>
        
        <input 
          type="email" 
          placeholder="Email (Optional)" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full h-8 px-2.5 rounded-lg border border-gray-200 bg-white text-xs focus:outline-none focus:border-[#D97736]"
        />
      </div>

      {errorMsg && (
        <p className="text-[10px] text-red-500 font-medium">{errorMsg}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full h-8 bg-[#D97736] hover:bg-[#b86128] disabled:bg-gray-300 text-white font-medium rounded-lg text-xs transition-colors"
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  );
};

const FloatingWidgets = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! Welcome to ELDE'OT Interiors. How can we help you transform your space today? \"Designing Spaces, Creating Stories.\"", isBot: true }
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) {
      // Small timeout to allow transition animation to complete
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages, isChatOpen]);

  const handleFormSubmit = async (msgId, formData) => {
    try {
      const submissionData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || '',
        message: 'Submitted via Chatbot inquiry form',
        serviceNeeded: 'Chatbot Lead'
      };
      const response = await fetch(`${API_BASE_URL}/api/Contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });
      if (response.ok) {
        setMessages(prev => prev.map(m => m.id === msgId ? { ...m, submitted: true } : m));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error submitting chatbot lead:', error);
      return false;
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = { id: Date.now(), text: inputValue, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    
    const query = inputValue.toLowerCase();
    setInputValue("");

    // Determine response based on user input keywords
    let responseText = "Thanks for reaching out! One of our design experts will get back to you shortly. Feel free to explore our pages or message us directly.";
    let showContactForm = false;

    if (/\b(hi|hello|hey)\b/i.test(query)) {
      responseText = "Hello! Thank you for contacting ELDE'OT Interiors. How can we help you today?";
    } else if (
      query.includes("quote") || 
      query.includes("price") || 
      query.includes("pricing") || 
      query.includes("calculate") || 
      query.includes("cost") || 
      query.includes("estimate") || 
      query.includes("budget") || 
      query.includes("rate") || 
      query.includes("charge") || 
      query.includes("how much") || 
      query.includes("amount")
    ) {
      responseText = "To get a price estimate for your space, please navigate to our 'Get Quote' page (/get-quote) and submit your project requirements. Our team will review it and provide a customized quote!";
      showContactForm = true;
    } else if (query.includes("design") || query.includes("interior") || query.includes("space") || query.includes("office") || query.includes("home") || query.includes("service")) {
      responseText = "We provide end-to-end design services for homes, offices, and commercial spaces. You can check out our offerings on the 'Services' page (/services), view past projects in our 'Portfolio' (/portfolio), or fill out a quote form to begin.";
    } else if (query.includes("contact") || query.includes("phone") || query.includes("email") || query.includes("address") || query.includes("whatsapp") || query.includes("call")) {
      responseText = "You can reach us at hello@eldeot.design, phone/WhatsApp at +91 97903 70405, or via our 'Contact' page (/contact) which includes a direct form and our studio address.";
      showContactForm = true;
    }

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          text: responseText,
          isBot: true,
          showContactForm,
          submitted: false
        }
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Left Side: Chatbot Button & Dialog */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start">
        
        {/* Chat Window */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="mb-4 w-[320px] sm:w-[360px] h-[450px] bg-white rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col overflow-hidden font-sans"
            >
              {/* Header */}
              <div className="bg-[#2A2826] text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center relative bg-black border border-white/10 shrink-0">
                    <img src={logoImg} alt="ELDE'OT" className="w-full h-full object-contain p-1" />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#2A2826]"></span>
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-[16px] leading-tight">ELDE'OT Assistant</h3>
                    <p className="text-xs text-gray-400">Online</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#FAF7F2]/50">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div 
                      className={`max-w-[80%] p-3.5 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                        msg.isBot 
                          ? 'bg-white text-gray-800 rounded-tl-none' 
                          : 'bg-[#D97736] text-white rounded-tr-none'
                      }`}
                    >
                      {msg.text}
                      {msg.showContactForm && (
                        <ChatbotContactForm 
                          submitted={msg.submitted} 
                          onSubmit={(data) => handleFormSubmit(msg.id, data)} 
                        />
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D97736] text-[14px]"
                />
                <button 
                  type="submit"
                  className="w-10 h-10 rounded-xl bg-[#D97736] hover:bg-[#c56527] text-white flex items-center justify-center transition-colors shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Toggle Button */}
        <motion.button
          onClick={() => setIsChatOpen(!isChatOpen)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-all duration-300 ${
            isChatOpen 
              ? 'bg-[#2A2826] hover:bg-[#1f1e1d] text-white' 
              : 'bg-[#E8A838] hover:bg-[#d49424] text-white hover:shadow-[#E8A838]/35'
          }`}
          aria-label="Toggle Chatbot"
        >
          {isChatOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </motion.button>
      </div>

      {/* Right Side: WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.a
          href="https://wa.me/919790370405"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-green-500/35 cursor-pointer transition-all duration-300"
          aria-label="Chat on WhatsApp"
        >
          <img 
            src={whatsappLogoImg} 
            alt="WhatsApp" 
            className="w-14 h-14 object-contain" 
          />
        </motion.a>
      </div>
    </>
  );
};

export default FloatingWidgets;

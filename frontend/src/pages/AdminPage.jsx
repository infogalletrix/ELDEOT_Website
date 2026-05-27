import React, { useState, useEffect } from 'react';
import { 
  Lock, User, LayoutDashboard, Inbox, FileText, Sparkles, 
  LogOut, Search, Mail, Phone, Calendar, DollarSign, 
  ArrowRight, ShieldCheck, RefreshCw, Eye, ExternalLink, X,
  Image as ImageIcon, Plus, Trash2, MapPin, Menu, Settings, Link
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import portfolio static images for admin view matching the user view
import p2a1 from '../assets/p2a1.png';
import p2a2 from '../assets/p2a2.png';
import p2a3 from '../assets/p2a3.png';
import p2b1 from '../assets/p2b1.png';
import p2b2 from '../assets/p2b2.png';
import p2b3 from '../assets/p2b3.png';
import p2c1 from '../assets/p2c1.png';
import p2c2 from '../assets/p2c2.png';
import logoImg from '../assets/Logo.png';
import { API_BASE_URL } from '../config';

const AdminPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem('isAdminLoggedIn') === 'true');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot password & reset password state
  const [loginView, setLoginView] = useState('login'); // login, forgot, verify-otp, reset
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Sidebar mobile responsive state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Password setting tab form states
  const [changePasswordOld, setChangePasswordOld] = useState('');
  const [changePasswordNew, setChangePasswordNew] = useState('');
  const [changePasswordConfirm, setChangePasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Dashboard Data State
  const [contacts, setContacts] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [aiRequests, setAiRequests] = useState([]);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [usePortfolioFallback, setUsePortfolioFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  
  // Navigation & UI State
  const [activeTab, setActiveTab] = useState('overview'); // overview, contacts, quotes, aidesigns, portfolio, settings-password, settings-sessions
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null); // For details modal
  const [lightboxImage, setLightboxImage] = useState(null); // For image lightbox modal

  // New Portfolio Form State
  const [newPortfolioTitle, setNewPortfolioTitle] = useState('');
  const [newPortfolioLocation, setNewPortfolioLocation] = useState('');
  const [newPortfolioCategory, setNewPortfolioCategory] = useState('Residential');
  const [newPortfolioImage, setNewPortfolioImage] = useState(null);
  const [newPortfolioImagePreview, setNewPortfolioImagePreview] = useState('');
  const [portfolioSubmitError, setPortfolioSubmitError] = useState('');
  const [isPortfolioSubmitting, setIsPortfolioSubmitting] = useState(false);

  // New filter and session states
  const [quoteFilter, setQuoteFilter] = useState('all'); // all, provided, not-provided
  const [loginSessions, setLoginSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('adminLoginSessions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Helper: extract name, phone, and notes from QuoteRequest.AdditionalNotes
  const parseQuoteNotes = (notes) => {
    if (!notes) return { name: 'N/A', phone: 'N/A', customNotes: '' };
    
    // Check if notes are formatted as "Name: ... | Phone: ... | Notes: ..."
    const nameMatch = notes.match(/Name:\s*([^|]+)/i);
    const phoneMatch = notes.match(/Phone:\s*([^|]+)/i);
    const notesMatch = notes.match(/Notes:\s*(.+)/i);

    return {
      name: nameMatch ? nameMatch[1].trim() : 'N/A',
      phone: phoneMatch ? phoneMatch[1].trim() : 'N/A',
      customNotes: notesMatch ? notesMatch[1].trim() : notes
    };
  };

  // Helper to extract the last 10 digits of a phone number for comparison
  const normalizePhone = (phoneStr) => {
    if (!phoneStr) return '';
    const cleaned = phoneStr.replace(/\D/g, ''); // Keep only digits
    return cleaned.slice(-10); // Take the last 10 digits
  };

  // Helper to find if there is a matching contact for a quote phone
  const hasMatchingContact = (quotePhone) => {
    const normalizedQuote = normalizePhone(quotePhone);
    if (!normalizedQuote || normalizedQuote.length < 10) return false;
    return contacts.some(c => normalizePhone(c.phone) === normalizedQuote);
  };

  // Helper to find if there is a matching quote for a contact phone
  const hasMatchingQuote = (contactPhone) => {
    const normalizedContact = normalizePhone(contactPhone);
    if (!normalizedContact || normalizedContact.length < 10) return false;
    return quotes.some(q => {
      const parsed = parseQuoteNotes(q.additionalNotes);
      return normalizePhone(parsed.phone) === normalizedContact;
    });
  };

  // Helper to record login session
  const recordLoginSession = () => {
    try {
      const userAgent = window.navigator.userAgent;
      let browser = "Unknown Browser";
      let os = "Unknown OS";
      
      if (userAgent.indexOf("Chrome") > -1) browser = "Google Chrome";
      else if (userAgent.indexOf("Safari") > -1) browser = "Apple Safari";
      else if (userAgent.indexOf("Firefox") > -1) browser = "Mozilla Firefox";
      else if (userAgent.indexOf("MSIE") > -1 || !!document.documentMode === true) browser = "Internet Explorer";
      else if (userAgent.indexOf("Edge") > -1) browser = "Microsoft Edge";

      if (userAgent.indexOf("Windows") > -1) os = "Windows";
      else if (userAgent.indexOf("Mac") > -1) os = "macOS";
      else if (userAgent.indexOf("X11") > -1) os = "UNIX";
      else if (userAgent.indexOf("Linux") > -1) os = "Linux";
      else if (/Android/i.test(userAgent)) os = "Android";
      else if (/iPhone|iPad|iPod/i.test(userAgent)) os = "iOS";

      const timestamp = new Date().toLocaleString();
      const newSession = {
        id: Date.now(),
        timestamp,
        browser,
        os,
        ip: "127.0.0.1",
        status: "Active"
      };

      setLoginSessions(prev => {
        const currentSessions = prev.map(s => ({ ...s, status: "Closed" }));
        const updatedSessions = [newSession, ...currentSessions];
        localStorage.setItem('adminLoginSessions', JSON.stringify(updatedSessions));
        return updatedSessions;
      });
    } catch (err) {
      console.error("Failed to record login session", err);
    }
  };

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setFetchError('');
    try {
      // Parallel fetches from backend controllers including portfolio items
      const [contactsRes, quotesRes, aiRes, portfolioRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/Contact`).catch(() => null),
        fetch(`${API_BASE_URL}/api/Quote`).catch(() => null),
        fetch(`${API_BASE_URL}/api/AIDesign`).catch(() => null),
        fetch(`${API_BASE_URL}/api/Portfolio`).catch(() => null)
      ]);

      let fetchedContacts = [];
      let fetchedQuotes = [];
      let fetchedAiRequests = [];
      let fetchedPortfolio = [];

      if (contactsRes && contactsRes.ok) {
        fetchedContacts = await contactsRes.json();
      }
      if (quotesRes && quotesRes.ok) {
        fetchedQuotes = await quotesRes.json();
      }
      if (aiRes && aiRes.ok) {
        const aiData = await aiRes.json();
        fetchedAiRequests = Array.isArray(aiData) ? aiData : (aiData.requests || aiData.request ? [aiData.request] : []);
      }
      if (portfolioRes && portfolioRes.ok) {
        fetchedPortfolio = await portfolioRes.json();
        setUsePortfolioFallback(false);
      } else {
        setUsePortfolioFallback(true);
      }

      // Sort by newest
      setContacts(fetchedContacts.reverse());
      setQuotes(fetchedQuotes.reverse());
      setAiRequests(fetchedAiRequests.reverse());
      setPortfolioItems(fetchedPortfolio); // The controller orders by CreatedAt descending

      if (!contactsRes && !quotesRes && !aiRes && !portfolioRes) {
        setFetchError(`Could not connect to backend APIs. Please verify that the .NET backend is running at ${API_BASE_URL}`);
      }
    } catch (err) {
      console.error(err);
      setFetchError('Failed to parse database records. Please verify server status.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password form statuses when activeTab changes
  useEffect(() => {
    setPasswordError('');
    setPasswordSuccess('');
    setChangePasswordOld('');
    setChangePasswordNew('');
    setChangePasswordConfirm('');
  }, [activeTab]);

  // Persist login state in sessionStorage (session lifetime) and set page title
  useEffect(() => {
    document.title = "Admin Portal";
    const loggedInStatus = sessionStorage.getItem('isAdminLoggedIn');
    if (loggedInStatus === 'true') {
      fetchDashboardData();
    }
    return () => {
      document.title = "ELDE'OT - Designing Spaces, Creating Stories";
    };
  }, []);

  // Keep settings submenu open if a settings tab is active
  useEffect(() => {
    if (activeTab === 'settings-password' || activeTab === 'settings-sessions') {
      setIsSettingsOpen(true);
    }
  }, [activeTab]);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');
    setIsSubmitting(true);

    const activePassword = localStorage.getItem('adminPassword') || 'admineldeol2026';

    // Simulate authentication lag for premium experience
    setTimeout(() => {
      if (username === 'admin' && password === activePassword) {
        setIsLoggedIn(true);
        sessionStorage.setItem('isAdminLoggedIn', 'true');
        recordLoginSession();
        fetchDashboardData();
      } else {
        setLoginError('Invalid username or password. Please try again.');
      }
      setIsSubmitting(false);
    }, 1000);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');

    const targetEmail = recoveryEmail.toLowerCase().trim();
    if (targetEmail !== 'secivoy441@noyavip.com') {
      setLoginError('This email address is not authorized for password recovery.');
      return;
    }

    setIsSendingOtp(true);
    
    // Generate a random 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    console.log("Admin OTP Code: " + otp);

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          _subject: "Admin Password Reset OTP Verification Code",
          message: `Your One-Time Password (OTP) verification code for Admin Portal is: ${otp}`,
          otp_code: otp,
          _honey: "", // Honeypot field to prevent spam filters
          _captcha: "false" // Disable captcha
        })
      });

      const data = await response.json();
      
      if (response.ok && data.success !== "false") {
        setLoginSuccess('A 6-digit OTP code has been successfully dispatched to your email.');
        setLoginView('verify-otp');
      } else {
        // If it needs activation, let the user know they need to check their inbox and activate it
        if (data.message && data.message.includes("Activation")) {
          setLoginError("This email needs FormSubmit activation. An activation email has been sent to secivoy441@noyavip.com. Please open it, click 'Activate Form', and try requesting OTP again.");
        } else {
          setLoginError(data.message || 'Failed to dispatch the OTP email. Please try again.');
        }
      }
    } catch (err) {
      console.error(err);
      setLoginError('Network error trying to send OTP email. Please check your internet connection and try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');

    if (enteredOtp.trim() === generatedOtp) {
      setLoginView('reset');
      setEnteredOtp('');
    } else {
      setLoginError('Invalid OTP code. Please check and try again.');
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');

    if (newPassword.length < 6) {
      setLoginError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setLoginError('Passwords do not match.');
      return;
    }

    localStorage.setItem('adminPassword', newPassword);
    setLoginSuccess('Password reset successfully! Please log in.');
    setLoginView('login');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    const activePassword = localStorage.getItem('adminPassword') || 'admineldeol2026';

    if (changePasswordOld !== activePassword) {
      setPasswordError('Incorrect current password.');
      return;
    }

    if (changePasswordNew.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (changePasswordNew !== changePasswordConfirm) {
      setPasswordError('New passwords do not match.');
      return;
    }

    localStorage.setItem('adminPassword', changePasswordNew);
    setPasswordSuccess('Password updated successfully!');
    setChangePasswordOld('');
    setChangePasswordNew('');
    setChangePasswordConfirm('');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('isAdminLoggedIn');
    setUsername('');
    setPassword('');
    setLoginView('login');
    setLoginSuccess('');
    setLoginError('');
  };

  const handleDeletePortfolioItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this portfolio item?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/Portfolio/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setPortfolioItems(prev => prev.filter(item => item.id !== id));
      } else {
        alert("Failed to delete portfolio item.");
      }
    } catch (err) {
      console.error(err);
      alert("Error contacting server.");
    }
  };

  const handleAddPortfolioItem = async (e) => {
    e.preventDefault();
    setPortfolioSubmitError('');
    setIsPortfolioSubmitting(true);

    if (!newPortfolioTitle || !newPortfolioCategory || !newPortfolioImage) {
      setPortfolioSubmitError("Title, Category, and Image are required.");
      setIsPortfolioSubmitting(false);
      return;
    }

    // 1. Validate max 10MB size limit
    if (newPortfolioImage.size > 10 * 1024 * 1024) {
      setPortfolioSubmitError("Maximum file size allowed is 10MB.");
      setIsPortfolioSubmitting(false);
      return;
    }

    // 2. Validate supported file format (jpeg, png, svg, avif, webp)
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.svg', '.avif', '.webp'];
    const fileName = newPortfolioImage.name.toLowerCase();
    const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
    if (!allowedExtensions.includes(fileExtension)) {
      setPortfolioSubmitError("Unsupported image format. Allowed formats are JPEG, PNG, SVG, AVIF, and WEBP.");
      setIsPortfolioSubmitting(false);
      return;
    }

    // 3. Validate max 12 images in each section/category
    const countInSection = portfolioItems.filter(p => p.category.toLowerCase() === newPortfolioCategory.toLowerCase()).length;
    if (countInSection >= 12) {
      setPortfolioSubmitError(`Maximum of 12 images allowed in the ${newPortfolioCategory} section.`);
      setIsPortfolioSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("Title", newPortfolioTitle);
    formData.append("Location", newPortfolioLocation);
    formData.append("Category", newPortfolioCategory);
    formData.append("Image", newPortfolioImage);

    try {
      const res = await fetch(`${API_BASE_URL}/api/Portfolio`, {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        const newItem = await res.json();
        setPortfolioItems(prev => [newItem, ...prev]);
        // Reset form
        setNewPortfolioTitle('');
        setNewPortfolioLocation('');
        setNewPortfolioCategory('Residential');
        setNewPortfolioImage(null);
        setNewPortfolioImagePreview('');
      } else {
        const errorData = await res.json().catch(() => ({}));
        setPortfolioSubmitError(errorData.message || "Failed to add portfolio item.");
      }
    } catch (err) {
      console.error(err);
      setPortfolioSubmitError("Error contacting server.");
    } finally {
      setIsPortfolioSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPortfolioSubmitError('');
    if (file) {
      // Validate max 10MB size limit
      if (file.size > 10 * 1024 * 1024) {
        setPortfolioSubmitError("Maximum file size allowed is 10MB.");
        setNewPortfolioImage(null);
        setNewPortfolioImagePreview('');
        return;
      }

      // Validate supported file format (jpeg, png, svg, avif, webp)
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.svg', '.avif', '.webp'];
      const fileName = file.name.toLowerCase();
      const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
      if (!allowedExtensions.includes(fileExtension)) {
        setPortfolioSubmitError("Unsupported image format. Allowed formats are JPEG, PNG, SVG, AVIF, and WEBP.");
        setNewPortfolioImage(null);
        setNewPortfolioImagePreview('');
        return;
      }

      setNewPortfolioImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPortfolioImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter data based on active tab and search query
  const getFilteredData = () => {
    const query = searchTerm.toLowerCase().trim();
    if (activeTab === 'contacts') {
      return contacts.filter(c => 
        (c.name && c.name.toLowerCase().includes(query)) ||
        (c.email && c.email.toLowerCase().includes(query)) ||
        (c.phone && c.phone.includes(query)) ||
        (c.serviceNeeded && c.serviceNeeded.toLowerCase().includes(query)) ||
        (c.message && c.message.toLowerCase().includes(query))
      );
    }
    if (activeTab === 'quotes') {
      return quotes.filter(q => {
        const parsed = parseQuoteNotes(q.additionalNotes);
        
        // Filter based on whether client name and phone number are provided
        const hasDetails = parsed.name && parsed.name !== 'N/A' && parsed.name.trim() !== '' &&
                           parsed.phone && parsed.phone !== 'N/A' && parsed.phone.trim() !== '';

        if (quoteFilter === 'provided' && !hasDetails) return false;
        if (quoteFilter === 'not-provided' && hasDetails) return false;

        return (
          parsed.name.toLowerCase().includes(query) ||
          parsed.phone.includes(query) ||
          (q.roomType && q.roomType.toLowerCase().includes(query)) ||
          (q.materialQuality && q.materialQuality.toLowerCase().includes(query)) ||
          (q.designComplexity && q.designComplexity.toLowerCase().includes(query))
        );
      });
    }
    if (activeTab === 'aidesigns') {
      return aiRequests.filter(a => 
        (a.roomType && a.roomType.toLowerCase().includes(query)) ||
        (a.designStyle && a.designStyle.toLowerCase().includes(query)) ||
        (a.budgetRange && a.budgetRange.toLowerCase().includes(query)) ||
        (a.colorPreferences && a.colorPreferences.toLowerCase().includes(query))
      );
    }
    if (activeTab === 'portfolio') {
      const staticProjects = [
        { id: 'static-1', title: 'Modern Loft Apartment', location: 'New York, NY', category: 'Residential', imagePath: p2a1, isStatic: true },
        { id: 'static-2', title: 'Luxury Boutique Hotel', location: 'Miami, FL', category: 'Hospitality', imagePath: p2a2, isStatic: true },
        { id: 'static-3', title: 'Artisan Café', location: 'Austin, TX', category: 'Commercial', imagePath: p2a3, isStatic: true },
        { id: 'static-4', title: 'The Copper Bean', location: 'Melbourne, Australia', category: 'Commercial', imagePath: p2b1, isStatic: true },
        { id: 'static-5', title: 'Contemporary Urban Living', location: 'Chicago, IL', category: 'Residential', imagePath: p2b2, isStatic: true },
        { id: 'static-6', title: 'Nexa Creative Workspace', location: 'London, UK', category: 'Office', imagePath: p2b3, isStatic: true },
        { id: 'static-7', title: 'Vertex Corporate', location: 'Toronto, Canada', category: 'Office', imagePath: p2c1, isStatic: true },
        { id: 'static-8', title: 'Nexa Creative Office Room', location: 'New York, NY', category: 'Office', imagePath: p2c2, isStatic: true }
      ];
      const itemsToRender = usePortfolioFallback ? staticProjects : portfolioItems;
      return itemsToRender.filter(p => 
        (p.title && p.title.toLowerCase().includes(query)) ||
        (p.location && p.location.toLowerCase().includes(query)) ||
        (p.category && p.category.toLowerCase().includes(query))
      );
    }
    return [];
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans selection:bg-[#D97736] selection:text-white text-gray-800">
      
      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          /* LOGIN SCREEN */
          <motion.div 
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-[#1A1A1A] p-6 z-50 overflow-hidden"
          >
            {/* Background design elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#D97736]/10 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#D97736]/5 blur-[120px]" />

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5, type: 'spring' }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[32px] w-full max-w-[480px] shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
            >
              {/* Logo / Brand */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-6">
                  <img 
                    src={logoImg} 
                    alt="Admin Logo" 
                    className="h-14 w-auto object-contain transition-transform duration-300 hover:scale-105 shadow-[0_8px_24px_rgba(0,0,0,0.2)]" 
                  />
                </div>
                <p className="text-gray-400 text-[14px]">
                  {loginView === 'login' && 'Admin Portal Authentication'}
                  {loginView === 'forgot' && 'Reset Admin Password'}
                  {loginView === 'verify-otp' && 'OTP Verification'}
                  {loginView === 'reset' && 'Set New Admin Password'}
                </p>
              </div>

              {/* Login Form */}
              {loginView === 'login' && (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2 pl-1">Username</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="text"
                        required
                        placeholder="admin"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full h-[54px] pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#D97736] focus:bg-white/10 transition-all font-sans text-[15px]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2 pl-1">
                      <label className="block text-gray-300 text-sm font-medium">Password</label>
                      <button
                        type="button"
                        onClick={() => { setLoginView('forgot'); setLoginError(''); setLoginSuccess(''); }}
                        className="text-[#D97736] text-xs hover:underline font-sans hover:text-[#b86128] transition-colors cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-[54px] pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#D97736] focus:bg-white/10 transition-all font-sans text-[15px]"
                      />
                    </div>
                  </div>

                  {loginError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm font-sans"
                    >
                      {loginError}
                    </motion.div>
                  )}

                  {loginSuccess && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm font-sans"
                    >
                      {loginSuccess}
                    </motion.div>
                  )}

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-[54px] bg-[#D97736] text-white font-sans font-medium text-[16px] rounded-xl hover:bg-[#b86128] transition-colors flex items-center justify-center gap-2 disabled:opacity-75 shadow-[0_8px_20px_rgba(217,119,54,0.2)] mt-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Sign In <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Forgot Password View */}
              {loginView === 'forgot' && (
                <form onSubmit={handleSendOtp} className="space-y-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2 pl-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="email"
                        required
                        placeholder="secivoy441@noyavip.com"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        className="w-full h-[54px] pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#D97736] focus:bg-white/10 transition-all font-sans text-[15px]"
                      />
                    </div>
                  </div>

                  {loginError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm font-sans"
                    >
                      {loginError}
                    </motion.div>
                  )}

                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => { setLoginView('login'); setLoginError(''); setLoginSuccess(''); }}
                      className="flex-1 h-[54px] bg-white/5 hover:bg-white/10 border border-white/15 text-white font-sans font-medium text-[16px] rounded-xl transition-colors flex items-center justify-center cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isSendingOtp}
                      className="flex-1 h-[54px] bg-[#D97736] hover:bg-[#b86128] text-white font-sans font-medium text-[16px] rounded-xl transition-colors flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(217,119,54,0.2)] cursor-pointer disabled:opacity-75"
                    >
                      {isSendingOtp ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          Send OTP <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* OTP Verification View */}
              {loginView === 'verify-otp' && (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2 pl-1">One-Time Password (OTP)</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="text"
                        required
                        maxLength={6}
                        placeholder="123456"
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full h-[54px] pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#D97736] focus:bg-white/10 transition-all font-mono text-center tracking-[0.5em] text-[18px]"
                      />
                    </div>
                  </div>

                  {loginError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm font-sans"
                    >
                      {loginError}
                    </motion.div>
                  )}

                  {loginSuccess && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm font-sans text-center"
                    >
                      {loginSuccess}
                    </motion.div>
                  )}

                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => { setLoginView('forgot'); setLoginError(''); setLoginSuccess(''); }}
                      className="flex-1 h-[54px] bg-white/5 hover:bg-white/10 border border-white/15 text-white font-sans font-medium text-[16px] rounded-xl transition-colors flex items-center justify-center cursor-pointer"
                    >
                      Back
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 h-[54px] bg-[#D97736] hover:bg-[#b86128] text-white font-sans font-medium text-[16px] rounded-xl transition-colors flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(217,119,54,0.2)] cursor-pointer"
                    >
                      Verify OTP <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {generatedOtp && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-[#D97736]/10 border border-[#D97736]/20 text-center font-sans mt-4"
                    >
                      <p className="text-xs text-[#D97736] font-semibold uppercase tracking-wider mb-1">Developer Demonstration Mode</p>
                      <p className="text-sm text-gray-300">
                        Since external mail dispatch is simulated, use code:
                      </p>
                      <div className="mt-2 inline-block px-4 py-1.5 bg-black/40 rounded-lg border border-white/5 font-mono text-[18px] text-white tracking-widest select-all font-bold">
                        {generatedOtp}
                      </div>
                    </motion.div>
                  )}
                </form>
              )}

              {/* Reset Password View */}
              {loginView === 'reset' && (
                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2 pl-1">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="password"
                        required
                        placeholder="New Password (min 6 chars)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full h-[54px] pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#D97736] focus:bg-white/10 transition-all font-sans text-[15px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2 pl-1">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="password"
                        required
                        placeholder="Confirm Password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="w-full h-[54px] pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#D97736] focus:bg-white/10 transition-all font-sans text-[15px]"
                      />
                    </div>
                  </div>

                  {loginError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm font-sans"
                    >
                      {loginError}
                    </motion.div>
                  )}

                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => { setLoginView('login'); setLoginError(''); setLoginSuccess(''); }}
                      className="flex-1 h-[54px] bg-white/5 hover:bg-white/10 border border-white/15 text-white font-sans font-medium text-[16px] rounded-xl transition-colors flex items-center justify-center cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 h-[54px] bg-[#D97736] hover:bg-[#b86128] text-white font-sans font-medium text-[16px] rounded-xl transition-colors flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(217,119,54,0.2)] cursor-pointer"
                    >
                      Reset Password
                    </button>
                  </div>
                </form>
              )}

            </motion.div>
          </motion.div>
        ) : (
          /* ADMIN DASHBOARD VIEW */
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-screen bg-[#FAF7F2]"
          >
            {/* Mobile Backdrop Overlay */}
            {isSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            {/* Sidebar Navigation */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#1A1A1A] text-white flex flex-col shadow-xl border-r border-white/5 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
              {/* Sidebar Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <img 
                    src={logoImg} 
                    alt="Admin Logo" 
                    className="h-6 w-auto object-contain shadow-sm" 
                  />
                  <div>
                    <h2 className="font-serif font-bold text-lg tracking-wide leading-tight">Admin Portal</h2>
                  </div>
                </div>
                {/* Mobile close button */}
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                <button 
                  onClick={() => { setActiveTab('overview'); setSearchTerm(''); setIsSidebarOpen(false); }}
                  className={`w-full h-[50px] px-4 rounded-xl flex items-center gap-3 font-sans text-[15px] transition-all cursor-pointer ${activeTab === 'overview' ? 'bg-[#D97736] text-white font-medium shadow-md shadow-[#D97736]/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <LayoutDashboard className="w-5 h-5" /> Overview
                </button>
                
                <button 
                  onClick={() => { setActiveTab('contacts'); setSearchTerm(''); setIsSidebarOpen(false); }}
                  className={`w-full h-[50px] px-4 rounded-xl flex items-center gap-3 font-sans text-[15px] transition-all cursor-pointer ${activeTab === 'contacts' ? 'bg-[#D97736] text-white font-medium shadow-md shadow-[#D97736]/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <Inbox className="w-5 h-5" /> Contacts
                  {contacts.length > 0 && (
                    <span className="ml-auto bg-white/10 text-white text-[11px] px-2 py-0.5 rounded-full font-bold">
                      {contacts.length}
                    </span>
                  )}
                </button>

                <button 
                  onClick={() => { setActiveTab('quotes'); setSearchTerm(''); setIsSidebarOpen(false); }}
                  className={`w-full h-[50px] px-4 rounded-xl flex items-center gap-3 font-sans text-[15px] transition-all cursor-pointer ${activeTab === 'quotes' ? 'bg-[#D97736] text-white font-medium shadow-md shadow-[#D97736]/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <FileText className="w-5 h-5" /> Quotes
                  {quotes.length > 0 && (
                    <span className="ml-auto bg-white/10 text-white text-[11px] px-2 py-0.5 rounded-full font-bold">
                      {quotes.length}
                    </span>
                  )}
                </button>

                {/* 
                <button 
                  onClick={() => { setActiveTab('aidesigns'); setSearchTerm(''); setIsSidebarOpen(false); }}
                  className={`w-full h-[50px] px-4 rounded-xl flex items-center gap-3 font-sans text-[15px] transition-all cursor-pointer ${activeTab === 'aidesigns' ? 'bg-[#D97736] text-white font-medium shadow-md shadow-[#D97736]/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <Sparkles className="w-5 h-5" /> AI Designs
                  {aiRequests.length > 0 && (
                    <span className="ml-auto bg-white/10 text-white text-[11px] px-2 py-0.5 rounded-full font-bold">
                      {aiRequests.length}
                    </span>
                  )}
                </button>
                */}

                <button 
                  onClick={() => { setActiveTab('portfolio'); setSearchTerm(''); setIsSidebarOpen(false); }}
                  className={`w-full h-[50px] px-4 rounded-xl flex items-center gap-3 font-sans text-[15px] transition-all cursor-pointer ${activeTab === 'portfolio' ? 'bg-[#D97736] text-white font-medium shadow-md shadow-[#D97736]/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <ImageIcon className="w-5 h-5" /> Portfolio
                  {(usePortfolioFallback ? 8 : portfolioItems.length) > 0 && (
                    <span className="ml-auto bg-white/10 text-white text-[11px] px-2 py-0.5 rounded-full font-bold">
                      {usePortfolioFallback ? 8 : portfolioItems.length}
                    </span>
                  )}
                </button>

                <div className="space-y-1">
                  <button 
                    onClick={() => { 
                      setIsSettingsOpen(!isSettingsOpen);
                      if (activeTab !== 'settings-password' && activeTab !== 'settings-sessions') {
                        setActiveTab('settings-password');
                        setSearchTerm('');
                      }
                    }}
                    className={`w-full h-[50px] px-4 rounded-xl flex items-center gap-3 font-sans text-[15px] transition-all cursor-pointer ${
                      (activeTab === 'settings-password' || activeTab === 'settings-sessions') 
                        ? 'bg-[#D97736]/10 text-[#D97736] font-medium' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Settings className="w-5 h-5" /> 
                    <span>Settings</span>
                    <span className="ml-auto text-xs">{isSettingsOpen ? '▼' : '▶'}</span>
                  </button>

                  {isSettingsOpen && (
                    <div className="pl-6 space-y-1 mt-1 border-l border-white/10 ml-6">
                      <button 
                        onClick={() => { setActiveTab('settings-password'); setSearchTerm(''); setIsSidebarOpen(false); }}
                        className={`w-full h-[40px] px-3 rounded-lg flex items-center gap-2 font-sans text-[14px] transition-all cursor-pointer ${
                          activeTab === 'settings-password' 
                            ? 'bg-[#D97736] text-white font-medium shadow-md shadow-[#D97736]/20' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Lock className="w-4 h-4" /> Change Password
                      </button>
                      <button 
                        onClick={() => { setActiveTab('settings-sessions'); setSearchTerm(''); setIsSidebarOpen(false); }}
                        className={`w-full h-[40px] px-3 rounded-lg flex items-center gap-2 font-sans text-[14px] transition-all cursor-pointer ${
                          activeTab === 'settings-sessions' 
                            ? 'bg-[#D97736] text-white font-medium shadow-md shadow-[#D97736]/20' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4" /> Login Activity
                      </button>
                    </div>
                  )}
                </div>
              </nav>

              {/* Sidebar Footer (Logout) */}
              <div className="p-6 border-t border-white/5">
                <button 
                  onClick={handleLogout}
                  className="w-full h-[48px] rounded-xl border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all flex items-center justify-center gap-2 text-gray-400 font-sans text-[14px] cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-72 ml-0 min-h-screen p-4 md:p-8 lg:p-12 overflow-y-auto">
              
              {/* Header section */}
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-4">
                  {/* Hamburger menu button */}
                  <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden p-3 bg-white rounded-xl border border-gray-200 text-gray-600 hover:text-[#D97736] hover:border-[#D97736]/40 transition-all shadow-sm shrink-0 cursor-pointer"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                  <div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-serif text-[#1A1A1A] capitalize tracking-wide">
                      {activeTab === 'overview' 
                        ? 'Dashboard Overview' 
                        : activeTab === 'settings-password' 
                          ? 'Settings - Change Password' 
                          : activeTab === 'settings-sessions' 
                            ? 'Settings - Login Activity' 
                            : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management`}
                    </h1>
                    <p className="text-gray-500 text-[12px] md:text-[14px] mt-1.5 font-sans">
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-auto">
                  {/* Sync / Refresh Button */}
                  <button 
                    onClick={fetchDashboardData}
                    disabled={isLoading}
                    className="p-3 bg-white rounded-xl border border-gray-200 text-gray-600 hover:text-[#D97736] hover:border-[#D97736]/40 transition-all shadow-sm hover:shadow disabled:opacity-50 cursor-pointer"
                    title="Refresh Data"
                  >
                    <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </header>

              {/* Connection / Fetch Error Alert */}
              {fetchError && (
                <div className="mb-8 p-5 bg-amber-50 border-l-4 border-amber-500 rounded-r-2xl text-amber-800 shadow-sm font-sans flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-[16px] mb-1">Database Connectivity Notice</h4>
                    <p className="text-[14px] text-amber-700">{fetchError}</p>
                  </div>
                  <button 
                    onClick={fetchDashboardData}
                    className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-semibold hover:bg-amber-700 transition-colors shadow-sm shrink-0"
                  >
                    Retry Connection
                  </button>
                </div>
              )}

              {/* ACTIVE TAB: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-12">
                  
                  {/* Summary Counters Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Contacts Counter Card */}
                    <div 
                      onClick={() => setActiveTab('contacts')}
                      className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex items-center justify-between cursor-pointer hover:shadow-[0_15px_35px_rgba(217,119,54,0.06)] hover:-translate-y-1 transition-all duration-300"
                    >
                      <div>
                        <p className="text-gray-400 text-sm font-sans font-medium mb-1 uppercase tracking-wider">Contact Requests</p>
                        <h3 className="text-4xl font-bold font-serif text-[#1A1A1A]">
                          {isLoading ? '...' : contacts.length}
                        </h3>
                      </div>
                      <div className="w-14 h-14 bg-[#FAF7F2] rounded-2xl flex items-center justify-center text-[#D97736]">
                        <Inbox className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Quotes Counter Card */}
                    <div 
                      onClick={() => setActiveTab('quotes')}
                      className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex items-center justify-between cursor-pointer hover:shadow-[0_15px_35px_rgba(217,119,54,0.06)] hover:-translate-y-1 transition-all duration-300"
                    >
                      <div>
                        <p className="text-gray-400 text-sm font-sans font-medium mb-1 uppercase tracking-wider">Quote Calculations</p>
                        <h3 className="text-4xl font-bold font-serif text-[#1A1A1A]">
                          {isLoading ? '...' : quotes.length}
                        </h3>
                      </div>
                      <div className="w-14 h-14 bg-[#FAF7F2] rounded-2xl flex items-center justify-center text-[#D97736]">
                        <FileText className="w-6 h-6" />
                      </div>
                    </div>

                    {/* AI Designs Counter Card (Commented out as per requirements) */}
                    {/* 
                    <div 
                      onClick={() => setActiveTab('aidesigns')}
                      className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex items-center justify-between cursor-pointer hover:shadow-[0_15px_35px_rgba(217,119,54,0.06)] hover:-translate-y-1 transition-all duration-300"
                    >
                      <div>
                        <p className="text-gray-400 text-sm font-sans font-medium mb-1 uppercase tracking-wider">AI Room Designs</p>
                        <h3 className="text-4xl font-bold font-serif text-[#1A1A1A]">
                          {isLoading ? '...' : aiRequests.length}
                        </h3>
                      </div>
                      <div className="w-14 h-14 bg-[#FAF7F2] rounded-2xl flex items-center justify-center text-[#D97736]">
                        <Sparkles className="w-6 h-6" />
                      </div>
                    </div>
                    */}

                    {/* Portfolio Counter Card */}
                    <div 
                      onClick={() => setActiveTab('portfolio')}
                      className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex items-center justify-between cursor-pointer hover:shadow-[0_15px_35px_rgba(217,119,54,0.06)] hover:-translate-y-1 transition-all duration-300"
                    >
                      <div>
                        <p className="text-gray-400 text-sm font-sans font-medium mb-1 uppercase tracking-wider">Portfolio Items</p>
                        <h3 className="text-4xl font-bold font-serif text-[#1A1A1A]">
                          {isLoading ? '...' : (usePortfolioFallback ? 8 : portfolioItems.length)}
                        </h3>
                      </div>
                      <div className="w-14 h-14 bg-[#FAF7F2] rounded-2xl flex items-center justify-center text-[#D97736]">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity lists */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Recent Contacts Card */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col h-[520px]">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">Recent Contacts</h3>
                        <button 
                          onClick={() => setActiveTab('contacts')} 
                          className="text-sm font-medium text-[#D97736] hover:underline flex items-center gap-1 font-sans"
                        >
                          View All <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto pr-1 space-y-4">
                        {isLoading ? (
                          <div className="flex items-center justify-center h-full text-gray-400">Loading records...</div>
                        ) : contacts.length === 0 ? (
                          <div className="flex items-center justify-center h-full text-gray-400">No contact requests submitted yet.</div>
                        ) : (
                          contacts.slice(0, 5).map((c) => (
                            <div 
                              key={c.id}
                              onClick={() => setSelectedItem({ type: 'contact', data: c })}
                              className="p-4 bg-[#FAF7F2] rounded-2xl border border-gray-100 hover:border-[#D97736]/30 cursor-pointer transition-all flex items-start justify-between"
                            >
                              <div className="space-y-1">
                                <h4 className="font-sans font-bold text-gray-800 text-[15px]">{c.name || 'Anonymous'}</h4>
                                <p className="text-xs text-gray-500 font-sans">{c.serviceNeeded || 'General Inquiry'}</p>
                                <p className="text-xs text-gray-400 font-sans line-clamp-1">{c.message}</p>
                              </div>
                              <span className="text-[11px] text-gray-400 font-sans shrink-0 ml-4">
                                {c.phone || c.email || 'N/A'}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Recent Quotes Card */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col h-[520px]">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">Recent Quote Calculations</h3>
                        <button 
                          onClick={() => setActiveTab('quotes')} 
                          className="text-sm font-medium text-[#D97736] hover:underline flex items-center gap-1 font-sans"
                        >
                          View All <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto pr-1 space-y-4">
                        {isLoading ? (
                          <div className="flex items-center justify-center h-full text-gray-400">Loading records...</div>
                        ) : quotes.length === 0 ? (
                          <div className="flex items-center justify-center h-full text-gray-400">No quote requests calculated yet.</div>
                        ) : (
                          quotes.slice(0, 5).map((q) => {
                            const parsed = parseQuoteNotes(q.additionalNotes);
                            return (
                              <div 
                                key={q.id}
                                onClick={() => setSelectedItem({ type: 'quote', data: q })}
                                className="p-4 bg-[#FAF7F2] rounded-2xl border border-gray-100 hover:border-[#D97736]/30 cursor-pointer transition-all"
                              >
                                <div className="space-y-1">
                                  <h4 className="font-sans font-bold text-gray-800 text-[15px]">{parsed.name}</h4>
                                  <p className="text-xs text-gray-500 font-sans">
                                    {q.roomSize} sq.ft • {q.roomType || 'Room'} • {q.materialQuality}
                                  </p>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* ACTIVE TAB: CONTACTS, QUOTES, AI DESIGNS */}
              {activeTab !== 'overview' && activeTab !== 'portfolio' && activeTab !== 'settings-password' && activeTab !== 'settings-sessions' && (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                  
                  {/* Search Bar Utility */}
                  <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:max-w-xl">
                      <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="text"
                          placeholder={`Search ${activeTab}...`}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full h-[46px] pl-11 pr-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D97736] font-sans text-sm bg-gray-50/50"
                        />
                      </div>
                      {activeTab === 'quotes' && (
                        <div className="relative">
                          <select
                            value={quoteFilter}
                            onChange={(e) => setQuoteFilter(e.target.value)}
                            className="h-[46px] pl-4 pr-10 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D97736] font-sans text-sm bg-gray-50/50 text-gray-700 cursor-pointer min-w-[180px] appearance-none"
                          >
                            <option value="all">All Quotes</option>
                            <option value="provided">Details Provided</option>
                            <option value="not-provided">Details Not Provided</option>
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <span className="text-[10px]">▼</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-400 font-sans ml-auto">
                      Showing {getFilteredData().length} of {activeTab === 'contacts' ? contacts.length : activeTab === 'quotes' ? quotes.length : aiRequests.length} entries
                    </div>
                  </div>

                  {/* Data Content */}
                  <div className="overflow-x-auto">
                    {isLoading ? (
                      <div className="py-24 text-center text-gray-400 font-sans">Loading data from backend DB...</div>
                    ) : getFilteredData().length === 0 ? (
                      <div className="py-24 text-center text-gray-400 font-sans">No matching records found.</div>
                    ) : (
                      <table className="w-full text-left border-collapse font-sans">
                        
                        {/* Table Headers */}
                        <thead>
                          <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 font-semibold text-[13px] uppercase tracking-wider">
                            {activeTab === 'contacts' && (
                              <>
                                <th className="py-5 px-6">Name</th>
                                <th className="py-5 px-6">Service</th>
                                <th className="py-5 px-6">Phone</th>
                                <th className="py-5 px-6">Email</th>
                                <th className="py-5 px-6 text-center">Actions</th>
                              </>
                            )}
                            {activeTab === 'quotes' && (
                              <>
                                <th className="py-5 px-6">Client</th>
                                <th className="py-5 px-6">Room Size (sq.ft) / Type</th>
                                <th className="py-5 px-6">Material Excellence / Design Complexity</th>
                                <th className="py-5 px-6 text-center">Actions</th>
                              </>
                            )}
                            {/* 
                            {activeTab === 'aidesigns' && (
                              <>
                                <th className="py-5 px-6">Room / Style</th>
                                <th className="py-5 px-6">Color Preference</th>
                                <th className="py-5 px-6">Budget Range</th>
                                <th className="py-5 px-6">Uploads</th>
                                <th className="py-5 px-6 text-center">Actions</th>
                              </>
                            )}
                            */}
                          </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="divide-y divide-gray-100 text-[14px]">
                          {/* CONTACTS TAB rows */}
                          {activeTab === 'contacts' && getFilteredData().map((c) => (
                            <tr key={c.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                              <td className="py-4 px-6 font-bold text-gray-800">{c.name || 'N/A'}</td>
                              <td className="py-4 px-6 text-gray-600">{c.serviceNeeded || 'General Inquiry'}</td>
                              <td className="py-4 px-6 text-gray-600 font-medium">
                                <div className="flex flex-col gap-1">
                                  <span>{c.phone || 'N/A'}</span>
                                  {c.phone && hasMatchingQuote(c.phone) && (
                                    <span className="inline-flex items-center gap-1 self-start text-[10px] font-semibold bg-green-50 text-green-700 px-1.5 py-0.5 rounded border border-green-200">
                                      <Link className="w-2.5 h-2.5" /> Has Quote
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-6 text-gray-500">{c.email || 'N/A'}</td>
                              <td className="py-4 px-6 text-center">
                                <button 
                                  onClick={() => setSelectedItem({ type: 'contact', data: c })}
                                  className="p-2 hover:bg-[#D97736]/10 text-gray-500 hover:text-[#D97736] rounded-lg transition-all"
                                  title="View Message Detail"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}

                          {/* QUOTES TAB rows */}
                          {activeTab === 'quotes' && getFilteredData().map((q) => {
                            const parsed = parseQuoteNotes(q.additionalNotes);
                            return (
                              <tr key={q.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                                <td className="py-4 px-6">
                                  <div className="font-bold text-gray-800">{parsed.name}</div>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs text-gray-400 font-medium">{parsed.phone}</span>
                                    {parsed.phone && parsed.phone !== 'N/A' && hasMatchingContact(parsed.phone) && (
                                      <span className="inline-flex items-center gap-1 text-[9px] font-semibold bg-green-50 text-green-700 px-1 py-0.2 rounded border border-green-200">
                                        <Link className="w-2.5 h-2.5" /> Has Contact
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-4 px-6 text-gray-600">
                                  {q.roomSize} sq.ft <span className="text-gray-300 mx-1.5">•</span> {q.roomType || 'Room'}
                                </td>
                                <td className="py-4 px-6 text-gray-600">
                                  {q.materialQuality} <span className="text-gray-300 mx-1.5">•</span> {q.designComplexity}
                                </td>
                                <td className="py-4 px-6 text-center">
                                  <button 
                                    onClick={() => setSelectedItem({ type: 'quote', data: q })}
                                    className="p-2 hover:bg-[#D97736]/10 text-gray-500 hover:text-[#D97736] rounded-lg transition-all"
                                    title="View Notes & Details"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}

                          {/* AI DESIGNS TAB rows */}
                          {/* 
                          {activeTab === 'aidesigns' && getFilteredData().map((a) => (
                            <tr key={a.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                              <td className="py-4 px-6">
                                <div className="font-bold text-gray-800">{a.roomType}</div>
                                <div className="text-xs text-gray-400 font-medium">{a.designStyle}</div>
                              </td>
                              <td className="py-4 px-6 text-gray-600">{a.colorPreferences || 'None'}</td>
                              <td className="py-4 px-6 text-gray-600 font-medium">{a.budgetRange}</td>
                              <td className="py-4 px-6 text-gray-600">
                                <div className="flex gap-2">
                                  {a.imagePath ? (
                                    <button 
                                      onClick={() => setLightboxImage(`${API_BASE_URL}${a.imagePath}`)}
                                      className="text-xs bg-[#FAF7F2] hover:bg-[#D97736]/10 text-[#D97736] px-2 py-1 rounded-md border border-gray-200 transition-colors flex items-center gap-1 font-semibold"
                                    >
                                      Image <ExternalLink className="w-3 h-3" />
                                    </button>
                                  ) : <span className="text-xs text-gray-400">No Image</span>}

                                  {a.floorPlanPath ? (
                                    <button 
                                      onClick={() => setLightboxImage(`${API_BASE_URL}${a.floorPlanPath}`)}
                                      className="text-xs bg-[#FAF7F2] hover:bg-[#D97736]/10 text-[#D97736] px-2 py-1 rounded-md border border-gray-200 transition-colors flex items-center gap-1 font-semibold"
                                    >
                                      Plan <ExternalLink className="w-3 h-3" />
                                    </button>
                                  ) : null}
                                </div>
                              </td>
                              <td className="py-4 px-6 text-center">
                                <button 
                                  onClick={() => setSelectedItem({ type: 'aidesign', data: a })}
                                  className="p-2 hover:bg-[#D97736]/10 text-gray-500 hover:text-[#D97736] rounded-lg transition-all"
                                  title="View Request Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                          */}
                        </tbody>

                      </table>
                    )}
                  </div>

                </div>
              )}

              {/* ACTIVE TAB: PORTFOLIO */}
              {activeTab === 'portfolio' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  
                  {/* Left Column: Dedicated Upload Section */}
                  <div className="lg:col-span-1 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:p-8 space-y-6">
                    <div>
                      <h3 className="text-lg font-serif font-bold text-gray-800 border-b border-gray-100 pb-3 mb-2">
                        Upload New Image
                      </h3>
                      <p className="text-xs text-gray-400 font-sans">
                        Add a new project photo. Valid formats: JPEG, PNG, SVG, AVIF, WEBP (Max 10MB). Maximum 12 images per section/category.
                      </p>
                    </div>

                    <form onSubmit={handleAddPortfolioItem} className="space-y-4">
                      <div>
                        <label className="block text-gray-700 text-xs font-semibold uppercase tracking-wider mb-2">Project Title *</label>
                        <input 
                          type="text"
                          required
                          placeholder="e.g. Minimalist Family Living Room"
                          value={newPortfolioTitle}
                          onChange={(e) => setNewPortfolioTitle(e.target.value)}
                          className="w-full h-[46px] px-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D97736] font-sans text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 text-xs font-semibold uppercase tracking-wider mb-2">Location</label>
                        <input 
                          type="text"
                          placeholder="e.g. Austin, TX"
                          value={newPortfolioLocation}
                          onChange={(e) => setNewPortfolioLocation(e.target.value)}
                          className="w-full h-[46px] px-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D97736] font-sans text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 text-xs font-semibold uppercase tracking-wider mb-2">Category *</label>
                        <select 
                          value={newPortfolioCategory}
                          onChange={(e) => setNewPortfolioCategory(e.target.value)}
                          className="w-full h-[46px] px-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D97736] font-sans text-sm bg-white"
                        >
                          <option value="Residential">Residential</option>
                          <option value="Commercial">Commercial</option>
                          <option value="Office">Office</option>
                          <option value="Hospitality">Hospitality</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-700 text-xs font-semibold uppercase tracking-wider mb-2">Interior Photo *</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-5 text-center hover:border-[#D97736]/40 transition-colors relative bg-gray-50/30">
                          <input 
                            type="file"
                            accept=".jpg,.jpeg,.png,.svg,.avif,.webp,image/jpeg,image/png,image/svg+xml,image/avif,image/webp"
                            required
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          {newPortfolioImagePreview ? (
                            <div className="space-y-3">
                              <img 
                                src={newPortfolioImagePreview} 
                                alt="Preview" 
                                className="max-h-[140px] mx-auto rounded-lg object-cover" 
                              />
                              <p className="text-xs text-gray-500 font-medium">Click or drag to replace image</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="w-10 h-10 bg-[#FAF7F2] rounded-full flex items-center justify-center mx-auto text-[#D97736]">
                                <ImageIcon className="w-5 h-5" />
                              </div>
                              <p className="text-xs font-semibold text-gray-700">Upload Image</p>
                              <p className="text-[10px] text-gray-400">JPEG, PNG, SVG, AVIF, WEBP (Max 10MB)</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {portfolioSubmitError && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-sans">
                          {portfolioSubmitError}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isPortfolioSubmitting}
                        className="w-full h-[46px] bg-[#D97736] hover:bg-[#b86128] text-white rounded-xl font-sans text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-[#D97736]/10"
                      >
                        {isPortfolioSubmitting ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <>Add to Portfolio</>
                        )}
                      </button>
                    </form>
                  </div>

                  {/* Right Column: Portfolio Items List */}
                  <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    
                    {/* Search Bar Utility */}
                    <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="relative w-full md:max-w-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="text"
                          placeholder="Search portfolio..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full h-[46px] pl-11 pr-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D97736] font-sans text-sm bg-gray-50/50"
                        />
                      </div>
                      
                      <div className="text-xs text-gray-400 font-sans ml-auto">
                        Showing {getFilteredData().length} of {usePortfolioFallback ? 8 : portfolioItems.length} entries
                      </div>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto">
                      {isLoading ? (
                        <div className="py-24 text-center text-gray-400 font-sans">Loading data from backend DB...</div>
                      ) : getFilteredData().length === 0 ? (
                        <div className="py-24 text-center text-gray-400 font-sans">No matching records found.</div>
                      ) : (
                        <table className="w-full text-left border-collapse font-sans">
                          <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 font-semibold text-[13px] uppercase tracking-wider">
                              <th className="py-5 px-6">Image</th>
                              <th className="py-5 px-6">Project Title</th>
                              <th className="py-5 px-6">Location</th>
                              <th className="py-5 px-6">Category</th>
                              <th className="py-5 px-6 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-[14px]">
                            {getFilteredData().map((p) => (
                              <tr key={p.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                                <td className="py-4 px-6">
                                  <div className="w-16 h-12 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0">
                                    <img 
                                      src={p.isStatic ? p.imagePath : `${API_BASE_URL}${p.imagePath}`} 
                                      alt={p.title} 
                                      className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                                      onClick={() => setLightboxImage(p.isStatic ? p.imagePath : `${API_BASE_URL}${p.imagePath}`)}
                                    />
                                  </div>
                                </td>
                                <td className="py-4 px-6 font-bold text-gray-800">{p.title || 'N/A'}</td>
                                <td className="py-4 px-6 text-gray-600 font-medium">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                    <span>{p.location || 'N/A'}</span>
                                  </div>
                                </td>
                                <td className="py-4 px-6">
                                  <span className="inline-block bg-[#FAF7F2] text-[#D97736] px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                                    {p.category}
                                  </span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                  {p.isStatic ? (
                                    <span className="text-[11px] text-gray-400 font-medium italic bg-gray-100 px-2 py-0.5 rounded">
                                      System Default
                                    </span>
                                  ) : (
                                    <button 
                                      onClick={() => handleDeletePortfolioItem(p.id)}
                                      className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-all"
                                      title="Delete Portfolio Item"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ACTIVE TAB: SETTINGS PASSWORD */}
              {activeTab === 'settings-password' && (
                <div className="max-w-xl bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:p-8 space-y-6 mx-auto lg:mx-0">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-gray-800 border-b border-gray-100 pb-3 mb-2 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-[#D97736]" /> Change Admin Password
                    </h3>
                    <p className="text-xs text-gray-400 font-sans">
                      Update the security password used to log in to the Admin Portal.
                    </p>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-xs font-semibold uppercase tracking-wider mb-2">Current Password *</label>
                      <input 
                        type="password"
                        required
                        placeholder="Enter current password"
                        value={changePasswordOld}
                        onChange={(e) => setChangePasswordOld(e.target.value)}
                        className="w-full h-[46px] px-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D97736] font-sans text-sm bg-gray-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-xs font-semibold uppercase tracking-wider mb-2">New Password *</label>
                      <input 
                        type="password"
                        required
                        placeholder="Enter new password"
                        value={changePasswordNew}
                        onChange={(e) => setChangePasswordNew(e.target.value)}
                        className="w-full h-[46px] px-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D97736] font-sans text-sm bg-gray-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-xs font-semibold uppercase tracking-wider mb-2">Confirm New Password *</label>
                      <input 
                        type="password"
                        required
                        placeholder="Confirm new password"
                        value={changePasswordConfirm}
                        onChange={(e) => setChangePasswordConfirm(e.target.value)}
                        className="w-full h-[46px] px-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D97736] font-sans text-sm bg-gray-50/50"
                      />
                    </div>

                    {passwordError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-sans">
                        {passwordError}
                      </div>
                    )}

                    {passwordSuccess && (
                      <div className="p-3 bg-green-50 border border-green-200 text-green-600 rounded-xl text-xs font-sans">
                        {passwordSuccess}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full h-[46px] bg-[#D97736] hover:bg-[#b86128] text-white rounded-xl font-sans text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#D97736]/10 cursor-pointer"
                    >
                      Update Password
                    </button>
                  </form>
                </div>
              )}

              {/* ACTIVE TAB: LOGIN SESSIONS */}
              {activeTab === 'settings-sessions' && (
                <div className="max-w-4xl bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:p-8 space-y-6">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-gray-800 border-b border-gray-100 pb-3 mb-2 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-[#D97736]" /> Login Activity Sessions
                    </h3>
                    <p className="text-xs text-gray-400 font-sans">
                      Review all administrator log-in activity and active sessions.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    {loginSessions.length === 0 ? (
                      <div className="py-12 text-center text-gray-400 font-sans">No recorded login sessions.</div>
                    ) : (
                      <table className="w-full text-left border-collapse font-sans">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold text-[13px] uppercase tracking-wider">
                            <th className="py-4 px-6">Timestamp</th>
                            <th className="py-4 px-6">OS</th>
                            <th className="py-4 px-6">Browser</th>
                            <th className="py-4 px-6">IP Address</th>
                            <th className="py-4 px-6 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-[14px]">
                          {loginSessions.map((session) => (
                            <tr key={session.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                              <td className="py-4 px-6 text-gray-800 font-semibold">{session.timestamp}</td>
                              <td className="py-4 px-6 text-gray-600">{session.os}</td>
                              <td className="py-4 px-6 text-gray-600">{session.browser}</td>
                              <td className="py-4 px-6 text-gray-500">{session.ip}</td>
                              <td className="py-4 px-6 text-center">
                                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                                  session.status === 'Active' 
                                    ? 'bg-green-50 text-green-700 border border-green-200' 
                                    : 'bg-gray-100 text-gray-500'
                                }`}>
                                  {session.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DETAIL VIEW MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-[600px] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-[#2A2826] text-white p-6 flex items-center justify-between">
              <h3 className="text-xl font-serif font-bold tracking-wide">
                {selectedItem.type === 'contact' ? 'Contact Submission' : selectedItem.type === 'quote' ? 'Quote Calculation Detail' : 'AI Design Request Info'}
              </h3>
              <button 
                onClick={() => setSelectedItem(null)}
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto space-y-6">
              
              {/* CONTACT VIEW */}
              {selectedItem.type === 'contact' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-gray-400 font-sans font-semibold uppercase tracking-wider mb-1">Sender Name</p>
                      <p className="font-sans font-bold text-gray-800 text-lg">{selectedItem.data.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-sans font-semibold uppercase tracking-wider mb-1">Service Needed</p>
                      <p className="font-sans font-bold text-gray-800 text-lg">{selectedItem.data.serviceNeeded || 'General Inquiry'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-gray-400 font-sans font-semibold uppercase tracking-wider mb-1">Phone Number</p>
                      <div className="flex items-center gap-2">
                        <p className="font-sans font-semibold text-[#D97736]">{selectedItem.data.phone || 'N/A'}</p>
                        {selectedItem.data.phone && hasMatchingQuote(selectedItem.data.phone) && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-green-50 text-green-700 px-1.5 py-0.5 rounded border border-green-200">
                            <Link className="w-2.5 h-2.5" /> Has Quote Request
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-sans font-semibold uppercase tracking-wider mb-1">Email Address</p>
                      <p className="font-sans font-semibold text-gray-700">{selectedItem.data.email || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-6">
                    <p className="text-xs text-gray-400 font-sans font-semibold uppercase tracking-wider mb-2">Message Body</p>
                    <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-gray-100 text-[15px] leading-relaxed text-gray-600 font-sans">
                      {selectedItem.data.message || 'No message provided.'}
                    </div>
                  </div>
                </div>
              )}

              {/* QUOTE VIEW */}
              {selectedItem.type === 'quote' && (() => {
                const parsed = parseQuoteNotes(selectedItem.data.additionalNotes);
                return (
                  <div className="space-y-6">
                    <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-gray-100 flex items-center justify-between">
                      <span className="text-sm font-sans font-semibold text-gray-700">Quote Request Details</span>
                      <span className="text-[12px] text-gray-400 font-sans bg-white border border-gray-100 px-3 py-1 rounded-full">
                        ID: #{selectedItem.data.id}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs text-gray-400 font-sans font-semibold uppercase tracking-wider mb-1">Client Name</p>
                        <p className="font-sans font-bold text-gray-800">{parsed.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-sans font-semibold uppercase tracking-wider mb-1">Client Phone</p>
                        <div className="flex items-center gap-2">
                          <p className="font-sans font-semibold text-gray-700">{parsed.phone}</p>
                          {parsed.phone && parsed.phone !== 'N/A' && hasMatchingContact(parsed.phone) && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-green-50 text-green-700 px-1.5 py-0.5 rounded border border-green-200">
                              <Link className="w-2.5 h-2.5" /> Has Contact Submission
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-b border-gray-100 py-6">
                      <div>
                        <p className="text-xs text-gray-400 font-sans font-semibold uppercase tracking-wider mb-1">Room Size (sq.ft)</p>
                        <p className="font-sans font-semibold text-gray-800">{selectedItem.data.roomSize} sq.ft</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-sans font-semibold uppercase tracking-wider mb-1">Room Type</p>
                        <p className="font-sans font-semibold text-gray-800">{selectedItem.data.roomType || 'Room'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-sans font-semibold uppercase tracking-wider mb-1">Material Excellence</p>
                        <p className="font-sans font-semibold text-gray-800">{selectedItem.data.materialQuality}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-sans font-semibold uppercase tracking-wider mb-1">Design Complexity</p>
                        <p className="font-sans font-semibold text-gray-800">{selectedItem.data.designComplexity}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 font-sans font-semibold uppercase tracking-wider mb-2">Description</p>
                      <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-gray-100 text-[15px] leading-relaxed text-gray-600 font-sans">
                        {parsed.customNotes || 'No custom description provided.'}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* AI DESIGN VIEW */}
              {/* 
              {selectedItem.type === 'aidesign' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-gray-400 font-sans font-semibold uppercase tracking-wider mb-1">Room Type</p>
                      <p className="font-sans font-bold text-gray-800 text-lg">{selectedItem.data.roomType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-sans font-semibold uppercase tracking-wider mb-1">Design Style</p>
                      <p className="font-sans font-bold text-gray-800 text-lg">{selectedItem.data.designStyle}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-gray-400 font-sans font-semibold uppercase tracking-wider mb-1">Color Palette</p>
                      <p className="font-sans font-semibold text-[#D97736]">{selectedItem.data.colorPreferences || 'None specified'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-sans font-semibold uppercase tracking-wider mb-1">Budget Allocation</p>
                      <p className="font-sans font-semibold text-gray-700">{selectedItem.data.budgetRange}</p>
                    </div>
                  </div>

                  {selectedItem.data.additionalNotes && (
                    <div className="border-t border-gray-100 pt-6">
                      <p className="text-xs text-gray-400 font-sans font-semibold uppercase tracking-wider mb-2">Additional Design Notes</p>
                      <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-gray-100 text-[15px] leading-relaxed text-gray-600 font-sans">
                        {selectedItem.data.additionalNotes}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-6 border-t border-gray-100 pt-6">
                    {selectedItem.data.imagePath && (
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 font-sans font-semibold uppercase tracking-wider mb-3">Room Image</p>
                        <div 
                          onClick={() => setLightboxImage(`${API_BASE_URL}${selectedItem.data.imagePath}`)}
                          className="relative rounded-2xl overflow-hidden border border-gray-200 cursor-zoom-in h-40 bg-gray-100 group"
                        >
                          <img 
                            src={`${API_BASE_URL}${selectedItem.data.imagePath}`} 
                            alt="Room Design Request" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                            <span className="bg-white/95 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-800 shadow flex items-center gap-1">
                              Zoom <Eye className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedItem.data.floorPlanPath && (
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 font-sans font-semibold uppercase tracking-wider mb-3">Floor Plan</p>
                        <div 
                          onClick={() => setLightboxImage(`${API_BASE_URL}${selectedItem.data.floorPlanPath}`)}
                          className="relative rounded-2xl overflow-hidden border border-gray-200 cursor-zoom-in h-40 bg-gray-100 group"
                        >
                          <img 
                            src={`${API_BASE_URL}${selectedItem.data.floorPlanPath}`} 
                            alt="Floor Plan Request" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                            <span className="bg-white/95 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-800 shadow flex items-center gap-1">
                              Zoom <Eye className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              )}
              */}

            </div>
          </div>
        </div>
      )}

      {/* IMAGE LIGHTBOX MODAL */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200 cursor-zoom-out"
          onClick={() => setLightboxImage(null)}
        >
          <button 
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={lightboxImage} 
            alt="Enlarged preview" 
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-200" 
          />
        </div>
      )}



    </div>
  );
};

export default AdminPage;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import AITechnology from './components/AITechnology';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';
import ServicesPage from './pages/ServicesPage';
import PortfolioPage from './pages/PortfolioPage';
// import AIDesignerPage from './pages/AIDesignerPage';
import QuotePage from './pages/QuotePage';
import ContactPage from './pages/ContactPage';
import FloatingWidgets from './components/FloatingWidgets';
import AdminPage from './pages/AdminPage';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    const handleLinkClick = (e) => {
      const anchor = e.target.closest('a');
      if (
        anchor &&
        anchor.tagName === 'A' &&
        anchor.href &&
        anchor.host === window.location.host &&
        !anchor.target &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !e.altKey &&
        !anchor.hasAttribute('download')
      ) {
        const url = new URL(anchor.href);
        if (url.pathname !== window.location.pathname || url.search !== window.location.search) {
          e.preventDefault();
          window.history.pushState(null, '', url.pathname + url.search + url.hash);
          setCurrentPath(url.pathname);
          if (!url.hash) {
            window.scrollTo(0, 0);
          }
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleLinkClick);

    // Support legacy hash links (like /#/services) by redirecting them to paths
    if (window.location.hash && window.location.hash.startsWith('#/')) {
      const pathFromHash = window.location.hash.substring(2); // remove '#/'
      window.history.replaceState(null, '', '/' + pathFromHash);
      setCurrentPath('/' + pathFromHash.split('?')[0]);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  // Simple router based on path
  let pageContent;

  if (currentPath.startsWith('/admin')) {
    pageContent = <AdminPage />;
  } else if (currentPath.startsWith('/services')) {
    pageContent = <ServicesPage />;
  } else if (currentPath.startsWith('/portfolio')) {
    pageContent = <PortfolioPage />;
  // } else if (currentPath.startsWith('/ai-designer')) {
  //   pageContent = <AIDesignerPage />;
  } else if (currentPath.startsWith('/get-quote')) {
    pageContent = <QuotePage />;
  } else if (currentPath.startsWith('/contact')) {
    pageContent = <ContactPage />;
  } else {
    pageContent = (
      <div className="min-h-screen bg-[#FAF7F2] text-gray-800 font-sans selection:bg-[#D97736] selection:text-white">
        <Navbar />
        <Hero />
        <Services />
        {/* <AITechnology /> */}
        <Testimonials />
        <CTA />
        <Footer />
      </div>
    );
  }

  return (
    <>
      {pageContent}
      {!currentPath.startsWith('/admin') && <FloatingWidgets />}
    </>
  );
}

export default App;
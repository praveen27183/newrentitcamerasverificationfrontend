import React, { useState, useEffect } from 'react';
import logo from '../../../asset/Rentit logo (1).png';
import Card from './Card';

const quickLinks = [
  'Cameras', 'Lenses', 'Lights', 'Audio', 'Props', 'How It Works'
];

const Footer = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <footer className="bg-gradient-to-b from-[#1A97A9] to-[#0f2e34] text-white pt-10 pb-4 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-white/20">
          {/* Brand Info */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-md flex items-center justify-center mr-3">
                <img src={logo} alt="RentIt Logo" className="w-12 h-12 sm:w-14 sm:h-14 object-contain" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold">RentIt Cameras</div>
                <div className="text-white/80 font-semibold text-xs sm:text-sm -mt-1">Stop Buying, RentIt!</div>
              </div>
            </div>
            <p className="text-white/80 text-xs sm:text-sm mb-5 max-w-xs">
              Your trusted partner for professional camera gear rental. We provide high-quality cameras, lenses,
              lights, and audio equipment for photographers, videographers, and content creators across Chennai.
            </p>
            <div className="hidden md:block">
              <Card />
            </div>
          </div>

          {/* Quick Links - Mobile Accordion */}
          <div className="md:hidden">
            <button 
              onClick={() => toggleSection('quickLinks')}
              className="w-full flex justify-between items-center text-lg font-semibold mb-2 text-white/90 py-2"
            >
              Quick Links
              <svg 
                className={`w-5 h-5 transform transition-transform ${expandedSection === 'quickLinks' ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {(expandedSection === 'quickLinks' || !isMobile) && (
              <ul className="space-y-2 pl-2">
                {quickLinks.map((link, i) => (
                  <li key={i}>
                    <a
                      href="equipments"
                      className="block py-1.5 text-white/90 text-sm hover:text-white hover:pl-2 transition-all"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Quick Links - Desktop */}
          <div className="hidden md:block">
            <div className="text-lg font-semibold mb-3 text-white/90">Quick Links</div>
            <ul className="space-y-2">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href="equipments"
                    className="text-white/90 text-sm hover:text-white hover:underline transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us - Mobile Accordion */}
          <div className="md:hidden">
            <button 
              onClick={() => toggleSection('contact')}
              className="w-full flex justify-between items-center text-lg font-semibold mb-2 text-white/90 py-2"
            >
              Contact Us
              <svg 
                className={`w-5 h-5 transform transition-transform ${expandedSection === 'contact' ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {(expandedSection === 'contact' || !isMobile) && (
              <div className="space-y-4 pl-2">
                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="bg-[#1A97A9]/30 hover:bg-[#1A97A9]/50 p-2 rounded-full flex-shrink-0 transition-colors">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <a href="tel:+919940423791" className="block text-white/90 text-sm font-medium hover:text-white hover:underline transition-colors">
                      +91 99404 23791
                    </a>
                    <div className="text-white/60 text-xs mt-0.5">8 AM - 10 PM</div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="bg-[#1A97A9]/30 hover:bg-[#1A97A9]/50 p-2 rounded-full flex-shrink-0 transition-colors">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <a href="mailto:info@rentitcameras.com" className="block text-white/90 text-sm font-medium hover:text-white hover:underline transition-colors break-all">
                      info@rentitcameras.com
                    </a>
                    <div className="text-white/60 text-xs mt-0.5">Quick response</div>
                  </div>
                </div>

                {/* Locations */}
                <div className="flex items-start gap-3">
                  <div className="bg-[#1A97A9]/30 hover:bg-[#1A97A9]/50 p-2 rounded-full flex-shrink-0 transition-colors">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="space-y-1">
                      <a href="https://maps.app.goo.gl/Vif5PkqJHQm63axQ9" className="flex items-center gap-2 group">
                        <span className="text-white/90 text-sm font-medium group-hover:text-white group-hover:underline transition-colors">KK Nagar</span>
                      </a>
                      <a href="https://maps.app.goo.gl/X2vioWvAgNk9V5Ay7" className="flex items-center gap-2 group">
                        <span className="text-white/90 text-sm font-medium group-hover:text-white group-hover:underline transition-colors">Anna Nagar</span>
                      </a>
                    </div>
                    <div className="text-white/60 text-xs mt-0.5">Pickup locations</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contact Us - Desktop */}
          <div className="hidden md:block">
            <div className="text-lg font-semibold mb-3 text-white/90">Contact Us</div>
            <div className="space-y-4">
              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="bg-[#1A97A9]/30 hover:bg-[#1A97A9]/50 p-2 rounded-full flex-shrink-0 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <a href="tel:+919940423791" className="block text-white/90 text-sm font-medium hover:text-white hover:underline transition-colors">
                    +91 99404 23791
                  </a>
                  <div className="text-white/60 text-xs mt-0.5">8 AM - 10 PM</div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="bg-[#1A97A9]/30 hover:bg-[#1A97A9]/50 p-2 rounded-full flex-shrink-0 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <a href="mailto:info@rentitcameras.com" className="block text-white/90 text-sm font-medium hover:text-white hover:underline transition-colors break-all">
                    info@rentitcameras.com
                  </a>
                  <div className="text-white/60 text-xs mt-0.5">Quick response</div>
                </div>
              </div>

              {/* Locations */}
              <div className="flex items-start gap-3">
                <div className="bg-[#1A97A9]/30 hover:bg-[#1A97A9]/50 p-2 rounded-full flex-shrink-0 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div className="space-y-1">
                    <a href="https://maps.app.goo.gl/Vif5PkqJHQm63axQ9" className="flex items-center gap-2 group">
                      <span className="text-white/90 text-sm font-medium group-hover:text-white group-hover:underline transition-colors">KK Nagar</span>
                    </a>
                    <a href="https://maps.app.goo.gl/X2vioWvAgNk9V5Ay7" className="flex items-center gap-2 group">
                      <span className="text-white/90 text-sm font-medium group-hover:text-white group-hover:underline transition-colors">Anna Nagar</span>
                    </a>
                  </div>
                  <div className="text-white/60 text-xs mt-0.5">Pickup locations</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Social Card */}
        <div className="md:hidden mt-4">
          <Card />
        </div>

        {/* Bottom Bar */}
        <div className="col-span-full pt-6 mt-4 border-t border-white/10 text-white/70 text-xs sm:text-sm">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left"> 2025 RentIt Cameras. All rights reserved.</div>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
              <a href="/support" className="hover:text-white hover:underline transition-colors">Privacy Policy</a>
              <a href="/support" className="hover:text-white hover:underline transition-colors">Terms of Service</a>
              <a href="/support" className="hover:text-white hover:underline transition-colors">Rental Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

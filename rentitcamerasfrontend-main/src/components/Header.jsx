import React, { useState, useRef, useEffect } from 'react';
import { Search, Menu, X, Camera, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../asset/Rentit logo (1).png';
import axios from 'axios';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestions = [
    { label: 'DSLR Camera', redirect: '/equipments?category=cameras&type=dslr' },
    { label: 'Mirrorless Camera', redirect: '/equipments?category=cameras&type=mirrorless' },
    { label: 'Cinema Camera', redirect: '/equipments?category=cameras&type=cinema' },
    { label: 'Action Camera', redirect: '/equipments?category=cameras&type=action' },
    { label: 'Point & Shoot', redirect: '/equipments?category=cameras&type=pointshoot' },
    { label: 'Lighting Kit', redirect: '/equipments?category=lighting' },
    { label: 'Tripod', redirect: '/equipments?category=tripods' },
    { label: 'DJI Drone', redirect: '/equipments?category=drone' },
    { label: 'GoPro', redirect: '/equipments?category=cameras&type=action' },
    { label: 'Mic', redirect: '/equipments?category=mic' },
    { label: 'Canon', redirect: '/equipments?category=cameras&brand=Canon' },
    { label: 'Sony', redirect: '/equipments?category=cameras&brand=Sony' },
    { label: 'Camera Rental Offers', redirect: '/equipments?offers=1' }
  ];
  const collectionsRef = useRef(null);

  // Debounced search effect
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        const products = res.data || [];
        const filtered = products.filter(product =>
          product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered);
      } catch (err) {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350); // debounce ms
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const navItems = [
    { label: 'Home', to: '/home' },
    { label: 'Equipments', to: '/equipments' },
    { label: 'Collection',  to: '/collection' },  
    { label: 'Support', to: '/support' },
    { label: 'About', to: '/about' },
    { label: 'Verification', to: '/verification' },
  ];


  useEffect(() => {
    function handleClickOutside(event) {
      if (collectionsRef.current && !collectionsRef.current.contains(event.target)) {
        setCollectionsOpen(false);
      }
    }
    if (collectionsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [collectionsOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <a href="/home" className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-white">
                <img src={logo} alt="RentIt Logo" className="w-12 h-12 object-contain" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">Rentit Cameras</span>
                <div className="text-xs text-[#1A97A9] font-medium">Camera Rental</div>
              </div>
            </a>
          </div>
        
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) =>
              item.isDropdown ? (
                <div key={item.label} className="relative" ref={collectionsRef}
                  onMouseEnter={() => setCollectionsOpen(true)}
                  onMouseLeave={() => setCollectionsOpen(false)}
                >
                  <button
                    type="button"
                    className="text-gray-700 hover:text-[#1A97A9] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-[#E0F7FA] focus:outline-none"
                    onClick={() => setCollectionsOpen((open) => !open)}
                  >
                    {item.label}
                  </button>
                  {collectionsOpen && (
                    <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-4 z-50 grid grid-cols-2 gap-2">
                      {/* Visual grid of collection types */}
                      <Link
                        to="/collections"
                        className="flex flex-col items-center px-4 py-3 hover:bg-[#E0F7FA] rounded-lg transition cursor-pointer"
                        onClick={() => setCollectionsOpen(false)}
                      >
                        <img src="/images/all-collections.png" alt="All" className="w-10 h-10 mb-1" />
                        <span className="text-sm text-gray-700 font-medium">All Collections</span>
                      </Link>
                      <Link
                        to="/collections?category=camera"
                        className="flex flex-col items-center px-4 py-3 hover:bg-[#E0F7FA] rounded-lg transition cursor-pointer"
                        onClick={() => setCollectionsOpen(false)}
                      >
                        <img src="/images/dslr.png" alt="Camera" className="w-10 h-10 mb-1" />
                        <span className="text-sm text-gray-700 font-medium">Cameras</span>
                      </Link>
                      <Link
                        to="/collections?category=lens"
                        className="flex flex-col items-center px-4 py-3 hover:bg-[#E0F7FA] rounded-lg transition cursor-pointer"
                        onClick={() => setCollectionsOpen(false)}
                      >
                        <img src="/images/lens.png" alt="Lens" className="w-10 h-10 mb-1" />
                        <span className="text-sm text-gray-700 font-medium">Lenses</span>
                      </Link>
                      <Link
                        to="/collections?category=lighting"
                        className="flex flex-col items-center px-4 py-3 hover:bg-[#E0F7FA] rounded-lg transition cursor-pointer"
                        onClick={() => setCollectionsOpen(false)}
                      >
                        <img src="/images/lighting.png" alt="Lighting" className="w-10 h-10 mb-1" />
                        <span className="text-sm text-gray-700 font-medium">Lighting</span>
                      </Link>
                      <Link
                        to="/collections?category=drone"
                        className="flex flex-col items-center px-4 py-3 hover:bg-[#E0F7FA] rounded-lg transition cursor-pointer"
                        onClick={() => setCollectionsOpen(false)}
                      >
                        <img src="/images/dji-drone.png" alt="Drone" className="w-10 h-10 mb-1" />
                        <span className="text-sm text-gray-700 font-medium">Drones</span>
                      </Link>
                    </div>
                  )}
                </div>
              ) : item.to ? (
                <Link
                  key={item.label}
                  to={item.to}
                  className="text-gray-700 hover:text-[#1A97A9] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-[#E0F7FA]"
                >
                  {item.label}
                </Link>
              ) : null
            )}
          </nav>
  {/* searchbar */}
          <div className="flex-1 max-w-md mx-4 md:mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[#1A97A9]" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                placeholder="Search cameras, lenses, equipment..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A97A9] focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-200 hover:bg-white"
              />
              {/* Suggestions Dropdown */}
              {showSuggestions && !searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="px-4 py-2 text-xs text-gray-400">Suggestions</div>
                  <div className="divide-y divide-gray-100">
                    {suggestions.map((suggestion, idx) => (
  <div
    key={idx}
    className="px-4 py-2 cursor-pointer hover:bg-[#E0F7FA] text-sm text-gray-700"
    onClick={() => {
      setShowSuggestions(false);
      if (suggestion.redirect) {
        window.location.href = suggestion.redirect;
      } else {
        setSearchQuery(suggestion.label);
      }
    }}
  >
    {suggestion.label}
  </div>
))}
                  </div>
                </div>
              )}
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg backdrop-blur-md z-50 max-h-80 overflow-y-auto">
                  {isSearching ? (
                    <div className="px-4 py-3 text-gray-500 text-sm">Searching...</div>
                  ) : searchResults.length > 0 ? (
                    searchResults.slice(0, 8).map((product, index) => (
                      <div img
                        key={product._id || index}
                        className="px-4 py-3 hover:bg-[#E0F7FA] cursor-pointer text-sm text-gray-700 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                          setSearchQuery('');
                          window.location.href = `/equipments?category=${product.category}`;
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          {product.image && (
                            <img src={product.image} alt={product.name} className="w-8 h-8 object-cover rounded shadow border border-gray-200" />
                          )}
                          <span>{product.name}</span>
                          {product.brand && (
                            <span className="ml-2 text-xs text-gray-400">{product.brand}</span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500 text-sm">No products found.</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4 mr-4">
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg bg-white border border-[#1A97A9] text-[#1A97A9] font-semibold hover:bg-[#E0F7FA] transition"
            >
              Login
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            
            <button onClick={() => (window.open('tel:+919940423791', '_blank'))} className="p-2 text-gray-400 hover:text-[#1A97A9] hover:bg-[#E0F7FA] rounded-lg transition-colors duration-200">
              <Phone className="h-5 w-5" />
            </button>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-[#1A97A9] hover:bg-[#E0F7FA] rounded-lg transition-colors duration-200"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {navItems.map((item) =>
                item.isDropdown ? (
                  <div key={item.label}>
                    <button
                      type="button"
                      className="w-full text-left text-gray-700 hover:text-[#1A97A9] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-[#E0F7FA]"
                      onClick={() => setMobileCollectionsOpen(!mobileCollectionsOpen)}
                    >
                      {item.label}
                    </button>
                    {mobileCollectionsOpen && (
                      <div className="pl-4 space-y-1">
                        <Link
                          to="/collections"
                          className="block px-3 py-2 text-sm text-gray-600 hover:bg-[#E0F7FA] hover:text-[#1A97A9]"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          All Collections
                        </Link>
                        <Link
                          to="/collections?category=camera"
                          className="block px-3 py-2 text-sm text-gray-600 hover:bg-[#E0F7FA] hover:text-[#1A97A9]"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Cameras
                        </Link>
                        <Link
                          to="/collections?category=lens"
                          className="block px-3 py-2 text-sm text-gray-600 hover:bg-[#E0F7FA] hover:text-[#1A97A9]"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Lenses
                        </Link>
                        <Link
                          to="/collections?category=lighting"
                          className="block px-3 py-2 text-sm text-gray-600 hover:bg-[#E0F7FA] hover:text-[#1A97A9]"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Lighting
                        </Link>
                        <Link
                          to="/collections?category=drone"
                          className="block px-3 py-2 text-sm text-gray-600 hover:bg-[#E0F7FA] hover:text-[#1A97A9]"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Drones
                        </Link>
                      </div>
                    )}
                  </div>
                ) : item.to ? (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="block text-gray-700 hover:text-[#1A97A9] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-[#E0F7FA]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : null
              )}
              <div className="pt-4 border-t border-gray-200">
                <Link
                  to="/login"
                  className="block px-3 py-2 text-sm font-medium text-[#1A97A9] hover:bg-[#E0F7FA] rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

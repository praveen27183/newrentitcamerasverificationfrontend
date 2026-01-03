import React, { useState, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchBar = ({
  searchQuery,
  onSearchChange,
  onClearSearch,
  placeholder = 'Search cameras, lenses, and more...',
  className = ''
}) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [isFocused, setIsFocused] = useState(false);

  // Update local state when searchQuery prop changes
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchChange(localQuery);
  };

  const handleClear = () => {
    setLocalQuery('');
    onClearSearch();
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`relative ${className}`}
    >
      <div className={`relative flex items-center ${isFocused ? 'ring-2 ring-[#1A97A9]' : ''} bg-white rounded-full shadow-sm border border-gray-300 overflow-hidden`}>
        <div className="absolute left-3 text-gray-400">
          <FaSearch />
        </div>
        
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full py-3 pl-10 pr-10 text-sm text-gray-700 placeholder-gray-400 bg-transparent border-0 focus:ring-0 focus:outline-none"
        />
        
        {localQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <FaTimes />
          </button>
        )}
        
        <button
          type="submit"
          className="absolute right-0 h-full px-4 text-white bg-[#1A97A9] hover:bg-[#167a8a] transition-colors"
          aria-label="Search"
        >
          <FaSearch className="w-4 h-4" />
        </button>
      </div>
      
      {/* Popular searches */}
      {isFocused && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="p-3 border-b border-gray-100">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Popular Searches</h4>
          </div>
          <div className="p-2">
            {['Sony A7 IV', 'Canon R5', 'DJI Mavic 3', 'Sony 24-70mm', 'GoPro Hero 11'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setLocalQuery(item);
                  onSearchChange(item);
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
};

export default SearchBar;

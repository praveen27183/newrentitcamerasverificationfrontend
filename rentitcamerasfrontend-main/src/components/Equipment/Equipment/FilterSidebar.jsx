import React, { useState, useEffect, useCallback } from "react";
import { FaFilter, FaTimes, FaCheck, FaSearch } from "react-icons/fa";
import { Range } from "react-range";

// Debounce helper
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const FilterSidebar = ({
  isOpen,
  onClose,
  categories = [],
  selectedCategory = "All",
  onCategoryChange,
  priceRange = [0, 10000],
  onPriceRangeChange,
  brands = [],
  selectedBrand = "All",
  onBrandChange,
  isMobile = false,
  onApplyFilters,
  onResetFilters,
}) => {
  const STEP = 100;
  const MIN = 0;
  const MAX = 10000;

  const [localPriceRange, setLocalPriceRange] = useState([
    Math.min(priceRange[0], MAX),
    Math.min(priceRange[1], MAX),
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    category: selectedCategory,
    brand: selectedBrand,
  });

  useEffect(() => {
    if (isOpen) {
      setLocalPriceRange([
        Math.min(priceRange[0], MAX),
        Math.min(priceRange[1], MAX),
      ]);
      setActiveFilters({
        category: selectedCategory,
        brand: selectedBrand,
      });
    }
  }, [isOpen, priceRange, selectedCategory, selectedBrand]);

  const filterItems = (items, query) => {
    if (!query) return items;
    const q = query.toLowerCase().trim();
    return items.filter((item) => item && item.toString().toLowerCase().includes(q));
  };

  const debouncedPriceUpdate = useCallback(
    debounce((range) => {
      onPriceRangeChange([...range]);
    }, 300),
    [onPriceRangeChange]
  );

  const handleMinMaxInputChange = (e, index) => {
    const value = e.target.value === "" ? 0 : Math.max(0, Number(e.target.value));
    const newRange = [...localPriceRange];
    newRange[index] = value;

    if (index === 0 && newRange[0] >= newRange[1]) {
      newRange[0] = newRange[1] - STEP;
    } else if (index === 1 && newRange[1] <= newRange[0]) {
      newRange[1] = newRange[0] + STEP;
    }

    setLocalPriceRange(newRange);
    if (isMobile) debouncedPriceUpdate(newRange);
  };

  const handleRangeChange = (values) => {
    setLocalPriceRange(values);
    if (isMobile) debouncedPriceUpdate(values);
  };

  const handlePriceBracketSelect = (min, max) => {
    const newRange = [min, max];
    setLocalPriceRange(newRange);
    if (isMobile) onPriceRangeChange([...newRange]);
  };

  const handleFilterChange = (type, value) => {
    setActiveFilters((prev) => ({ ...prev, [type]: value }));
  };

  const handleCategorySelect = (category) => {
    onCategoryChange(category);
  };

  const handleApplyFilters = () => {
    onPriceRangeChange([...localPriceRange]);
    onApplyFilters?.({
      category: activeFilters.category || "All",
      brand: activeFilters.brand || "All",
      priceRange: [...localPriceRange],
    });
  };

  const handleResetFilters = () => {
    setLocalPriceRange([0, 10000]);
    setActiveFilters({ category: "All", brand: "All" });
    onResetFilters?.();
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const FilterSection = React.memo(({ title, children, isOpen: isOpenProp = true }) => {
    const [sectionOpen, setSectionOpen] = useState(isOpenProp);
    return (
      <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
        <button
          className="w-full flex justify-between items-center py-3 px-1 text-left hover:bg-gray-50 rounded-lg"
          onClick={() => setSectionOpen(!sectionOpen)}
        >
          <span className="text-sm font-semibold text-gray-800">{title}</span>
          <svg
            className={`w-4 h-4 text-gray-500 transform transition-transform ${
              sectionOpen ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {sectionOpen && <div className="mt-2 pl-1 space-y-2">{children}</div>}
      </div>
    );
  });

  const FilterOption = React.memo(({ label, isSelected, onChange }) => (
    <label className="flex items-center space-x-3 py-2 px-2 rounded-lg hover:bg-gray-50 cursor-pointer">
      <div
        className={`flex-shrink-0 flex items-center justify-center w-4 h-4 border-2 rounded-sm 
          ${isSelected ? "bg-[#1A97A9] border-[#1A97A9]" : "border-gray-300"} transition-colors`}
      >
        {isSelected && <FaCheck className="w-2.5 h-2.5 text-white" />}
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input type="checkbox" className="sr-only" checked={isSelected} onChange={onChange} />
    </label>
  ));

  const appliedFiltersCount = [
    activeFilters.category !== "All",
    activeFilters.brand !== "All",
    JSON.stringify(localPriceRange) !== JSON.stringify([0, 10000]),
  ].filter(Boolean).length;

  return (
    <div
      className={`fixed ${isMobile ? "inset-x-0 bottom-0 h-[85vh]" : "inset-0"} z-40 transform ${
        isOpen ? "translate-y-0" : "translate-y-full"
      } md:sticky md:top-24 md:translate-y-0 transition-transform duration-300 ease-in-out 
        w-full md:w-72 lg:w-80 bg-white rounded-t-2xl md:rounded-lg 
        shadow-xl border border-gray-200 flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
        <div className="flex items-center">
          <FaFilter className="text-[#1A97A9] mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
          {appliedFiltersCount > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-[#1A97A9] text-white rounded-full">
              {appliedFiltersCount}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleResetFilters}
            className="text-sm font-medium text-[#1A97A9] hover:bg-blue-50 px-3 py-1 rounded-md"
          >
            Reset All
          </button>
          {isMobile && (
            <button onClick={onClose} className="text-gray-500 hover:bg-gray-100 p-1 rounded-full">
              <FaTimes className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-[#1A97A9]"
            placeholder="Search filters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category */}
        <FilterSection title="Category">
          <div className="px-2 space-y-2">
            <FilterOption
              key="all"
              label="All Categories"
              isSelected={selectedCategory === "All"}
              onChange={() => handleCategorySelect("All")}
            />

            {categories
              .filter((cat) => cat.name !== "All")
              .map((category) => (
                <FilterOption
                  key={category.id}
                  label={category.name}
                  isSelected={selectedCategory === category.name}
                  onChange={() => handleCategorySelect(category.name)}
                />
              ))}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range">
          <div className="px-2 space-y-4">
            {/* Brackets */}
            <div className="flex flex-wrap gap-2">
              {[
                { min: 100, max: 500, label: "₹100 - ₹500" },
                { min: 500, max: 1000, label: "₹500 - ₹1,000" },
                { min: 1000, max: 2000, label: "₹1,000 - ₹2,000" },
                { min: 2000, max: 5000, label: "₹2,000 - ₹5,000" },
                { min: 5000, max: 10000, label: "₹5,000 - ₹10,000" },
              ].map(({ min, max, label }) => {
                const isActive = localPriceRange[0] === min && localPriceRange[1] === max;
                return (
                  <button
                    key={label}
                    onClick={() => handlePriceBracketSelect(min, max)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 ${
                      isActive
                        ? "bg-[#1A97A9] text-white border-[#1A97A9] shadow-sm"
                        : "border-gray-200 text-gray-700 hover:border-[#1A97A9] hover:bg-blue-50"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Custom Range */}
            <div className="pt-4">
              <Range
                step={STEP}
                min={MIN}
                max={MAX}
                values={localPriceRange}
                onChange={handleRangeChange}
                renderTrack={({ props, children }) => (
                  <div {...props} className="h-2 w-full bg-gray-200 rounded-full relative">
                    <div
                      className="h-2 bg-[#1A97A9] rounded-full absolute transition-all duration-300"
                      style={{
                        left: `${(localPriceRange[0] / MAX) * 100}%`,
                        right: `${100 - (localPriceRange[1] / MAX) * 100}%`,
                      }}
                    />
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    className="h-5 w-5 bg-white rounded-full border-2 border-[#1A97A9] shadow-md flex items-center justify-center cursor-pointer"
                  >
                    <div className="h-2 w-2 bg-[#1A97A9] rounded-full" />
                  </div>
                )}
              />
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>{formatPrice(localPriceRange[0])}</span>
                <span>{formatPrice(localPriceRange[1])}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <input
                  type="number"
                  value={localPriceRange[0]}
                  onChange={(e) => handleMinMaxInputChange(e, 0)}
                  className="w-full pl-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1A97A9]"
                  placeholder="Min ₹"
                />
                <input
                  type="number"
                  value={localPriceRange[1]}
                  onChange={(e) => handleMinMaxInputChange(e, 1)}
                  className="w-full pl-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1A97A9]"
                  placeholder="Max ₹"
                />
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Brands */}
        <FilterSection title="Brands">
          {filterItems(brands, searchQuery).length === 0 ? (
            <p className="text-xs text-gray-400 italic px-2">No brands found</p>
          ) : (
            filterItems(brands, searchQuery).map((brand) => (
              <FilterOption
                key={brand}
                label={brand}
                isSelected={activeFilters.brand === brand}
                onChange={() => handleFilterChange("brand", brand)}
              />
            ))
          )}
        </FilterSection>
      </div>

      {/* Footer */}
      <div className={`${isMobile ? "fixed inset-x-0 bottom-0" : "sticky"} p-4 bg-white border-t`}>
        <button
          onClick={handleApplyFilters}
          className="w-full py-3 bg-[#1A97A9] text-white rounded-md font-medium hover:bg-[#167a8a] shadow-md"
        >
          {isMobile ? "Apply Filters" : "Update Results"}
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;

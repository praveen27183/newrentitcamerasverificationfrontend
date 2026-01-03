import React, { useState, useEffect, useMemo, useCallback, useReducer } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaFilter, FaSort, FaSearch, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdOutlineSort } from 'react-icons/md';
import { debounce } from 'lodash';
import { fetchProducts, createOrder } from '../../services/productAPI';
import ProductCard from './Equipment/ProductCard';
import FilterSidebar from './Equipment/FilterSidebar';
import RentModal from './Equipment/RentModal';
import SearchBar from './Equipment/SearchBar';

// Action types for useReducer
const ACTIONS = {
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_FILTER: 'SET_FILTER',
  SET_PRICE_RANGE: 'SET_PRICE_RANGE',
  SET_SORT: 'SET_SORT',
  TOGGLE_FILTERS: 'TOGGLE_FILTERS',
  SET_STICKY_HEADER: 'SET_STICKY_HEADER',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  RESET_FILTERS: 'RESET_FILTERS',

  SET_BRANDS: 'SET_BRANDS'
};

// Category and Subcategory Mappings
const categoryMap = {
  All: { id: 'all', subcategories: [] },
  Cameras: { 
    id: 'cameras',
    subcategories: [
      { name: 'All Cameras', id: 'all-cameras' },
      { name: 'DSLR Cameras', id: 'dslr' },
      { name: 'Mirrorless Cameras', id: 'mirrorless' },
      { name: 'Cinema Cameras', id: 'cinema' },
      { name: 'Action Cameras', id: 'action' },
      { name: 'Point & Shoot', id: 'pointshoot' }
    ]
  },
  Lens: { id: 'lens', subcategories: [] },
  Tripod: { id: 'tripod', subcategories: [] },
  Mic: { id: 'mic', subcategories: [] },
  Drone: { id: 'drone', subcategories: [] },
  Gimbal: { id: 'gimbal', subcategories: [] },
  Flash: { id: 'flash', subcategories: [] },
  Light: { id: 'light', subcategories: [] },
  Accessories: { id: 'accessories', subcategories: [] },
};



// Initial state with all filters
const initialState = {
  products: [],
  loading: true,
  error: null,
  filters: {
    category: 'All',
    subCategory: 'All',
    brand: 'All',
    location: 'All',
    availability: 'available',
    priceRange: [0, 50000],
  },
  sortOption: 'default',
  searchQuery: '',
  showFilters: false,
  isSticky: false,
  brands: ['All'],
  locations: ['All', 'KK Nagar', 'Anna Nagar']
};

// Reducer function
function equipmentReducer(state, action) {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { 
        ...state, 
        products: action.payload, 
        loading: false,
        // Extract unique brands from products
        brands: ['All', ...new Set(action.payload.map(p => p.brand).filter(Boolean))].sort()
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_FILTER':
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.filter]: action.payload.value
        }
      };
    case 'SET_PRICE_RANGE':
      return {
        ...state,
        filters: {
          ...state.filters,
          priceRange: action.payload
        }
      };
    case 'SET_SORT':
      return { ...state, sortOption: action.payload };
    case 'TOGGLE_FILTERS':
      return { ...state, showFilters: !state.showFilters };
    case 'SET_STICKY_HEADER':
      return { ...state, isSticky: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'RESET_FILTERS':
      return {
        ...state,
        filters: {
          ...state.filters,
          category: 'All',
          subCategory: 'All',
          brand: 'All',
          condition: 'All',
          location: 'All',
          availability: 'available',
          priceRange: [0, 50000]
        },
        sortOption: 'default',
        searchQuery: ''
      };
    default:
      return state;
  }
}

const EquipmentPageRefactored = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(equipmentReducer, initialState);
  const [showRentModal, setShowRentModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rentalDays, setRentalDays] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Extract rentalDays from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const days = parseInt(params.get('rentalDays') || '1', 10);
    setRentalDays(days > 0 ? days : 1);
  }, [location.search]);

  // Handle URL params for category/type
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    const category = params.get('category');
    
    if (type) {
      dispatch({ type: ACTIONS.SET_FILTER, payload: { filter: 'category', value: 'Cameras' } });
      const subCategory = Object.entries(categoryMap.Cameras.subcategories).find(([_, value]) => value.id === type.toLowerCase());
      if (subCategory) {
        dispatch({ type: ACTIONS.SET_FILTER, payload: { filter: 'subCategory', value: subCategory[1].name } });
      }
    } else if (category) {
      const categoryKey = Object.keys(categoryMap).find(
        key => key.toLowerCase() === category.toLowerCase()
      );
      if (categoryKey) {
        dispatch({ type: ACTIONS.SET_FILTER, payload: { filter: 'category', value: categoryKey } });
      }
    }
  }, [location.search]);

  // Handle sticky filter
  useEffect(() => {
    const handleScroll = debounce(() => {
      dispatch({ type: 'SET_STICKY', payload: window.scrollY > 200 });
    }, 100);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      handleScroll.cancel();
    };
  }, []);

  // Fetch products
  useEffect(() => {
    const loadProducts = async () => {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      try {
        const data = await fetchProducts();
        dispatch({ type: ACTIONS.SET_PRODUCTS, payload: data });
        
        // Extract unique locations
        const uniqueLocations = Array.from(
          new Set(data.map(p => p.location).filter(Boolean))
        );
        dispatch({ type: ACTIONS.SET_LOCATIONS, payload: ['All', ...uniqueLocations] });
        
      } catch (error) {
        console.error('Error fetching products:', error);
        dispatch({ 
          type: ACTIONS.SET_ERROR, 
          payload: 'Failed to load products. Please try again later.' 
        });
      }
    };

    loadProducts();
  }, []);

  // Extract unique brands from products
  const { uniqueBrands } = useMemo(() => {
      const brands = new Set();
      
      if (state.products && state.products.length > 0) {
        state.products.forEach(product => {
          if (product.brand) brands.add(product.brand);
        });
      }
      
      return {
        uniqueBrands: ['All', ...Array.from(brands)].filter(Boolean).sort()
      };
  }, [state.products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!state.products || state.products.length === 0) return [];
    
    return state.products.filter(product => {
      const searchLower = state.searchQuery.toLowerCase();
      
      // Enhanced search across multiple fields
      const matchesSearch = !state.searchQuery || 
        (product.name && product.name.toLowerCase().includes(searchLower)) ||
        (product.category && product.category.toLowerCase().includes(searchLower)) ||
        (product.brand && product.brand.toLowerCase().includes(searchLower)) ||
        (product.model && product.model.toLowerCase().includes(searchLower)) ||
        (product.description && product.description.toLowerCase().includes(searchLower)) ||
        (product.tags && Array.isArray(product.tags) && 
          product.tags.some(tag => tag.toLowerCase().includes(searchLower)));
      
      if (!matchesSearch) return false;
      
      // Category filter
      const backendCategory = categoryMap[state.filters.category];
      const matchesCategory = state.filters.category === 'All' || 
        (product.category && product.category.toLowerCase() === (backendCategory ? backendCategory.id : '').toLowerCase());
      
      // Subcategory filter (only for cameras)
      let matchesSubCategory = true;
      if (state.filters.category === 'Cameras' && state.filters.subCategory !== 'All') {
        const subCategory = categoryMap[state.filters.category].subcategories.find(sub => sub.name === state.filters.subCategory);
        matchesSubCategory = product.subCategory && 
          product.subCategory.toLowerCase() === (subCategory ? subCategory.id : '').toLowerCase();
      }
      
      // Brand filter
      const matchesBrand = state.filters.brand === 'All' || 
        (product.brand && product.brand === state.filters.brand);
      
      // Location filter - match KK Nagar or Anna Nagar
      const matchesLocation = state.filters.location === 'All' || 
        (product.location && 
         (product.location.toLowerCase() === state.filters.location.toLowerCase() ||
          (state.filters.location === 'KK Nagar' && product.location.toLowerCase().includes('kk nagar')) ||
          (state.filters.location === 'Anna Nagar' && product.location.toLowerCase().includes('anna nagar'))
         ));
      
      // Availability filter
      const matchesAvailability = state.filters.availability === 'all' || 
        (state.filters.availability === 'available' && product.isAvailable !== false) ||
        (state.filters.availability === 'rented' && product.isAvailable === false);
      
      // Price range filter
      const price = Number(product.price) || 0;
      const matchesPrice = price >= state.filters.priceRange[0] && 
                         price <= state.filters.priceRange[1];
      
      return matchesCategory && matchesSubCategory && matchesBrand && 
             matchesLocation && matchesAvailability && matchesPrice;
    }).sort((a, b) => {
      // Sorting logic
      switch (state.sortOption) {
        case 'price-asc':
          return (a.price || 0) - (b.price || 0);
        case 'price-desc':
          return (b.price || 0) - (a.price || 0);
        case 'name-asc':
          return (a.name || '').localeCompare(b.name || '');
        case 'name-desc':
          return (b.name || '').localeCompare(a.name || '');
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return 0;
      }
    });
  }, [state.products, state.searchQuery, state.filters, state.sortOption]);

  // Handle rental submission
  const handleRentSubmit = async (rentalData) => {
    try {
      await createOrder(rentalData);
      setShowRentModal(false);
      // Show success message or redirect
      alert('Booking successful! We will contact you shortly.');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create booking. Please try again.');
    }
  };

  // Get random location for product cards
  const getRandomLocation = useCallback(() => {
    const defaultLocations = ['KK Nagar', 'Anna Nagar'];
    return state.locations.length > 1
      ? state.locations.find(loc => loc !== 'All') || defaultLocations[0]
      : defaultLocations[0];
  }, [state.locations]);

  // Handle search
  const handleSearch = (query) => {
    dispatch({ type: ACTIONS.SET_SEARCH, payload: query });
  };

  // Handle filter changes
  const handleFilterChange = (filter, value) => {
    // Special handling for category changes to reset subcategory
    if (filter === 'category' && value !== 'Cameras') {
      dispatch({ type: ACTIONS.SET_FILTER, payload: { filter: 'subCategory', value: 'All' } });
    }
    dispatch({ type: ACTIONS.SET_FILTER, payload: { filter, value } });
  };
  
  // Apply all filters at once (for the enhanced FilterSidebar)
  const handleApplyFilters = (filters) => {
    Object.entries(filters).forEach(([filter, value]) => {
      if (value !== undefined) {
        handleFilterChange(filter, value);
      }
    });
    // Close mobile filters after applying
    if (state.showFilters) {
      dispatch({ type: 'TOGGLE_FILTERS' });
    }
  };
  
  // Reset all filters
  const handleResetFilters = () => {
    dispatch({ type: ACTIONS.RESET_FILTERS });
  };

  // Reset all filters
  const resetFilters = () => {
    dispatch({ type: ACTIONS.RESET_FILTERS });
  };

  // Toggle filters (mobile)
  const toggleFilters = () => {
    dispatch({ type: 'TOGGLE_FILTERS' });
  };

  // Handle product selection for rent
  const handleRentClick = (product) => {
    setSelectedProduct(product);
    setShowRentModal(true);
  };

  // Render loading state
  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1A97A9]"></div>
      </div>
    );
  }

  // Render error state
  if (state.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Products</h2>
          <p className="text-gray-600 mb-4">{state.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#1A97A9] text-white rounded hover:bg-[#167a8a] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="relative flex flex-col items-center justify-center text-center py-16 px-4 bg-gradient-to-b from-[#1A97A9] to-[#153c43] text-white shadow-lg">
        <h1 className="text-5xl md:text-6xl font-extrabold drop-shadow-lg mb-4">
          Camera & <span className="text-[#1A97A9]">Equipment</span> Rental
        </h1>
        <p className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto mb-6">
          Rent professional photography and videography equipment for your next project
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Search and Filter Bar */}
        <div className={`bg-white rounded-lg shadow-sm p-4 mb-6 ${state.isSticky ? 'sticky top-0 z-10' : ''}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <SearchBar
                searchQuery={state.searchQuery}
                onSearchChange={handleSearch}
                onClearSearch={() => handleSearch('')}
                placeholder="Search cameras, lenses, and more..."
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleFilters}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A97A9] sm:hidden"
              >
                <FaFilter className="mr-2" />
                Filters
              </button>
              
              <div className="relative">
                <select
                  value={state.sortOption}
                  onChange={(e) => dispatch({ type: ACTIONS.SET_SORT, payload: e.target.value })}
                  className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A97A9] w-full sm:w-auto"
                >
                  <option value="default">Sort by</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="newest">Newest First</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <MdOutlineSort />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar - Always visible on desktop, off-canvas on mobile */}
          <div className={`${state.showFilters ? 'fixed inset-0 z-40' : 'hidden'} md:block md:relative md:z-0`}>
            <FilterSidebar
              isOpen={state.showFilters}
              onClose={toggleFilters}
              categories={Object.entries(categoryMap).map(([name, data]) => ({
                id: data.id,
                name,
                subcategories: data.subcategories
              }))}
              selectedCategory={state.filters.category}
              selectedSubcategory={state.filters.subCategory}
              onCategoryChange={(value) => handleFilterChange('category', value)}
              onSubcategoryChange={(value) => handleFilterChange('subCategory', value)}
              priceRange={state.filters.priceRange}
              onPriceRangeChange={(range) => 
                dispatch({ type: ACTIONS.SET_PRICE_RANGE, payload: range })
              }
              locations={['All', ...state.locations.filter(loc => loc !== 'All')]}
              selectedLocation={state.filters.location}
              onLocationChange={(value) => handleFilterChange('location', value)}
              brands={uniqueBrands}
              selectedBrand={state.filters.brand || 'All'}
              onBrandChange={(value) => handleFilterChange('brand', value)}
              availability={state.filters.availability}
              onAvailabilityChange={(value) => handleFilterChange('availability', value)}
              isMobile={window.innerWidth < 768}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
            />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Active Filters */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {(state.filters.category !== 'All' || 
                state.filters.subCategory !== 'All' || 
                state.filters.brand !== 'All' ||
                state.filters.location !== 'All' ||
                state.filters.availability !== 'available' ||
                state.searchQuery) && (
                <button
                  onClick={resetFilters}
                  className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 flex items-center"
                >
                  Clear all filters
                  <FaTimes className="ml-1" />
                </button>
              )}
              
              {state.filters.category !== 'All' && (
                <span className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full flex items-center">
                  {state.filters.category}
                  <button 
                    onClick={() => handleFilterChange('category', 'All')}
                    className="ml-1 text-blue-400 hover:text-blue-600"
                  >
                    <FaTimes size={10} />
                  </button>
                </span>
              )}
              
              {state.filters.subCategory !== 'All' && state.filters.category === 'Cameras' && (
                <span className="text-xs px-3 py-1 bg-green-50 text-green-700 rounded-full flex items-center">
                  {state.filters.subCategory}
                  <button 
                    onClick={() => handleFilterChange('subCategory', 'All')}
                    className="ml-1 text-green-400 hover:text-green-600"
                  >
                    <FaTimes size={10} />
                  </button>
                </span>
              )}
              
              {state.filters.brand !== 'All' && (
                <span className="text-xs px-3 py-1 bg-purple-50 text-purple-700 rounded-full flex items-center">
                  {state.filters.brand}
                  <button 
                    onClick={() => handleFilterChange('brand', 'All')}
                    className="ml-1 text-purple-400 hover:text-purple-600"
                  >
                    <FaTimes size={10} />
                  </button>
                </span>
              )}
              
              {state.searchQuery && (
                <span className="text-xs px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full flex items-center">
                  Search: {state.searchQuery}
                  <button 
                    onClick={() => handleSearch('')}
                    className="ml-1 text-yellow-400 hover:text-yellow-600"
                  >
                    <FaTimes size={10} />
                  </button>
                </span>
              )}
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    rentalDays={rentalDays}
                    onRentClick={handleRentClick}
                    getRandomLocation={getRandomLocation}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-[#1A97A9] text-white rounded-lg hover:bg-[#167a8a] transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Rent Modal */}
      {showRentModal && selectedProduct && (
        <RentModal
          isOpen={showRentModal}
          onClose={() => setShowRentModal(false)}
          product={selectedProduct}
          rentalDays={rentalDays}
          onRentConfirm={handleRentSubmit}
        />
      )}
    </div>
  );
};

export default EquipmentPageRefactored;

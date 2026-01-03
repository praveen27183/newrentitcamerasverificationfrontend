import React, { useState, useEffect } from 'react';
import { Search, Grid3X3, List as ListIcon, Package, IndianRupee, Tag } from 'lucide-react';
import axios from 'axios';

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest'); 

  const [categories] = useState([
    { id: 'cameras', name: 'Cameras' },
    { id: 'lenses', name: 'Lenses' },
    { id: 'tripod', name: 'Tripod' },
    { id: 'gimbal', name: 'Gimbal' },
    { id: 'light', name: 'Light' },
    { id: 'lighting', name: 'Flash' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'mic', name: 'Mic' },
    { id: 'manpower', name: 'Manpower' },
    { id: 'drone', name: 'Drone' }
  ]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([
        {
          _id: '1',
          name: 'Sample Camera',
          description: 'High-quality camera for professional photography',
          price: 999.99,
          category: 'cameras',
          brand: 'Sample Brand',
          imageUrl: 'https://via.placeholder.com/300',
          stock: 5,
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getSortedProducts = (products) => {
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'oldest':
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'stock-low':
          return (a.stock || 0) - (b.stock || 0);
        case 'stock-high':
          return (b.stock || 0) - (a.stock || 0);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  };

  const filteredProducts = getSortedProducts(
    products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.brand?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    )
  );

  const stats = [
    { 
      title: 'Available', 
      value: products.filter(p => p.stock > 0).length,
      icon: <Package className="h-5 w-5 text-white" />,
      bg: 'bg-gradient-to-r from-[#1A97A9] to-[#1A97A9]/90'
    },
    { 
      title: 'Low Stock', 
      value: products.filter(p => p.stock > 0 && p.stock < 5).length,
      icon: <Tag className="h-5 w-5 text-white" />,
      bg: 'bg-gradient-to-r from-[#1A97A9] to-[#1A97A9]/90'
    },
    { 
      title: 'Total Value', 
      value: `₹${products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0).toLocaleString()}`,
      icon: <IndianRupee className="h-5 w-5 text-white" />,
      bg: 'bg-gradient-to-r from-[#1A97A9] to-[#1A97A9]/90'
    }
  ];

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Product Catalog</h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Browse all available products
          </p>
        </div>
      </div>

     

      {/* Search, Sort and View Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-9 sm:pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#1A97A9] focus:border-[#1A97A9] transition-colors"
          />
        </div>
        
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-full pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#1A97A9] focus:border-[#1A97A9] appearance-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="stock-low">Stock: Low to High</option>
              <option value="stock-high">Stock: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-1 sm:space-x-2 bg-gray-100 p-1 rounded-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 sm:p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#1A97A9]' : 'text-gray-500 hover:text-gray-700'}`}
              aria-label="Grid view"
            >
              <Grid3X3 className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 sm:p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm text-[#1A97A9]' : 'text-gray-500 hover:text-gray-700'}`}
              aria-label="List view"
            >
              <ListIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Products Display */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1A97A9]"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-100">
          <Package className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-gray-400" />
          <h3 className="mt-3 text-sm sm:text-base font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search' : 'No products available right now'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filteredProducts.map(product => (
            <div key={product._id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="relative pt-[100%] bg-gray-50">
                <img
                  src={product.imageUrl || 'https://via.placeholder.com/300'}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-contain p-3"
                  loading="lazy"
                />
                <div className="absolute top-1.5 right-1.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    product.stock > 5 ? 'bg-green-100 text-green-800' : 
                    product.stock > 0 ? 'bg-amber-100 text-amber-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {product.stock > 5 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
                <p className="mt-0.5 text-xs text-gray-500 truncate">{categories.find(c => c.id === product.category)?.name || product.category}</p>
                <p className="text-xs text-gray-500 truncate">{product.brand}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#1A97A9]">₹{product.price}</span>
                  <span className="text-xs text-gray-500">{product.stock} in stock</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md overflow-hidden">
                          <img className="h-full w-full object-contain p-1" src={product.imageUrl || 'https://via.placeholder.com/40'} alt={product.name} />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500 sm:hidden">
                            {product.brand} • {categories.find(c => c.id === product.category)?.name || product.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      {categories.find(c => c.id === product.category)?.name || product.category}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[#1A97A9]">
                      ₹{product.price}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.stock > 5 ? 'bg-green-100 text-green-800' : 
                        product.stock > 0 ? 'bg-amber-100 text-amber-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.stock} in stock
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProducts;

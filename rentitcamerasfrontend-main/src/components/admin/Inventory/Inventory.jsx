import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Grid3X3, List as ListIcon, X, Package, IndianRupee, DollarSign, Tag } from 'lucide-react';
import axios from 'axios';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    imageUrl: '',
    stock: ''
  });

  const [categories] = useState([
    { id: 'cameras', name: 'Cameras' },
    { id: 'lenses', name: 'Lenses' },
    { id: 'tripod', name: 'Tripod' },
    { id: 'gimbal', name: 'Gimbal' },
    { id: 'light', name: 'Light' },
    { id: 'lighting', name: 'flash' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'mic', name: 'Mic' },
    { id: 'manpower', name: 'Manpower' },
    { id: 'Drone', name: 'Drone' }
  ]);

  const [brands] = useState({
    // Camera brands
    cameras: [
      { id: 'sony', name: 'Sony' },
      { id: 'canon', name: 'Canon' },
      { id: 'nikon', name: 'Nikon' },
      { id: 'fujifilm', name: 'Fujifilm' },
      { id: 'gopro', name: 'GoPro' },
      { id: 'dji', name: 'DJI' },
      { id: 'panasonic', name: 'Panasonic' },
      { id: 'olympus', name: 'Olympus' },
      { id: 'insta360', name: 'Insta360' },
    ],
    // Lens brands
    lenses: [
      { id: 'sigma', name: 'Sigma' },
      { id: 'tamron', name: 'Tamron' },
      { id: 'canon-lens', name: 'Canon' },
      { id: 'sony-lens', name: 'Sony' },
      { id: 'nikon-lens', name: 'Nikon' },
      { id: 'tokina', name: 'Tokina' },
      { id: 'rokinon', name: 'Rokinon' },
      { id: 'zeiss', name: 'Zeiss' }
    ],
    // Tripod brands
    tripod: [

      { id: 'vanguard', name: 'Vanguard' },
      { id: 'digitek', name: 'Digitek' },
     
    ],

    // Lighting brands
    light: [
      { id: 'godox', name: 'Godox' },
      { id: 'profoto', name: 'Profoto' },
      { id: 'elinchrom', name: 'Elinchrom' },
      { id: 'broncolor', name: 'Broncolor' },
      { id: 'neewer', name: 'Neewer' },
      { id: 'aputure', name: 'Aputure' },
      { id: 'rotolight', name: 'Rotolight' },
      { id: 'nanlite', name: 'Nanlite' },
      { id: 'Digitek', name: 'Digitek' },
    ],
    // Flash brands
    lighting: [
      { id: 'godox-flash', name: 'Godox' },
      { id: 'profoto-flash', name: 'Profoto' },
      { id: 'canon-flash', name: 'Canon' },
      { id: 'nikon-flash', name: 'Nikon' },
      { id: 'sony-flash', name: 'Sony' },
      { id: 'nissin', name: 'Nissin' },
      { id: 'phottix', name: 'Phottix' },
      { id: 'meike-flash', name: 'Meike' },
      { id: 'digitek', name: 'Digitek' },
    ],
    // Accessories brands
    accessories: [
      { id: 'peakdesign', name: 'Peak Design' },
      { id: 'lowepro', name: 'Lowepro' },
      { id: 'thinktank', name: 'Think Tank' },
      { id: 'sandisk', name: 'SanDisk' },
      { id: 'samsung', name: 'Samsung' },
      { id: 'lexar', name: 'Lexar' },
      { id: 'blackrapid', name: 'BlackRapid' },
      { id: 'optech', name: 'OP/TECH USA' },
      { id: 'Digitek', name: 'Digitek' },
    ],
    // Mic brands
    mic: [
      { id: 'rode', name: 'RØDE' },
      { id: 'audio-technica', name: 'Audio-Technica' },
      { id: 'dji-mic', name: 'DJI Mic' },
      { id: 'digitek', name: 'Digitek' },
      { id: 'boya', name: 'boya' },
    ],
    // Drone brands
    Drone: [
      { id: 'dji', name: 'dji' },
      ],
    // Manpower brands
    manpower: [
      { id: 'Videographer', name: 'Videographer' },
      { id: 'Photographer', name: 'Photographer' },
      { id: 'drone-pilot', name: 'Drone Pilot' },
    ],
    //gimbal brands
    gimbal: [
      { id: 'dji', name: 'dji' },
      { id: 'digitek', name: 'digitek' },
    ],
  });

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to sample data if API fails
      setProducts([
        {
          _id: '1',
          name: 'Sample Camera',
          description: 'High-quality camera for professional photography',
          price: 999.99,
          category: 'cameras',
          brand: 'Sample Brand',
          imageUrl: 'https://via.placeholder.com/300',
          stock: 10,
          isAvailable: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/admin/products', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowAddModal(false);
      setFormData({ name: '', description: '', price: '', category: '', brand: '', imageUrl: '', stock: '' });
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/admin/products/${editingProduct._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowEditModal(false);
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', category: '', brand: '', imageUrl: '', stock: '' });
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/admin/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      brand: product.brand,
      imageUrl: product.imageUrl,
      stock: product.stock.toString()
    });
    setShowEditModal(true);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalProducts: products.length,
    totalValue: products.reduce((sum, product) => sum + (product.price * (product.stock || 0)), 0),
    availableProducts: products.filter(p => p.stock > 0).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock < 5).length,
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Manage your products and inventory
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-3 sm:mt-0 inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1A97A9] hover:bg-[#167a8a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A97A9] transition-colors"
        >
          <Plus className="-ml-0.5 mr-1.5 h-4 w-4" />
          <span className="whitespace-nowrap">Add Product</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-5 sm:mb-8">
        {[
          { 
            title: 'Total Products', 
            value: stats.totalProducts,
            icon: <Package className="h-5 w-5 text-white" />,
            bg: 'bg-gradient-to-r from-[#1A97A9] to-[#1A97A9]/90'
          },
          { 
            title: 'Available', 
            value: stats.availableProducts,
            icon: <Package className="h-5 w-5 text-white" />,
            bg: 'bg-gradient-to-r from-[#1A97A9] to-[#1A97A9]/90'
          },
          { 
            title: 'Low Stock', 
            value: stats.lowStock,
            icon: <Tag className="h-5 w-5 text-white" />,
            bg: 'bg-gradient-to-r from-[#1A97A9] to-[#1A97A9]/90'
          },
          { 
            title: 'Total Value', 
            value: `₹${stats.totalValue.toLocaleString()}`,
            icon: <IndianRupee className="h-5 w-5 text-white" />,
            bg: 'bg-gradient-to-r from-[#1A97A9] to-[#1A97A9]/90'
          }
        ].map((stat, index) => (
          <div key={index} className={`${stat.bg} text-white rounded-lg shadow overflow-hidden`}>
            <div className="px-3 sm:px-4 py-3 sm:py-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-white/20 rounded-full p-1.5">
                  {stat.icon}
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm font-medium text-white/90 truncate">{stat.title}</p>
                  <p className="text-lg sm:text-xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and View Toggle */}
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
        <div className="flex items-center space-x-1 sm:space-x-2 w-full sm:w-auto">
          <div className="flex-1 sm:flex-none flex items-center space-x-1 sm:space-x-2 bg-gray-100 p-1 rounded-md">
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

      {/* Products Grid/List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1A97A9]"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-100">
          <Package className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-gray-400" />
          <h3 className="mt-3 text-sm sm:text-base font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search or filter' : 'Get started by adding a new product'}
          </p>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md shadow-sm text-white bg-[#1A97A9] hover:bg-[#167a8a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A97A9] transition-colors"
            >
              <Plus className="-ml-0.5 mr-1.5 h-4 w-4" />
              Add Product
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filteredProducts.map(product => (
            <div key={product._id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="relative pt-[100%] sm:pt-[100%] bg-gray-50">
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
                <div className="mt-3 flex space-x-1.5">
                  <button
                    onClick={() => openEditModal(product)}
                    className="flex-1 inline-flex justify-center items-center px-2 py-1.5 border border-gray-200 shadow-sm text-xs font-medium rounded text-white bg-[#1A97A9] hover:bg-[#167a8a] focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-[#1A97A9] transition-colors"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="inline-flex items-center px-2 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-red-500 transition-colors"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </button>
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
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Category
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th scope="col" className="relative px-4 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md overflow-hidden">
                          <img className="h-full w-full object-contain p-1" src={product.imageUrl || 'https://via.placeholder.com/40'} alt={product.name} loading="lazy" />
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
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="text-gray-400 hover:text-[#1A97A9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A97A9] rounded-full p-1"
                          aria-label="Edit product"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-full p-1"
                          aria-label="Delete product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-10 flex justify-between items-center bg-white px-4 sm:px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {showAddModal ? 'Add New Product' : 'Edit Product'}
              </h3>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setEditingProduct(null);
                  setFormData({ name: '', description: '', price: '', category: '', brand: '', imageUrl: '', stock: '' });
                }} 
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A97A9] rounded-full p-1"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={showAddModal ? handleAddProduct : handleEditProduct} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1A97A9] focus:ring focus:ring-[#1A97A9]/20 sm:text-sm transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1A97A9] focus:ring focus:ring-[#1A97A9]/20 sm:text-sm transition-colors"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    min="0"
                    step="0.01"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1A97A9] focus:ring focus:ring-[#1A97A9]/20 sm:text-sm transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    min="0"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1A97A9] focus:ring focus:ring-[#1A97A9]/20 sm:text-sm transition-colors"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value, brand: ''})}
                    className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-[#1A97A9] focus:outline-none focus:ring-1 focus:ring-[#1A97A9] transition-colors"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-[#1A97A9] focus:outline-none focus:ring-1 focus:ring-[#1A97A9] transition-colors"
                    required
                    disabled={!formData.category}
                  >
                    <option value="">Select a brand</option>
                    {formData.category && brands[formData.category] ? (
                      brands[formData.category].map(brand => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>Select a category first</option>
                    )}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    className="flex-1 min-w-0 block w-full rounded-md border-gray-300 focus:border-[#1A97A9] focus:ring focus:ring-[#1A97A9]/20 sm:text-sm transition-colors"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                {formData.imageUrl && (
                  <div className="mt-2">
                    <div className="text-xs text-gray-500 mb-1">Image Preview:</div>
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="h-20 w-20 object-cover rounded border border-gray-200"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/80';
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setEditingProduct(null);
                    setFormData({ name: '', description: '', price: '', category: '', brand: '', imageUrl: '', stock: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1A97A9] hover:bg-[#167a8a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A97A9] transition-colors"
                >
                  {showAddModal ? 'Add Product' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;

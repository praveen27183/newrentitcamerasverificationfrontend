import React, { useState, useEffect } from 'react';
import { 
  Search, Grid3X3, List as ListIcon, Plus, Edit, Trash2, X, Image as ImageIcon 
} from 'lucide-react';
import axios from 'axios';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]); // ✅ for brand filter
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedBrand, setSelectedBrand] = useState('all'); // ✅ brand filter
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    brand: '' // ✅ add brand to form
  });

  // Fetch categories + brands
  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/categories');
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]); // Ensure categories is always an array
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await axios.get('/api/brands');
      setBrands(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching brands:", error);
      setBrands([]); // Ensure brands is always an array
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await axios.put(`/api/categories/${editingCategory._id}`, formData);
      } else {
        await axios.post('/api/categories', formData);
      }
      fetchCategories();
      setShowAddModal(false);
      setEditingCategory(null);
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`/api/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      image: category.image,
      brand: category.brand || ''
    });
    setShowAddModal(true);
  };

  const getSortedCategories = (categories) => {
    return [...categories].sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        default: return 0;
      }
    });
  };

  // ✅ Filtering: search + brand
  const filteredCategories = getSortedCategories(
    categories.filter(cat =>
      (selectedBrand === 'all' || cat.brand === selectedBrand) &&
      (
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    )
  );

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Categories</h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Manage your categories by brand
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: '', description: '', image: '', brand: '' });
            setShowAddModal(true);
          }}
          className="mt-3 sm:mt-0 inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1A97A9] hover:bg-[#167a8a]"
        >
          <Plus className="-ml-0.5 mr-1.5 h-4 w-4" />
          Add Category
        </button>
      </div>

      {/* Search, Sort & Brand Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-[#1A97A9]"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {/* Brand Filter */}
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="pl-3 pr-8 py-2 text-sm border rounded-md focus:ring-[#1A97A9]"
          >
            <option value="all">All Brands</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand.name}>{brand.name}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="pl-3 pr-8 py-2 text-sm border rounded-md focus:ring-[#1A97A9]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name-asc">Name: A → Z</option>
            <option value="name-desc">Name: Z → A</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white text-[#1A97A9]' : 'text-gray-500'}`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white text-[#1A97A9]' : 'text-gray-500'}`}
            >
              <ListIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Categories Grid/List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-[#1A97A9] rounded-full"></div>
        </div>
      ) : filteredCategories.length === 0 ? (
        <p className="text-center py-10 text-gray-500">No categories found</p>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <div key={category._id} className="bg-white shadow rounded-lg p-4">
              <img src={category.image || 'https://via.placeholder.com/150'} alt={category.name} className="rounded-md mb-2 w-full h-32 object-cover" />
              <h3 className="font-semibold">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.brand}</p>
              <p className="text-xs text-gray-400">{category.description}</p>
              <div className="flex gap-2 mt-2">
                <button onClick={() => openEditModal(category)} className="text-[#1A97A9]"><Edit size={16} /></button>
                <button onClick={() => handleDelete(category._id)} className="text-red-500"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm">Category</th>
              <th className="px-4 py-2 text-left text-sm">Brand</th>
              <th className="px-4 py-2 text-left text-sm">Description</th>
              <th className="px-4 py-2 text-right text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category) => (
              <tr key={category._id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{category.name}</td>
                <td className="px-4 py-2">{category.brand}</td>
                <td className="px-4 py-2 text-gray-500">{category.description}</td>
                <td className="px-4 py-2 text-right">
                  <button onClick={() => openEditModal(category)} className="text-[#1A97A9] mr-2"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(category._id)} className="text-red-500"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setShowAddModal(false)}><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Category Name" value={formData.name} required
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border rounded-md p-2"
              />
              <textarea placeholder="Description" value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full border rounded-md p-2"
              />
              <input type="text" placeholder="Image URL" value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                className="w-full border rounded-md p-2"
              />
              <select value={formData.brand} required
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                className="w-full border rounded-md p-2"
              >
                <option value="">Select Brand</option>
                {Array.isArray(brands) && brands.map((brand) => (
                  <option key={brand._id} value={brand.name}>{brand.name}</option>
                ))}
              </select>
              <button type="submit" className="w-full bg-[#1A97A9] text-white py-2 rounded-md">
                {editingCategory ? 'Update' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;

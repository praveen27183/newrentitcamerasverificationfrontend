import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  Package, 
  IndianRupee, 
  TrendingUp,
  Plus,
  Trash2,
  Search,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  ProductCategoryPie, 
  ClickRateBar, 
  RevenueTrendLine, 
  TopProductsBar 
} from './ProductCharts';

const Dashboard = ({ 
  stats = {
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0
  }, 
  categories: propCategories = [], 
  products: propProducts = []
} = {}) => {
  const [isLoading, setIsLoading] = useState(!propProducts.length);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [localStats, setLocalStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [localCategories, setLocalCategories] = useState([]);
  const [localProducts, setLocalProducts] = useState([]);
  
  const categories = Array.isArray(propCategories) && propCategories.length
    ? propCategories
    : Array.isArray(localCategories) ? localCategories : [];

  const products = Array.isArray(propProducts) && propProducts.length
    ? propProducts
    : Array.isArray(localProducts) ? localProducts : [];

  const displayStats = stats && typeof stats === 'object' && Object.values(stats).some(val => val > 0) 
    ? stats 
    : localStats;
  
  // Fetch data if not provided via props
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (propProducts.length > 0 && propCategories.length > 0) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const [productsRes, categoriesRes, statsRes] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/categories'),
          axios.get('/api/stats')
        ]);
        
        setLocalProducts(productsRes.data);
        setLocalCategories(categoriesRes.data);
        setLocalStats(statsRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Category name lookup for search
  const categoryMap = useMemo(() => {
    return categories.reduce((acc, cat) => {
      if (cat?.id || cat?._id) acc[cat.id || cat._id] = cat.name || '';
      return acc;
    }, {});
  }, [categories]);

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];
    if (!searchTerm.trim()) return [...products];
    
    const term = searchTerm.toLowerCase();
    return products.filter(product => {
      if (!product) return false;
      const categoryName = categoryMap[product?.category?._id || product?.category] || '';
      
      return (
        (product.name?.toLowerCase() || '').includes(term) ||
        (product.description?.toLowerCase() || '').includes(term) ||
        categoryName.toLowerCase().includes(term) ||
        (Array.isArray(product.tags) && product.tags.some(tag => 
          String(tag || '').toLowerCase().includes(term)
        ))
      );
    });
  }, [products, searchTerm, categoryMap]);

  // FIXED chartData generation
  const chartData = useMemo(() => {
    if (!Array.isArray(categories) || !Array.isArray(products)) return [];
    if (categories.length === 0 || products.length === 0) return [];

    return categories
      .filter(cat => cat && (cat.id || cat._id))
      .map(cat => {
        const catId = cat.id || cat._id;
        const productCount = products.filter(p => {
          const prodCatId = p?.category?._id || p?.category;
          return prodCatId === catId;
        }).length;

        return {
          name: cat?.name || 'Uncategorized',
          value: productCount,
          clicks: Math.abs((catId || '').toString().split('').reduce((a, b) => 
            ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
          ) % 200 + 20
        };
      })
      .filter(item => item.value > 0);
  }, [categories, products]);

  const handleDeleteAllProducts = async () => {
    if (!window.confirm('Are you sure you want to delete all products? This action cannot be undone.')) {
      return;
    }
    
    try {
      setIsLoading(true);
      await axios.delete('/api/products');
      setLocalProducts([]);
      setLocalStats(prev => ({ ...prev, totalProducts: 0 }));
    } catch (err) {
      console.error('Failed to delete products:', err);
      setError('Failed to delete products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [productsRes, categoriesRes, statsRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/categories'),
        axios.get('/api/stats')
      ]);
      
      setLocalProducts(productsRes.data);
      setLocalCategories(categoriesRes.data);
      setLocalStats(statsRes.data);
    } catch (err) {
      console.error('Failed to refresh data:', err);
      setError('Failed to refresh data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1A97A9]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md flex items-center">
        <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <button
          onClick={handleRefreshData}
          disabled={isLoading}
          className="flex items-center text-sm text-[#1A97A9] hover:text-[#1A97A9]/80 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1A97A9] p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-50 text-blue-600">
              <Package className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white">Total Products</p>
              <p className="text-2xl font-semibold text-white">{displayStats.totalProducts || products.length || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1A97A9] p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-50 text-green-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white">Categories</p>
              <p className="text-2xl font-semibold text-white">{displayStats.totalCategories || categories.length || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1A97A9] p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-50 text-purple-600">
              <IndianRupee className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white">Total Revenue</p>
              <p className="text-2xl font-semibold text-white">₹{displayStats.totalRevenue?.toLocaleString() || '0'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold mb-4">Product Distribution</h3>
          <div className="h-64 md:h-80">
            <ProductCategoryPie data={[
              { name: 'Cameras', value: 10 },
              { name: 'Lenses', value: 20 },
              { name: 'Tripods', value: 30 },
              { name: 'Bags', value: 40 },
              { name: 'Accessories', value: 50 },
            ]} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold mb-4">Click Rate</h3>
          <div className="h-64 md:h-80">
            <ClickRateBar data={[
              { name: 'Canon', value: 120 },
              { name: 'Nikon', value: 150 },
              { name: 'Sony', value: 180 },
              { name: 'Fujifilm', value: 200 },
              { name: 'Olympus', value: 220 },
            ]} />
          </div>
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold mb-4">Revenue Trends (Last 6 Months)</h3>
          <div className="h-80">
            <RevenueTrendLine data={[
              { month: 'Jan', revenue: 50000 },
              { month: 'Feb', revenue: 75000 },
              { month: 'Mar', revenue: 90000 },
              { month: 'Apr', revenue: 120000 },
              { month: 'May', revenue: 150000 },
              { month: 'Jun', revenue: 180000 },
            ]} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold mb-4">Top Performing Products</h3>
          <div className="h-96">
            <TopProductsBar data={[
              { name: 'Canon EOS R5', value: 45 },
              { name: 'Sony A7 IV', value: 38 },
              { name: 'Nikon Z7 II', value: 32 },
              { name: 'Fujifilm X-T4', value: 28 },
              { name: 'Sony 24-70mm Lens', value: 22 },
            ]} />
          </div>
        </div>
      </div>

      {/* Product Management */}
      {/* ...rest of your existing table code remains unchanged... */}
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './layout/Sidebar';
import Dashboard from './Dashboard/Dashboard';
import Inventory from './Inventory/Inventory';
import ViewProducts from './Inventory/ViewProducts';
import AddProduct from './Inventory/AddProduct';
import Categories from './Inventory/Categories';
import Orders from './Orders/Orders';
import Customers from './Customers/Customers';
import Analytics from './Analytics/Analytics';


// Reusable loading spinner
const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1A97A9]" />
  </div>
);

// Reusable error display
const ErrorScreen = ({ message }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-red-500 text-lg">{message}</div>
  </div>
);

// Hook for fetching dashboard data
const useAdminData = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [productsRes, categoriesRes] = await Promise.all([
          axios.get('/api/products').then(res => res.data || []),
          axios.get('/api/categories').then(res => res.data || [])
        ]);

        setProducts(Array.isArray(productsRes) ? productsRes : []);
        setCategories(Array.isArray(categoriesRes) ? categoriesRes : []);
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  return { products, categories, loading, error };
};

// Main Admin Dashboard Component
const AdminDashboard = ({ onLogout, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleTabChange = (tab) => {
    if (tab === 'toggle') {
      setSidebarOpen(!sidebarOpen);
    } else {
      // Handle other tab changes if needed
    }
  };

  const { products, categories, loading, error } = useAdminData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return products;

    return products.filter(product =>
      [product.name, product.description, product.category]
        .some(field => field?.toLowerCase().includes(term))
    );
  }, [products, searchTerm]);

  if (!user) return <Navigate to="/login" replace />;
  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        activeTab={location.pathname.split('/')[2] || 'dashboard'}
        onTabChange={handleTabChange}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        {/* Top Navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </button>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                Welcome, <span className="font-medium">{user?.displayName || user?.email || 'Admin'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <Routes>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route
                path="dashboard"
                element={
                  <Dashboard
                    products={products}
                    categories={categories}
                    stats={{
                      totalProducts: products.length,
                      totalCategories: categories.length
                    }}
                  />
                }
              />
              <Route
                path="inventory"
                element={
                  <Inventory
                    products={products}
                    filteredProducts={filteredProducts}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    categories={categories}
                    loading={loading}
                    productError={error}
                    brands={[]}
                    viewMode="list"
                  />
                }
              />  
              <Route path="inventory" element={<Inventory />} />
              <Route path="inventory/view" element={<ViewProducts />} />  
              <Route path="inventory/categories" element={<Categories />} />
              <Route path="inventory/add-product" element={<AddProduct />} />
              <Route path="orders" element={<Orders />} />
              <Route path="customers" element={<Customers />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

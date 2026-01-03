import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, CheckCircle, XCircle, Clock, Search, Filter, ChevronDown, 
  ChevronUp, Truck, CreditCard, Package as PackageIcon, RefreshCw, Plus, 
  Phone, User, Calendar, MapPin, Mail, ChevronRight, XCircle as XIcon
} from 'lucide-react';

const OrderCard = ({ order, onUpdateStatus }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusBadge = (status) => {
    const statusClasses = {
     
    };
    
    const statusIcons = {
      
    };
    
    
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
      {/* Order card header */}
      <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="font-semibold text-gray-800">Order #{order.orderId}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{new Date(order.orderDate).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(order.status)}
          </div>
        </div>
      </div>
      
      {/* Order card body */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium text-gray-900 flex items-center">
              <User className="w-4 h-4 mr-2 text-gray-500" />
              {order.customer.name}
            </h4>
            <p className="text-sm text-gray-600 mt-1 flex items-center">
              <Phone className="w-4 h-4 mr-2 text-gray-500" />
              {order.customer.phone}
            </p>
          </div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#1A97A9] hover:text-[#167a8a] flex items-center text-sm font-medium"
          >
            {isExpanded ? 'Show less' : 'View details'}
            <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {/* Expanded order details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                  Delivery Address
                </h4>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700">{order.shippingAddress.street}</p>
                  <p className="text-sm text-gray-700">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  <p className="text-sm text-gray-700">{order.shippingAddress.country} - {order.shippingAddress.zipCode}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.name} x {item.quantity}</span>
                      <span className="font-medium">₹{item.price.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>₹{order.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    paymentStatus: 'all',
    dateRange: 'all',
    sortBy: 'newest',
  });

  // Mock data - replace with API call in production
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        // Fetch products from API with authentication
        const response = await fetch('http://localhost:5000/api/admin/products', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          // If unauthorized, remove the invalid token and reload
          if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return;
          }
          throw new Error('Failed to fetch products');
        }
        
        const products = await response.json();
        
        // Transform products into orders (for demo purposes)
        const mockOrders = products.slice(0, 10).map((product, index) => {
          const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
          const daysAgo = Math.floor(Math.random() * 30);
          const orderDate = new Date();
          orderDate.setDate(orderDate.getDate() - daysAgo);
          
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          const itemCount = Math.floor(Math.random() * 2) + 1; // 1-2 items per order
          
          const items = [{
            id: product._id || `item_${index}`,
            name: product.name || `Product ${index + 1}`,
            quantity: Math.floor(Math.random() * 2) + 1, // 1-2 quantity
            price: product.price || (1000 + Math.floor(Math.random() * 9000)),
          }];
          
          const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          const shipping = 150;
          const tax = subtotal * 0.18; // 18% tax
          const total = subtotal + shipping + tax;
          
          return {
            orderId: `ORD-${1000 + index}`,
            orderDate: orderDate.toISOString(),
            status,
            paymentStatus: Math.random() > 0.3 ? 'paid' : 'pending',
            items,
            subtotal,
            shipping,
            tax,
            total,
            customer: {
              id: `CUST-${100 + index}`,
              name: `Customer ${index + 1}`,
              email: `customer${index + 1}@example.com`,
              phone: `+91 ${Math.floor(7000000000 + Math.random() * 3000000000)}`,
            },
            shippingAddress: {
              street: `${100 + index} Main St, ${['KK Nagar', 'Anna Nagar', 'T. Nagar', 'Nungambakkam'][index % 4]}`,
              city: 'Chennai',
              state: 'Tamil Nadu',
              country: 'India',
              zipCode: '6000' + (index % 100).toString().padStart(2, '0'),
            },
          };
        });
        
        setOrders(mockOrders);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        // Fallback to mock data if API fails
        console.log('Using fallback mock data');
        const mockOrders = Array.from({ length: 8 }, (_, i) => ({
          orderId: `ORD-${1000 + i}`,
          orderDate: new Date().toISOString(),
          status: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'][i % 5],
          paymentStatus: Math.random() > 0.3 ? 'paid' : 'pending',
          items: [{
            id: `item_${i}`,
            name: `Product ${i + 1}`,
            quantity: Math.floor(Math.random() * 2) + 1,
            price: 1000 + Math.floor(Math.random() * 9000),
          }],
          subtotal: 1000 + Math.floor(Math.random() * 9000),
          shipping: 150,
          tax: 180,
          total: 1330 + Math.floor(Math.random() * 10620),
          customer: {
            id: `CUST-${100 + i}`,
            name: `Customer ${i + 1}`,
            email: `customer${i + 1}@example.com`,
            phone: `+91 ${Math.floor(7000000000 + Math.random() * 3000000000)}`,
          },
          shippingAddress: {
            street: `${100 + i} Main St, ${['KK Nagar', 'Anna Nagar', 'T. Nagar', 'Nungambakkam'][i % 4]}`,
            city: 'Chennai',
            state: 'Tamil Nadu',
            country: 'India',
            zipCode: '6000' + (i % 100).toString().padStart(2, '0'),
          },
        }));
        setOrders(mockOrders);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleUpdateStatus = (orderId, newStatus) => {
    // Update order status logic goes here
    console.log(`Updating order ${orderId} to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
            <p className="mt-1 text-sm text-gray-500">Manage and track all customer orders</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-300 flex items-center transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Orders
            </button>
            <button className="px-4 py-2 bg-[#1A97A9] text-white text-sm font-medium rounded-lg hover:bg-[#167a8a] flex items-center transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              New Order
            </button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Total Orders', value: orders.length, color: 'blue' },
            { 
              label: 'Pending', 
              value: orders.filter(o => o.status === 'pending').length, 
              color: 'amber' 
            },
            { 
              label: 'Processing', 
              value: orders.filter(o => o.status === 'processing').length, 
              color: 'blue' 
            },
            { 
              label: 'Shipped', 
              value: orders.filter(o => o.status === 'shipped').length, 
              color: 'indigo' 
            },
            { 
              label: 'Delivered', 
              value: orders.filter(o => o.status === 'delivered').length, 
              color: 'green' 
            },
          ].map((stat, index) => (
            <div key={index} className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 p-4 rounded-xl border border-${stat.color}-100`}>
              <p className={`text-sm font-medium text-${stat.color}-700`}>{stat.label}</p>
              <p className={`mt-2 text-2xl font-bold text-${stat.color}-900`}>{stat.value}</p>
              <div className={`mt-2 h-1.5 w-full bg-${stat.color}-100 rounded-full overflow-hidden`}>
                <div 
                  className={`h-full bg-${stat.color}-500 rounded-full`} 
                  style={{ width: `${(stat.value / Math.max(1, orders.length)) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1A97A9] focus:border-transparent transition-all duration-200"
                placeholder="Search by order ID, customer name, phone, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* Filter and Sort Controls */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center transition-colors ${
                  showFilters || Object.values(filters).some(v => v !== 'all' && v !== 'newest')
                    ? 'bg-[#1A97A9] text-white hover:bg-[#167a8a] shadow-sm'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {showFilters ? (
                  <ChevronUp className="w-4 h-4 ml-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-1" />
                )}
              </button>
              
              <div className="relative group">
                <div className="flex items-center px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-700 cursor-pointer">
                  <span className="text-sm font-medium mr-1">
                    Sort: {filters.sortBy === 'newest' ? 'Newest' : 
                           filters.sortBy === 'oldest' ? 'Oldest' :
                           filters.sortBy === 'total-asc' ? 'Total: Low to High' : 'Total: High to Low'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
                <div className="absolute right-0 z-10 mt-1 w-56 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block">
                  <div className="py-1">
                    <button
                      onClick={() => setFilters({...filters, sortBy: 'newest'})}
                      className={`block w-full text-left px-4 py-2 text-sm ${filters.sortBy === 'newest' ? 'bg-gray-100 text-[#1A97A9]' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      Newest First
                    </button>
                    <button
                      onClick={() => setFilters({...filters, sortBy: 'oldest'})}
                      className={`block w-full text-left px-4 py-2 text-sm ${filters.sortBy === 'oldest' ? 'bg-gray-100 text-[#1A97A9]' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      Oldest First
                    </button>
                    <button
                      onClick={() => setFilters({...filters, sortBy: 'total-asc'})}
                      className={`block w-full text-left px-4 py-2 text-sm ${filters.sortBy === 'total-asc' ? 'bg-gray-100 text-[#1A97A9]' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      Total: Low to High
                    </button>
                    <button
                      onClick={() => setFilters({...filters, sortBy: 'total-desc'})}
                      className={`block w-full text-left px-4 py-2 text-sm ${filters.sortBy === 'total-desc' ? 'bg-gray-100 text-[#1A97A9]' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      Total: High to Low
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A97A9] focus:border-transparent"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                  <select
                    name="paymentStatus"
                    value={filters.paymentStatus}
                    onChange={(e) => setFilters({...filters, paymentStatus: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A97A9] focus:border-transparent"
                  >
                    <option value="all">All Payments</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                  <select
                    name="dateRange"
                    value={filters.dateRange}
                    onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A97A9] focus:border-transparent"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="thisWeek">This Week</option>
                    <option value="thisMonth">This Month</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={() => setFilters({
                    status: 'all',
                    paymentStatus: 'all',
                    dateRange: 'all',
                    sortBy: 'newest',
                  })}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Orders List */}
        <div className="border-t border-gray-200 p-5">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1A97A9]"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
              <p className="mt-1 text-sm text-gray-500">
                There are no orders to display at the moment.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <OrderCard 
                  key={order.orderId} 
                  order={order} 
                  onUpdateStatus={handleUpdateStatus} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
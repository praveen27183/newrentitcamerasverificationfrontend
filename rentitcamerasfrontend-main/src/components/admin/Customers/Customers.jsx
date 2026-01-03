import React, { useState, useEffect } from 'react';
import { Users, Trash2, Search, ChevronDown } from 'lucide-react';
import axios from 'axios';

const Customers = ({ orders = [] }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 🔹 New state for sorting

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/admin/customers', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCustomers(res.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/admin/customers/${customerId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCustomers(customers.filter(customer => customer._id !== customerId));
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  // 🔹 Filter customers by search term
  const filteredCustomers = customers.filter(customer => 
    (customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     customer.phone?.includes(searchTerm))
  );

  // 🔹 Sort customers based on join date
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const getTotalOrders = (customerId) => {
    return orders.filter(order => order.user?._id === customerId).length;
  };

  const getTotalSpent = (customerId) => {
    return orders
      .filter(order => order.user?._id === customerId)
      .reduce((sum, order) => sum + (order.totalPrice || 0), 0);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A97A9] mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading customers...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h3 className="text-lg font-semibold mb-4 sm:mb-0">Customer Management</h3>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#1A97A9] focus:border-[#1A97A9]"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#1A97A9] focus:border-[#1A97A9]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Customer List */}
      {sortedCustomers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No customers found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedCustomers.map(customer => (
            <div key={customer._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-[#1A97A9] rounded-full flex items-center justify-center text-white font-semibold">
                      {customer.name?.charAt(0)?.toUpperCase() || 'C'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{customer.name || 'N/A'}</h4>
                      <p className="text-sm text-gray-500">{customer.email || 'No email'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Phone:</span> {customer.phone || 'No phone'}
                    </div>
                    <div>
                      <span className="font-medium">Address:</span> {customer.address || 'No address'}
                    </div>
                    <div>
                      <span className="font-medium">Joined:</span> {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Total Orders:</span> {getTotalOrders(customer._id)}
                    </div>
                  </div>
                </div>

                <div className="mt-3 sm:mt-0 sm:ml-4 flex space-x-2">
                  <button
                    onClick={() => {
                      const totalSpent = getTotalSpent(customer._id);
                      alert(`Customer Details:\n\nName: ${customer.name || 'N/A'}\nEmail: ${customer.email || 'N/A'}\nPhone: ${customer.phone || 'N/A'}\nAddress: ${customer.address || 'N/A'}\nJoined: ${customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}\nTotal Orders: ${getTotalOrders(customer._id)}\nTotal Spent: ₹${totalSpent.toLocaleString()}`);
                    }}
                    className="bg-[#1A97A9] text-white px-3 py-1.5 rounded-md text-sm hover:bg-[#1A97A9]/90 transition-colors flex items-center"
                  >
                    <span>View Details</span>
                  </button>
                  <button
                    onClick={() => handleDeleteCustomer(customer._id)}
                    className="bg-red-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-red-600 transition-colors flex items-center"
                    title="Delete Customer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Customers;

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { 
  OrdersPerMonthBar, 
  RevenuePerMonthBar, 
  CustomerSignupPie, 
  TopCustomersBar 
} from './AnalyticsCharts';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

const Analytics = ({ 
  orders: propOrders = [], 
  customers: propCustomers = [] 
}) => {
  const [analyticsData, setAnalyticsData] = useState({
    ordersPerMonth: [], 
    revenuePerMonth: [], 
    signupsPerMonth: [], 
    topCustomers: [] 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      };

      console.log('Fetching analytics data...');
      
      const [ordersRes, customersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/orders', config)
          .then(res => {
            console.log('Orders response:', res.data);
            return res;
          })
          .catch(err => {
            console.error('Error fetching orders:', err);
            throw err;
          }),
          
        axios.get('http://localhost:5000/api/admin/customers', config)
          .then(res => {
            console.log('Customers response:', res.data);
            return res;
          })
          .catch(err => {
            console.error('Error fetching customers:', err);
            throw err;
          })
      ]);

      const ordersData = Array.isArray(ordersRes?.data) ? ordersRes.data : [];
      const customersData = Array.isArray(customersRes?.data) ? customersRes.data : [];

      console.log('Orders data:', ordersData);
      console.log('Customers data:', customersData);

      if (ordersData.length === 0 && customersData.length === 0) {
        console.warn('Both orders and customers data are empty');
      }

      computeAnalytics(ordersData, customersData);
      setLastUpdated(new Date());
      
    } catch (error) {
      console.error('Fetch error:', error);
      
      let errorMessage = 'Failed to fetch data. Please try again.';
      
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        
        if (error.response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/admin/login';
          return;
        }
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        console.error('No response received:', error.request);
        errorMessage = 'No response from server. Please check your connection.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const computeAnalytics = useCallback((ordersData, customersData) => {
    if (!Array.isArray(ordersData) || !Array.isArray(customersData)) {
      throw new Error('Invalid data format received');
    }
    const ordersByMonth = {};
    const revenueByMonth = {};
    const signupsByMonth = {};
    const customerSpend = {};

    ordersData.forEach(order => {
      const date = new Date(order.createdAt);
      const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      ordersByMonth[month] = (ordersByMonth[month] || 0) + 1;
      
      revenueByMonth[month] = (revenueByMonth[month] || 0) + (order.totalPrice || 0);
      
      if (order.user && order.user.name) {
        const customerId = order.user._id || order.user.id;
        if (!customerSpend[customerId]) {
          customerSpend[customerId] = {
            name: order.user.name,
            spend: 0
          };
        }
        customerSpend[customerId].spend += order.totalPrice || 0;
      }
    });

    customersData.forEach(customer => {
      if (customer.createdAt) {
        const date = new Date(customer.createdAt);
        const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        signupsByMonth[month] = (signupsByMonth[month] || 0) + 1;
      }
    });

    const allMonths = [...new Set([
      ...Object.keys(ordersByMonth),
      ...Object.keys(revenueByMonth),
      ...Object.keys(signupsByMonth)
    ])].sort();

    const ordersPerMonth = allMonths.map(month => ({
      month,
      orders: ordersByMonth[month] || 0
    }));

    const revenuePerMonth = allMonths.map(month => ({
      month,
      revenue: revenueByMonth[month] || 0
    }));

    const signupsPerMonth = allMonths.map(month => ({
      month,
      count: signupsByMonth[month] || 0
    }));

    const topCustomers = Object.values(customerSpend)
      .sort((a, b) => b.spend - a.spend)
      .slice(0, 7);

    setAnalyticsData({
      ordersPerMonth,
      revenuePerMonth,
      signupsPerMonth,
      topCustomers
    });
  }, []); 

  const renderError = (message) => (
    <div className="bg-white rounded-lg shadow p-6">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="mb-4">
          {message}
        </AlertDescription>
        <Button 
          onClick={fetchData} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </Alert>
    </div>
  );

  if (error) {
    return renderError(error);
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Analytics & Growth</h3>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1A97A9] mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading analytics data...</p>
          <p className="text-sm text-gray-400 mt-1">This may take a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold">Analytics & Growth</h3>
          {lastUpdated && (
            <p className="text-xs text-gray-500 mt-1">
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </p>
          )}
        </div>
        <Button 
          onClick={fetchData} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="font-semibold mb-2">Orders Growth</h4>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <OrdersPerMonthBar data={analyticsData.ordersPerMonth} />
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">Revenue Growth</h4>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <RevenuePerMonthBar data={analyticsData.revenuePerMonth} />
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">Customer Signups</h4>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <CustomerSignupPie data={analyticsData.signupsPerMonth} />
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">Top Customers</h4>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <TopCustomersBar data={analyticsData.topCustomers} />
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Analytics data is computed based on available orders and customer data. Hover over charts for detailed information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

Analytics.propTypes = {
  orders: PropTypes.array,
  customers: PropTypes.array
};

export default Analytics;
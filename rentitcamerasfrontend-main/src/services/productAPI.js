import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Fetch all available products
 * @returns {Promise<Array>} Array of products
 */
export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Create a new order
 * @param {Object} orderData - Order data containing product, rental dates, etc.
 * @returns {Promise<Object>} Created order
 */
export const createOrder = async (orderData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_BASE_URL}/orders`,
      orderData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};


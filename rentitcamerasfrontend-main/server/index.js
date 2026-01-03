import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'client'], default: 'client' },
  name: { type: String, required: true },
  phone: { type: String }, // Optional, can be required if needed
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  imageUrl: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, default: 1 }
  }],
  rentalStart: { type: Date, required: true },
  rentalEnd: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Client Verification Schema
const clientVerificationSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  idType: { type: String, required: true },
  idNumber: { type: String, required: true },
  verified: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const ClientVerification = mongoose.model('ClientVerification', clientVerificationSchema);

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('Auth header:', authHeader);
  console.log('Token:', token);

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      console.error('JWT verification error:', err);
      return res.status(403).json({ message: 'Invalid token' });
    }
    console.log('Decoded user:', user);
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  console.log('requireAdmin - user:', req.user);
  console.log('requireAdmin - user role:', req.user?.role);
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Routes

// Register (only for clients)
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new client user
    const user = new User({
      email,
      password: hashedPassword,
      name,
      phone,
      role: 'client'
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create admin user (for development - remove in production)
app.post('/api/create-admin', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin user
    const user = new User({
      email,
      password: hashedPassword,
      name,
      role: 'admin'
    });

    await user.save();

    res.status(201).json({
      message: 'Admin user created successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login (for both admin and clients)
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user profile
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin Routes

// Get current admin profile
app.get('/api/admin/profile', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Check user role (for debugging - remove in production)
app.get('/api/check-role', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json({ 
      message: 'User role checked successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all customers (admin only)
app.get('/api/admin/customers', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const customers = await User.find({ role: 'client' }).select('-password');
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all orders with customer details (admin only)
app.get('/api/admin/orders', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email createdAt')
      .populate('products.product', 'name price');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all products (admin only)
app.get('/api/admin/products', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add new product (admin only)
app.post('/api/admin/products', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, category, brand, imageUrl, stock } = req.body;
    
    const product = new Product({
      name,
      description,
      price,
      category,
      brand,
      imageUrl,
      stock
    });

    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update product (admin only)
app.put('/api/admin/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, category, brand, imageUrl, stock, isAvailable } = req.body;
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, brand, imageUrl, stock, isAvailable },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete product (admin only)
app.delete('/api/admin/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all categories
app.get('/api/category', async (req, res) => {
  try {
    // Get unique categories from products
    const category = await Product.distinct('category');
    res.json(category);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
});

// Client Routes

// Get all available products (for clients)
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({ isAvailable: true }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Client Verification Routes

// Save client verification record
app.post('/api/client-verification', async (req, res) => {
  console.log('POST /api/client-verification - Request received');
  try {
    const { clientName, mobileNumber, idType, idNumber } = req.body;

    // Validate required fields
    if (!clientName || !mobileNumber || !idType || !idNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create new verification record
    const verification = new ClientVerification({
      clientName,
      mobileNumber,
      idType,
      idNumber,
      verified: true
    });

    await verification.save();

    res.status(201).json({
      message: 'Verification record saved successfully',
      verification: {
        id: verification._id,
        clientName: verification.clientName,
        mobileNumber: verification.mobileNumber,
        idType: verification.idType,
        createdAt: verification.createdAt
      }
    });
  } catch (error) {
    console.error('Error saving verification:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all client verifications (admin only)
app.get('/api/admin/client-verifications', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const verifications = await ClientVerification.find().sort({ createdAt: -1 });
    res.json(verifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
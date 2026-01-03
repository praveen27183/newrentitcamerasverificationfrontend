# Rentit Cameras - Authentication System

A comprehensive camera rental platform with role-based authentication, featuring admin and client dashboards with MongoDB Atlas integration.

## Features

### 🔐 Authentication System
- **Role-based access control**: Admin and Client roles
- **Secure login/register**: JWT token-based authentication
- **Password hashing**: bcrypt encryption for security
- **Session management**: Persistent login state

### 👨‍💼 Admin Dashboard
- **Product Management**: Add, edit, delete camera equipment
- **Inventory Control**: Track stock levels and availability
- **Analytics**: View total products, value, and low stock alerts
- **Search & Filter**: Find products quickly
- **Real-time Updates**: Instant product modifications

### 👤 Client Dashboard
- **Browse Equipment**: View available camera rentals
- **User Profile**: Personalized experience
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

## Tech Stack

### Frontend
- **React 18**: Modern UI framework
- **React Router DOM**: Client-side routing
- **Vite**: Fast development server and build tool
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Beautiful icons
- **Axios**: HTTP client for API calls
- **React Toastify**: Toast notifications
- **React Slick & Slick Carousel**: Responsive carousel components
- **Styled Components**: CSS-in-JS styling solution
- **React Datepicker**: Date selection component
- **Particles.js & React-tsparticles**: Interactive particle backgrounds
- **Three.js**: 3D graphics library

### Backend
- **Node.js**: Server runtime
- **Express.js**: Web framework
- **MongoDB Atlas**: Cloud database
- **Mongoose**: MongoDB ODM
- **JSON Web Tokens (JWT)**: Authentication tokens
- **bcryptjs**: Password hashing
- **CORS**: Cross-Origin Resource Sharing
- **dotenv**: Environment variable management

### Development Tools
- **TypeScript**: Static type checking
- **ESLint**: Code linting
- **PostCSS & Autoprefixer**: CSS processing
- **Concurrently**: Run multiple commands concurrently

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- npm or yarn package manager

### 1. Clone and Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies (already included in package.json)
npm install
```

### 2. MongoDB Atlas Setup
1. Create a MongoDB Atlas account at [mongodb.com](https://mongodb.com)
2. Create a new cluster
3. Get your connection string
4. Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/rentit-cameras?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

### 3. Create Admin User
Since admin registration is disabled for security, you need to manually create an admin user in MongoDB Atlas:

1. Connect to your MongoDB Atlas database
2. Navigate to the `users` collection
3. Insert a new document with this structure:

```json
{
  "email": "admin@rentit.com",
  "password": "$2a$10$hashedPasswordHere",
  "name": "Admin User",
  "role": "admin",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```
{"_id":{"$oid":"68937a1ca5f8ef565ed62a6b"},"email":"admin@rentit.com","password":"use bcryptjs to generate hashed password","name":"Admin User","role":"admin","createdAt":{"$date":{"$numberLong":"1704067200000"}}}
**To generate a hashed password:**
```javascript
const bcrypt = require('bcryptjs');
const hashedPassword = bcrypt.hashSync('your-admin-password', 10);
console.log(hashedPassword);
```

### 4. Start the Application

#### Development Mode (Frontend + Backend)
```bash
npm run dev:full
```

#### Separate Development
```bash
# Terminal 1 - Start backend server
npm run server

# Terminal 2 - Start frontend
npm run dev
```

### 5. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## Usage

###for particle

npm install react-tsparticles tsparticles
npm install @tsparticles/react tsparticles
npm install particles.js

### Admin Access
1. Navigate to the login page
2. Use admin credentials (email: admin@rentit.com, password: your-admin-password)
3. Access the admin dashboard with full product management capabilities

### Client Registration
1. Click "Register here" on the login page
2. Fill in your details (name, email, password)
3. Create your client account
4. Access the client dashboard to browse equipment

### Admin Features
- **Add Products**: Click "Add Product" button
- **Edit Products**: Click the edit icon on any product
- **Delete Products**: Click the delete icon (with confirmation)
- **Search Products**: Use the search bar to filter products
- **View Analytics**: Dashboard shows key metrics

## API Endpoints

### Authentication
- `POST /api/register` - Client registration
- `POST /api/login` - User login (admin & client)
- `GET /api/profile` - Get user profile

### Admin Routes (Protected)
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products` - Add new product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

### Client Routes
- `GET /api/products` - Get available products

## Security Features

- **JWT Authentication**: Secure token-based sessions
- **Password Hashing**: bcrypt encryption
- **Role-based Access**: Admin-only routes protected
- **Input Validation**: Form validation and sanitization
- **CORS Enabled**: Cross-origin resource sharing

## Contributing

We welcome contributions to improve Rentit Cameras! Here's how you can contribute:

1. **Report Bugs**: Open an issue with detailed steps to reproduce
2. **Suggest Features**: Share your ideas for new features
3. **Submit Pull Requests**: Follow these steps:
   - Fork the repository
   - Create a feature branch (`git checkout -b feature/AmazingFeature`)
   - Commit your changes (`git commit -m 'Add some AmazingFeature'`)
   - Push to the branch (`git push origin feature/AmazingFeature`)
   - Open a Pull Request

## Troubleshooting

### Common Issues

1. **Connection to MongoDB Atlas fails**
   - Verify your MongoDB Atlas IP whitelist
   - Check if your connection string is correct
   - Ensure your network allows outbound connections to MongoDB Atlas (port 27017)

2. **JWT Authentication issues**
   - Verify JWT_SECRET in .env matches between server restarts
   - Check token expiration time
   - Ensure proper Authorization header format: `Bearer <token>`

3. **Frontend not connecting to backend**
   - Verify the API base URL in your frontend configuration
   - Check CORS settings in the backend
   - Make sure both frontend and backend are running

## Future Enhancements

Planned features and improvements:

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Equipment availability calendar
- [ ] User reviews and ratings
- [ ] Equipment damage reporting system
- [ ] Advanced search and filtering
- [ ] Email notifications for bookings and returns
- [ ] Mobile application
- [ ] Multi-language support

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Database Schema

### User Collection
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  role: String (enum: ['admin', 'client'], default: 'client'),
  createdAt: Date (default: now)
}
```

### Product Collection
```javascript
{
  name: String (required),
  description: String (required),
  price: Number (required),
  category: String (required),
  imageUrl: String (required),
  stock: Number (required, default: 0),
  isAvailable: Boolean (default: true),
  createdAt: Date (default: now)
}
```

## Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-jwt-secret-key
PORT=5000
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify your connection string in `.env`
   - Check network access in MongoDB Atlas
   - Ensure IP whitelist includes your IP

2. **JWT Token Errors**
   - Verify JWT_SECRET is set in `.env`
   - Check token expiration

3. **CORS Errors**
   - Backend CORS is configured for localhost:5173
   - Update CORS settings if using different ports

4. **Admin Access Denied**
   - Verify admin user exists in database
   - Check role field is set to "admin"
   - Ensure password is properly hashed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Check the troubleshooting section
- Review MongoDB Atlas documentation
- Ensure all dependencies are properly installed #   n e w r e n t i t c a m e r a s v e r i f i c a t i o n f r o n t e n d  
 #   n e w r e n t i t c a m e r a s v e r i f i c a t i o n f r o n t e n d  
 #   n e w r e n t i t c a m e r a s v e r i f i c a t i o n f r o n t e n d  
 
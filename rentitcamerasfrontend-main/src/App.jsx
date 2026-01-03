import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ClientDashboard from './components/main/home/ClientDashboard';
import EquipmentPage from './components/Equipment/EquipmentPage';
import AdminDashboard from './components/admin/AdminDashboard';
// EquipmentPage is the page that displays the equipment
import Home from './components/main/Home';
import Header from './components/Header';
import Support from './components/main/Support';
import About from './components/main/About';
import Collection from './components/main/Collection';
import Loading from './components/Loading';
import ClientVerification from './components/ClientVerification';

function App() {    
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Helper to conditionally render Header only on public pages
  function AppWithConditionalHeader() {
    const location = useLocation();
    // Hide header on /admin routes and /verification (has its own header)
    const hideHeader = location.pathname.startsWith('/admin') || location.pathname.startsWith('/verification');
    const showHeader = !hideHeader;

    return (
      <>
        {showHeader && <Header />}
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<Home />} />
          {/* Equipments page */}
          <Route path="/equipments" element={<EquipmentPage user={user} onLogout={handleLogout} />} />
          {/* Support page */}
          <Route path="/support" element={<Support />} />
          {/* About page */}
          <Route path="/about" element={<About />} />
          {/* Collections page */}
          <Route path="/collection" element={<Collection />} />
          {/* Client Verification page */}
          <Route path="/verification" element={<ClientVerification />} />
          {/* Login/Register */}
          <Route path="/login" element={
            isAuthenticated && user ? (
              <Navigate to={user.role === 'admin' ? '/admin' : '/client'} replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          } />
          <Route path="/register" element={
            isAuthenticated && user ? (
              <Navigate to={user.role === 'admin' ? '/admin' : '/client'} replace />
            ) : (
              <Register onRegister={handleRegister} />
            )
          } />
          {/* Dashboards */}
          <Route path="/admin/*" element={
            isAuthenticated && user && user.role === 'admin' ? (
              <AdminDashboard onLogout={handleLogout} user={user} />
            ) : (
              <Navigate to="/login" replace />
            )
          } />
          <Route path="/client/*" element={
            isAuthenticated && user && user.role !== 'admin' ? (
              <ClientDashboard onLogout={handleLogout} user={user} />
            ) : (
              <Navigate to="/login" replace />
            )
          } />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </>
    );
  }

  if (loading) {
    return <Loading message="Preparing your camera rental experience..." />;
  }

  return (
    <Router>
      <AppWithConditionalHeader />
    </Router>
  );
}

export default App;
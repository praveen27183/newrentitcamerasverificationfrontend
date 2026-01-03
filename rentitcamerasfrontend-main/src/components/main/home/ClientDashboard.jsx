import React, { useState, useEffect } from 'react';
import { LogOut, User } from 'lucide-react';
import CameraRentalHero from './CameraRentalHero';
import FeaturedEquipment from './FeaturedEquipment';
import EquipmentCollections from './EquipmentCollections';
import NotFoundEquipment from '../../NotFoundEquipment';
import HowItWorks from './HowItWorks';
import Testimonials from '../Testimonials';
import StatsBar from './StatsBar';
import BlogSection from './BlogSection';
import Footer from './Footer';
import axios from 'axios';

const ClientDashboard = ({ onLogout, user }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* User Header */}
      <div className="bg-[#1A97A9] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <div className="text-sm">
                <span className="font-medium">Welcome, {user?.name}</span>
                <span className="ml-2 text-white/80">({user?.email})</span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-3 py-1 text-sm bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <CameraRentalHero />
      <FeaturedEquipment />
      <div className="flex justify-center my-8">
        <button className="bg-[#1A97A9] text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-[#167a8a] transition">
          Show All Equipment
        </button>
      </div>
      <EquipmentCollections />
      <NotFoundEquipment />
      <HowItWorks />
      <Testimonials />
      <StatsBar />
      <BlogSection />
      <Footer />
    </div>
  );
};

export default ClientDashboard;

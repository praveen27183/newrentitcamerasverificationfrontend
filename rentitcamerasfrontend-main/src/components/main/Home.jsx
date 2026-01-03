import React, { useState } from 'react';
import CameraRentalHero from './home/CameraRentalHero';
import FeaturedEquipment from './home/FeaturedEquipment';
import EquipmentCollections from './home/EquipmentCollections';
import HowItWorks from './home/HowItWorks';
import Testimonials from './Testimonials';
import StatsBar from './home/StatsBar';
import BlogSection from './home/BlogSection';
import Footer from './home/Footer';
import ChatBot from './home/ChatBot';
import ClientVerification from '../ClientVerification';

const Home = () => {
  const [rentalDays, setRentalDays] = useState(0);
  return (
    <>
      <CameraRentalHero setRentalDays={setRentalDays} />
      <FeaturedEquipment rentalDays={rentalDays} />
      <EquipmentCollections />
      <HowItWorks />
      <Testimonials />
      <StatsBar />
      <BlogSection />
      <ClientVerification hideHeader={true} />
      <Footer />
      <ChatBot />
    </>
  );
};

export default Home; 
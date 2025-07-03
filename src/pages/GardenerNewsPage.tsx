import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GardenerNewsSection from '../components/GardenerNewsSection';

const GardenerNewsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        <GardenerNewsSection />
      </div>
      <Footer />
    </div>
  );
};

export default GardenerNewsPage;
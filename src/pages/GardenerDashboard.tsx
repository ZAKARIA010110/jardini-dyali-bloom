import React from 'react';
import { useAuth } from '@/context/useAuth';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GardenerDashboardContent from '@/components/gardener/GardenerDashboardContent';

const GardenerDashboard: React.FC = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is a gardener
  if (profile?.user_type !== 'gardener') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Navbar />
      <main className="pt-20">
        <GardenerDashboardContent />
      </main>
      <Footer />
    </div>
  );
};

export default GardenerDashboard;

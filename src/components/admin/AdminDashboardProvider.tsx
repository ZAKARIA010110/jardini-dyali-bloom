
import React, { useState, ReactNode } from 'react';
import { AdminDashboardContextType, AdminTab } from '../../types/admin';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { useAdminData } from '../../hooks/useAdminData';
import AdminLoadingState from './AdminLoadingState';
import AdminAccessDenied from './AdminAccessDenied';

const AdminDashboardContext = React.createContext<AdminDashboardContextType | null>(null);

export const useAdminDashboard = () => {
  const context = React.useContext(AdminDashboardContext);
  if (!context) {
    throw new Error('useAdminDashboard must be used within AdminDashboardProvider');
  }
  return context;
};

interface AdminDashboardProviderProps {
  children: ReactNode;
}

export const AdminDashboardProvider: React.FC<AdminDashboardProviderProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  
  const { isAdmin, loading: authLoading, handleLogout } = useAdminAuth();
  const { 
    gardeners, 
    bookings, 
    homeownersCount, 
    averageRating, 
    confirmedBookings, 
    loading: dataLoading 
  } = useAdminData();

  if (authLoading || dataLoading) {
    return <AdminLoadingState />;
  }

  if (!isAdmin) {
    return <AdminAccessDenied />;
  }

  const contextValue: AdminDashboardContextType = {
    activeTab,
    setActiveTab,
    gardeners,
    bookings,
    homeownersCount,
    averageRating,
    confirmedBookings,
    handleLogout,
    loading: dataLoading,
    isAdmin
  };

  return (
    <AdminDashboardContext.Provider value={contextValue}>
      {children}
    </AdminDashboardContext.Provider>
  );
};

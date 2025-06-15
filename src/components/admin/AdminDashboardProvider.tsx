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

  // Always provide context, even when loading or access denied
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

  // Show loading state but keep context available
  if (authLoading || dataLoading) {
    return (
      <AdminDashboardContext.Provider value={contextValue}>
        <AdminLoadingState />
      </AdminDashboardContext.Provider>
    );
  }

  // Show access denied but keep context available
  if (!isAdmin) {
    return (
      <AdminDashboardContext.Provider value={contextValue}>
        <AdminAccessDenied />
      </AdminDashboardContext.Provider>
    );
  }

  return (
    <AdminDashboardContext.Provider value={contextValue}>
      {children}
    </AdminDashboardContext.Provider>
  );
};

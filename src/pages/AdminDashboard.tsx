
import React from 'react';
import { SidebarProvider, SidebarInset } from '../components/ui/sidebar';
import { AdminDashboardProvider, useAdminDashboard } from '../components/admin/AdminDashboardProvider';
import AdminSidebar from '../components/admin/AdminSidebar';
import { AdminDashboardHeader } from '../components/admin/AdminDashboardHeader';
import { AdminTabRenderer } from '../components/admin/AdminTabRenderer';

const AdminDashboardContent: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    handleLogout, 
    homeownersCount, 
    gardeners, 
    bookings 
  } = useAdminDashboard();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
          homeownersCount={homeownersCount}
          gardenersCount={gardeners.length}
          bookingsCount={bookings.length}
        />
        <SidebarInset>
          <AdminDashboardHeader />
          <main className="p-4 lg:p-6">
            <AdminTabRenderer />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

const AdminDashboard: React.FC = () => {
  return (
    <AdminDashboardProvider>
      <AdminDashboardContent />
    </AdminDashboardProvider>
  );
};

export default AdminDashboard;

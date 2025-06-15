
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
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex">
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
          homeownersCount={homeownersCount}
          gardenersCount={gardeners.length}
          bookingsCount={bookings.length}
        />
        <SidebarInset className="flex-1 min-w-0">
          <div className="flex flex-col h-full">
            <AdminDashboardHeader />
            <main className="flex-1 p-4 lg:p-6 overflow-auto">
              <div className="max-w-full">
                <AdminTabRenderer />
              </div>
            </main>
          </div>
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

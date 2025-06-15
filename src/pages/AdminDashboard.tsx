
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
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <SidebarProvider defaultOpen={false}>
        <div className="flex min-h-screen w-full">
          {/* Main Content Area */}
          <SidebarInset className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">
            <AdminDashboardHeader />
            <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto">
              <div className="max-w-7xl mx-auto w-full">
                <AdminTabRenderer />
              </div>
            </main>
          </SidebarInset>
          
          {/* Sidebar positioned on the right for RTL */}
          <AdminSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onLogout={handleLogout}
            homeownersCount={homeownersCount}
            gardenersCount={gardeners.length}
            bookingsCount={bookings.length}
          />
        </div>
      </SidebarProvider>
    </div>
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

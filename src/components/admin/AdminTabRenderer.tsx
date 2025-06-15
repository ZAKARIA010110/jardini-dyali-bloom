
import React from 'react';
import { useAdminDashboard } from './AdminDashboardProvider';
import AdminHeader from './AdminHeader';
import AdminStatsGrid from './AdminStatsGrid';
import AdminTabContent from './AdminTabContent';
import HomeownersTab from './HomeownersTab';
import AnalyticsTab from './AnalyticsTab';
import SettingsTab from './SettingsTab';

export const AdminTabRenderer: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    gardeners, 
    bookings, 
    averageRating, 
    confirmedBookings 
  } = useAdminDashboard();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <AdminHeader 
              gardenersCount={gardeners.length}
              bookingsCount={bookings.length}
            />
            <AdminStatsGrid
              gardenersCount={gardeners.length}
              bookingsCount={bookings.length}
              averageRating={averageRating}
              confirmedBookings={confirmedBookings}
            />
            <AdminTabContent
              activeTab={'gardeners'}
              setActiveTab={() => setActiveTab('gardeners')}
              gardeners={gardeners}
              bookings={bookings}
            />
          </div>
        );
      case 'homeowners':
        return <HomeownersTab />;
      case 'gardeners':
        return (
          <AdminTabContent
            activeTab={'gardeners'}
            setActiveTab={() => {}}
            gardeners={gardeners}
            bookings={bookings}
          />
        );
      case 'bookings':
        return (
          <AdminTabContent
            activeTab={'bookings'}
            setActiveTab={() => {}}
            gardeners={gardeners}
            bookings={bookings}
          />
        );
      case 'chat':
        return (
          <AdminTabContent
            activeTab={'chat'}
            setActiveTab={() => {}}
            gardeners={gardeners}
            bookings={bookings}
          />
        );
      case 'analytics':
        return <AnalyticsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return null;
    }
  };

  return <>{renderTabContent()}</>;
};

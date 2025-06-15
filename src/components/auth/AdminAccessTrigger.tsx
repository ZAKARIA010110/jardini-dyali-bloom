
import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import AdminLoginForm from './AdminLoginForm';

const AdminAccessTrigger: React.FC = () => {
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleTriggerClick = () => {
    setClickCount(prev => prev + 1);
    
    // Show admin form after 3 clicks for security
    if (clickCount >= 2) {
      setShowAdminForm(true);
      setClickCount(0);
    }

    // Reset click count after 3 seconds
    setTimeout(() => setClickCount(0), 3000);
  };

  return (
    <>
      {/* Subtle admin trigger button */}
      <button
        onClick={handleTriggerClick}
        className="fixed bottom-4 left-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200 opacity-30 hover:opacity-60 z-10"
        title={clickCount > 0 ? `انقر ${3 - clickCount} مرات أخرى` : 'وصول المشرف'}
      >
        <Settings className="w-4 h-4 text-gray-600" />
      </button>

      {/* Admin login form modal */}
      <AdminLoginForm 
        isVisible={showAdminForm}
        onClose={() => setShowAdminForm(false)}
      />
    </>
  );
};

export default AdminAccessTrigger;

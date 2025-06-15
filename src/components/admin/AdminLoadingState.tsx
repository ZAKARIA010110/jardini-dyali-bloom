
import React from 'react';

const AdminLoadingState = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">جاري التحميل...</p>
      </div>
    </div>
  );
};

export default AdminLoadingState;

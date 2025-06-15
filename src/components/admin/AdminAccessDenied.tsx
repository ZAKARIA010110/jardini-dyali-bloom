
import React from 'react';
import { Button } from '../ui/button';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminAccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md border border-emerald-100">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">غير مصرح لك بالوصول</h2>
        <p className="text-gray-600 mb-6">هذه الصفحة مخصصة للمدراء فقط</p>
        <Button 
          onClick={() => navigate('/login')} 
          className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg"
        >
          تسجيل الدخول كمدير
        </Button>
      </div>
    </div>
  );
};

export default AdminAccessDenied;

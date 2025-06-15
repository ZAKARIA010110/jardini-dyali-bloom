
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { User, LogOut, CheckCircle, XCircle } from 'lucide-react';
import { useAuthState } from '../../hooks/useAuthState';

interface AuthStatusCardProps {
  showLogout?: boolean;
  showDetails?: boolean;
}

const AuthStatusCard: React.FC<AuthStatusCardProps> = ({ 
  showLogout = true, 
  showDetails = true 
}) => {
  const { user, handleLogout } = useAuthState();

  return (
    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center text-green-800">
          <User className="w-5 h-5 ml-2" />
          حالة المصادقة
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Auth Status */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          {user ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-medium">مسجل دخول</span>
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-700 font-medium">غير مسجل دخول</span>
            </>
          )}
        </div>

        {/* User Details */}
        {user && showDetails && (
          <div className="space-y-2 p-3 bg-white rounded-lg border border-green-100">
            <div className="text-sm">
              <span className="font-medium text-gray-700">البريد الإلكتروني: </span>
              <span className="text-gray-600">{user.email}</span>
            </div>
            {user.name && (
              <div className="text-sm">
                <span className="font-medium text-gray-700">الاسم: </span>
                <span className="text-gray-600">{user.name}</span>
              </div>
            )}
            <div className="text-sm">
              <span className="font-medium text-gray-700">نوع المستخدم: </span>
              <span className="text-gray-600">صاحب منزل</span>
            </div>
          </div>
        )}

        {/* Logout Button */}
        {user && showLogout && (
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-red-200 text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 ml-2" />
            تسجيل الخروج
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthStatusCard;

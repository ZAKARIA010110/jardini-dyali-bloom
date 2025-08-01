
import React, { useState } from 'react';
import { useAuth } from '../context/useAuth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoginHeader from '../components/auth/LoginHeader';
import ConnectionStatus from '../components/auth/ConnectionStatus';
import LoginForm from '../components/auth/LoginForm';
import ForgotPasswordLink from '../components/auth/ForgotPasswordLink';
import SignupLink from '../components/auth/SignupLink';
import AdminAccessTrigger from '../components/auth/AdminAccessTrigger';

const LoginPage = () => {
  const [isRetrying, setIsRetrying] = useState(false);
  const { loading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navbar />
      
      <div className="pt-20 pb-8 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <LoginHeader />

          {/* Connection Status */}
          <ConnectionStatus isRetrying={isRetrying} setIsRetrying={setIsRetrying} />

          {/* Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
              {/* Login Form Component */}
              <LoginForm />

              {/* Forgot Password */}
              <ForgotPasswordLink />
            </div>

            {/* Sign Up Link */}
            <SignupLink />
          </div>
        </div>
      </div>

      {/* Admin Access Trigger - Subtle gear icon in corner */}
      <AdminAccessTrigger />
      
      <Footer />
    </div>
  );
};

export default LoginPage;

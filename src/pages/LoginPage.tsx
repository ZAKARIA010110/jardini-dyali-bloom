
import React, { useState } from 'react';
import { useAuth } from '../context/useAuth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoginHeader from '../components/auth/LoginHeader';
import ConnectionStatus from '../components/auth/ConnectionStatus';
import LoginForm from '../components/auth/LoginForm';
import ForgotPasswordLink from '../components/auth/ForgotPasswordLink';
import AdminDevButtons from '../components/auth/AdminDevButtons';
import SignupLink from '../components/auth/SignupLink';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
              {/* Email */}
              <div>
                <label htmlFor="email" className="text-gray-700 font-medium block mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-2 text-right px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                  placeholder="example@email.com"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="text-gray-700 font-medium block mb-2">
                  كلمة المرور
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-2 text-right px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* Forgot Password */}
              <ForgotPasswordLink />

              {/* Login Form Component */}
              <LoginForm />

              {/* Admin Development Buttons */}
              <AdminDevButtons 
                loading={loading}
                isRetrying={isRetrying}
                setEmail={setEmail}
                setPassword={setPassword}
              />
            </div>

            {/* Sign Up Link */}
            <SignupLink />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LoginPage;

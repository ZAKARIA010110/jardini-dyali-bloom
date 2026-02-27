import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/useAuth';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from './ui/button';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    navigate('/');
  };

  const getDashboardLink = () => {
    if (profile?.user_type === 'gardener') {
      return '/gardener-dashboard';
    } else if (profile?.user_type === 'admin') {
      return '/admin';
    }
    return '/dashboard';
  };

  const getDashboardLabel = () => {
    if (profile?.user_type === 'gardener') {
      return 'لوحة التحكم';
    } else if (profile?.user_type === 'admin') {
      return 'لوحة الإدارة';
    }
    return 'لوحة التحكم';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img 
              src="/lovable-uploads/beceec2b-ac95-439a-806f-b0827e74d969.png" 
              alt="Jardini Dyali Logo" 
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            <Link to="/news" className="text-gray-700 hover:text-[#4CAF50] transition-colors">
              اخر الأخبار
            </Link>
            <Link to="/gardeners" className="text-gray-700 hover:text-[#4CAF50] transition-colors">
              البستانيون
            </Link>
            <Link to="/become-gardener" className="text-gray-700 hover:text-[#4CAF50] transition-colors font-medium">
              كن بستانياً
            </Link>
            <Link to="/garden-analysis" className="text-gray-700 hover:text-[#4CAF50] transition-colors">
              تحليل الحديقة
            </Link>
            <Link to="/faq" className="text-gray-700 hover:text-[#4CAF50] transition-colors">
              الأسئلة الشائعة
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-[#4CAF50] transition-colors">
              اتصل بنا
            </Link>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            <LanguageSwitcher />
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} 
                  className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-[#4CAF50] rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">{user.name || user.email.split('@')[0]}</span>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    {/* User Info */}
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name || user.email.split('@')[0]}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                        {profile?.user_type === 'gardener' ? 'بستاني' : 
                         profile?.user_type === 'admin' ? 'مدير' : 'صاحب منزل'}
                      </span>
                    </div>
                    
                    {/* Dashboard Link */}
                    <Link 
                      to={getDashboardLink()} 
                      className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors" 
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>{getDashboardLabel()}</span>
                    </Link>

                    {/* Profile Link */}
                    <Link 
                      to={profile?.user_type === 'gardener' ? '/gardener-profile' : '/profile'} 
                      className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors" 
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>{profile?.user_type === 'gardener' ? 'ملفي الشخصي' : t('nav.profile')}</span>
                    </Link>

                    {/* Logout */}
                    <button 
                      onClick={handleLogout} 
                      className="w-full flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">{t('nav.login')}</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-[#4CAF50] hover:bg-[#45a049]">{t('nav.signup')}</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link to="/news" className="text-gray-700 hover:text-[#4CAF50] transition-colors" onClick={() => setIsMenuOpen(false)}>
                اخر الأخبار
              </Link>
              <Link to="/gardeners" className="text-gray-700 hover:text-[#4CAF50] transition-colors" onClick={() => setIsMenuOpen(false)}>
                البستانيون
              </Link>
              <Link to="/become-gardener" className="text-gray-700 hover:text-[#4CAF50] transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
                كن بستانياً
              </Link>
              <Link to="/garden-analysis" className="text-gray-700 hover:text-[#4CAF50] transition-colors" onClick={() => setIsMenuOpen(false)}>
                تحليل الحديقة
              </Link>
              <Link to="/faq" className="text-gray-700 hover:text-[#4CAF50] transition-colors" onClick={() => setIsMenuOpen(false)}>
                الأسئلة الشائعة
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-[#4CAF50] transition-colors" onClick={() => setIsMenuOpen(false)}>
                اتصل بنا
              </Link>
              
              {user ? (
                <div className="pt-4 border-t border-gray-200 space-y-4">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <div className="w-8 h-8 bg-[#4CAF50] rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="text-gray-700 font-medium block">{user.name || user.email.split('@')[0]}</span>
                      <span className="text-xs text-gray-500">
                        {profile?.user_type === 'gardener' ? 'بستاني' : 
                         profile?.user_type === 'admin' ? 'مدير' : 'صاحب منزل'}
                      </span>
                    </div>
                  </div>
                  
                  <Link 
                    to={getDashboardLink()} 
                    className="flex items-center gap-2 text-[#4CAF50] font-medium hover:text-[#45a049] transition-colors" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    {getDashboardLabel()}
                  </Link>
                  
                  <Link to={profile?.user_type === 'gardener' ? '/gardener-profile' : '/profile'} className="text-gray-700 hover:text-[#4CAF50] transition-colors" onClick={() => setIsMenuOpen(false)}>
                    {profile?.user_type === 'gardener' ? 'ملفي الشخصي' : t('nav.profile')}
                  </Link>
                  
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }} 
                    className="text-red-600 hover:text-red-700 transition-colors text-left"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200 space-y-4">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full">{t('nav.login')}</Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-[#4CAF50] hover:bg-[#45a049]">{t('nav.signup')}</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/useAuth';
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const { t, language } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    navigate('/');
  };

  const navigationText = {
    ar: {
      home: 'الرئيسية',
      gardeners: 'البستانيون',
      becomeGardener: 'كن بستانياً',
      contact: 'اتصل بنا',
      faq: 'الأسئلة الشائعة',
      more: 'المزيد',
      profile: 'الملف الشخصي',
      logout: 'تسجيل الخروج',
      login: 'تسجيل الدخول',
      signup: 'إنشاء حساب'
    },
    fr: {
      home: 'Accueil',
      gardeners: 'Jardiniers',
      becomeGardener: 'Devenir jardinier',
      contact: 'Contact',
      faq: 'FAQ',
      more: 'Plus',
      profile: 'Profil',
      logout: 'Déconnexion',
      login: 'Connexion',
      signup: 'S\'inscrire'
    }
  };

  const nav = navigationText[language as 'ar' | 'fr'] || navigationText.ar;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-8 h-8 bg-[#4CAF50] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">ج</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Jardini Dyali</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            <Link to="/" className="text-gray-700 hover:text-[#4CAF50] transition-colors">
              {nav.home}
            </Link>
            <Link to="/gardeners" className="text-gray-700 hover:text-[#4CAF50] transition-colors">
              {nav.gardeners}
            </Link>
            <Link to="/become-gardener" className="text-gray-700 hover:text-[#4CAF50] transition-colors">
              {nav.becomeGardener}
            </Link>
            
            {/* More Menu */}
            <div className="relative">
              <button
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className="flex items-center space-x-1 rtl:space-x-reverse text-gray-700 hover:text-[#4CAF50] transition-colors"
              >
                <span>{nav.more}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isMoreMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <Link
                    to="/contact"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMoreMenuOpen(false)}
                  >
                    {nav.contact}
                  </Link>
                  <Link
                    to="/faq"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMoreMenuOpen(false)}
                  >
                    {nav.faq}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
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
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>{nav.profile}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{nav.logout}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">{nav.login}</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-[#4CAF50] hover:bg-[#45a049]">{nav.signup}</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-[#4CAF50] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {nav.home}
              </Link>
              <Link 
                to="/gardeners" 
                className="text-gray-700 hover:text-[#4CAF50] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {nav.gardeners}
              </Link>
              <Link 
                to="/become-gardener" 
                className="text-gray-700 hover:text-[#4CAF50] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {nav.becomeGardener}
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-700 hover:text-[#4CAF50] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {nav.contact}
              </Link>
              <Link 
                to="/faq" 
                className="text-gray-700 hover:text-[#4CAF50] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {nav.faq}
              </Link>
              
              {user ? (
                <div className="pt-4 border-t border-gray-200 space-y-4">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <div className="w-8 h-8 bg-[#4CAF50] rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">{user.name || user.email.split('@')[0]}</span>
                  </div>
                  <Link 
                    to="/profile" 
                    className="text-gray-700 hover:text-[#4CAF50] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {nav.profile}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-red-600 hover:text-red-700 transition-colors text-left"
                  >
                    {nav.logout}
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200 space-y-4">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full">{nav.login}</Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-[#4CAF50] hover:bg-[#45a049]">{nav.signup}</Button>
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

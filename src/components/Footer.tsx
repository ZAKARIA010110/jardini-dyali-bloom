
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-6">
              <div className="w-10 h-10 bg-[#4CAF50] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">ج</span>
              </div>
              <span className="text-2xl font-bold">Jardini Dyali</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
              منصة مغربية رائدة تربط أصحاب المنازل بأفضل البستانيين المحترفين. 
              نساعدك في تحويل حديقتك إلى واحة خضراء جميلة.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Mail className="w-5 h-5 text-[#4CAF50]" />
                <span className="text-gray-400">info@jardinidyali.ma</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Phone className="w-5 h-5 text-[#4CAF50]" />
                <span className="text-gray-400">+212 5XX-XXXXXX</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <MapPin className="w-5 h-5 text-[#4CAF50]" />
                <span className="text-gray-400">الرباط، المغرب</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6">{t('footer.services')}</h3>
            <div className="space-y-3">
              <Link to="/services/design" className="block text-gray-400 hover:text-[#4CAF50] transition-colors">
                تصميم الحدائق
              </Link>
              <Link to="/services/lawn-care" className="block text-gray-400 hover:text-[#4CAF50] transition-colors">
                العناية بالعشب
              </Link>
              <Link to="/services/planting" className="block text-gray-400 hover:text-[#4CAF50] transition-colors">
                الزراعة والغرس
              </Link>
              <Link to="/services/maintenance" className="block text-gray-400 hover:text-[#4CAF50] transition-colors">
                الصيانة الدورية
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-6">{t('footer.about')}</h3>
            <div className="space-y-3">
              <Link to="/about" className="block text-gray-400 hover:text-[#4CAF50] transition-colors">
                من نحن
              </Link>
              <Link to="/how-it-works" className="block text-gray-400 hover:text-[#4CAF50] transition-colors">
                كيف نعمل
              </Link>
              <Link to="/contact" className="block text-gray-400 hover:text-[#4CAF50] transition-colors">
                {t('footer.contact')}
              </Link>
              <Link to="/faq" className="block text-gray-400 hover:text-[#4CAF50] transition-colors">
                {t('nav.faq')}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Jardini Dyali. {t('footer.rights')}
            </p>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <span className="text-gray-400 text-sm">{t('footer.follow')}:</span>
              <a href="#" className="text-gray-400 hover:text-[#4CAF50] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#4CAF50] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#4CAF50] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

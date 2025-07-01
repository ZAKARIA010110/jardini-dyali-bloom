
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/button';
import { Sparkles, Leaf, Users, Award } from 'lucide-react';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="pt-20 pb-16 bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 min-h-screen flex items-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-start order-1 lg:order-1">
            <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 ml-2" />
              منصة البستنة الأولى في المغرب
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                جارديني ديالي
              </span>
              <br />
              حديقتك أحلى مع الخبراء
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0 animate-fade-in">
              اكتشف أفضل البستانيين المحترفين في منطقتك واحصل على خدمات البستنة عالية الجودة لتحويل حديقتك إلى واحة خضراء
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8 animate-fade-in">
              <Link to="/gardeners">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  طلب بستاني
                </Button>
              </Link>
              <Link to="/become-gardener">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  انضم كبستاني
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-gray-200 animate-fade-in">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 text-green-600 ml-1" />
                  <div className="text-2xl font-bold text-green-600">500+</div>
                </div>
                <div className="text-sm text-gray-600">بستاني محترف</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="w-5 h-5 text-green-600 ml-1" />
                  <div className="text-2xl font-bold text-green-600">2000+</div>
                </div>
                <div className="text-sm text-gray-600">عميل سعيد</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Leaf className="w-5 h-5 text-green-600 ml-1" />
                  <div className="text-2xl font-bold text-green-600">5000+</div>
                </div>
                <div className="text-sm text-gray-600">مشروع مكتمل</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Sparkles className="w-5 h-5 text-green-600 ml-1" />
                  <div className="text-2xl font-bold text-green-600">12</div>
                </div>
                <div className="text-sm text-gray-600">مدينة مغربية</div>
              </div>
            </div>
          </div>

          {/* Enhanced Image with uploaded gardeners photo */}
          <div className="relative order-2 lg:order-2">
            <div className="relative group">
              {/* Main image container */}
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-green-400 via-emerald-400 to-green-600 p-8 shadow-2xl transform group-hover:scale-105 transition-all duration-500">
                <div className="w-full h-full rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                  <img 
                    alt="فريق البستانيين المحترفين - جارديني ديالي" 
                    className="w-full h-full object-cover rounded-2xl transform group-hover:scale-110 transition-transform duration-700" 
                    src="/lovable-uploads/f8dcc078-0f78-4334-95da-bd012d0c5551.png" 
                  />
                </div>
              </div>
              
              {/* Floating cards */}
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 animate-float">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-800">متاح الآن</span>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 animate-float-delayed">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="flex text-yellow-400">
                    {'★★★★★'.split('').map((star, i) => <span key={i} className="text-sm">{star}</span>)}
                  </div>
                  <span className="text-sm font-semibold text-gray-800">5.0</span>
                </div>
              </div>
            </div>
            
            {/* Background decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-300 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-emerald-200 rounded-full opacity-40 animate-pulse animation-delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

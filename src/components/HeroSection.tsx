
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/button';
import { Sparkles, Leaf, Users, Award } from 'lucide-react';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="pt-20 pb-16 bg-gradient-to-br from-green-400 via-green-500 to-green-600 min-h-screen flex items-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center text-white">
          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
            ابدأ رحلتك مع جارديني ديالي اليوم
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 leading-relaxed max-w-4xl mx-auto animate-fade-in opacity-90">
            انضم إلى آلاف العملاء والبستانيين الذين يثقون في منصتنا لتحقيق أحلامهم الخضراء
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-in">
            <input 
              type="text" 
              placeholder="ابحث عن بستاني في منطقتك..."
              className="px-6 py-4 rounded-full text-gray-800 text-lg w-full sm:w-96 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg"
            />
            <Link to="/become-gardener">
              <Button size="lg" className="w-full sm:w-auto bg-white text-green-600 hover:bg-gray-100 font-bold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-full">
                انضم كا بستاني
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 max-w-4xl mx-auto">
            <p className="text-white/80 mb-6 text-lg">يثق بنا أكثر من</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">12</div>
                <div className="text-white/80 text-lg">مدينة مغربية</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">+500</div>
                <div className="text-white/80 text-lg">بستاني محترف</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">+2000</div>
                <div className="text-white/80 text-lg">عميل سعيد</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

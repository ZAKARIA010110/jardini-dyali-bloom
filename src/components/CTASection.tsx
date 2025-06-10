
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/button';

const CTASection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-r from-[#4CAF50] to-[#A5D6A7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6">
            ابدأ رحلتك مع جارديني ديالي اليوم
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            انضم إلى آلاف العملاء والبستانيين الذين يثقون في منصتنا لتحقيق أحلامهم الخضراء
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-white text-[#4CAF50] hover:bg-gray-100 font-semibold px-8 py-4 text-lg"
              >
                انضم كصاحب منزل
              </Button>
            </Link>
            <Link to="/become-gardener">
              <Button 
                size="lg" 
                variant="outline"
                className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-[#4CAF50] font-semibold px-8 py-4 text-lg"
              >
                انضم كبستاني
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-white/80 mb-4">يثق بنا أكثر من</p>
            <div className="flex justify-center items-center space-x-8 rtl:space-x-reverse">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">2000+</div>
                <div className="text-white/80 text-sm">عميل سعيد</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-white/80 text-sm">بستاني محترف</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">12</div>
                <div className="text-white/80 text-sm">مدينة مغربية</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

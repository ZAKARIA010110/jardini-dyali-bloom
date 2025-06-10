
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/button';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="pt-20 pb-16 bg-gradient-to-br from-green-50 to-emerald-50 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-start">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
              {t('hero.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/gardeners">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-[#4CAF50] hover:bg-[#45a049] text-white font-semibold px-8 py-4 text-lg"
                >
                  {t('hero.cta.homeowner')}
                </Button>
              </Link>
              <Link to="/become-gardener">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white font-semibold px-8 py-4 text-lg"
                >
                  {t('hero.cta.gardener')}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#4CAF50]">500+</div>
                <div className="text-sm text-gray-600">{t('stats.gardeners')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#4CAF50]">2000+</div>
                <div className="text-sm text-gray-600">{t('stats.clients')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#4CAF50]">5000+</div>
                <div className="text-sm text-gray-600">{t('stats.projects')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#4CAF50]">12</div>
                <div className="text-sm text-gray-600">{t('stats.cities')}</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-[#4CAF50] to-[#A5D6A7] p-8 shadow-2xl">
              <div className="w-full h-full rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80" 
                  alt="Beautiful garden landscape"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#A5D6A7] rounded-full opacity-60"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-green-200 rounded-full opacity-40"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/button';
const CTASection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-16 bg-gradient-to-r from-primary to-primary-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          هل أنت جاهز للبدء؟
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          انضم إلى آلاف العملاء الراضين واحصل على أفضل خدمات البستنة
        </p>
        <Link to="/request-gardener">
          <Button variant="secondary" size="lg" className="font-semibold">
            ابدأ الآن
          </Button>
        </Link>
      </div>
    </section>
  );
};
export default CTASection;
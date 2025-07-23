import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/button';
const CTASection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="bg-gradient-to-r from-primary to-primary-foreground py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          {t('cta.title')}
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          {t('cta.description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              {t('cta.getStarted')}
            </Button>
          </Link>
          <Link to="/contact">
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-primary">
              {t('cta.contactUs')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
export default CTASection;

import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import HowItWorksSection from '../components/HowItWorksSection';
import TestimonialsSection from '../components/TestimonialsSection';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';
import LanguageSwitcher from '../components/LanguageSwitcher';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
      <LanguageSwitcher />
    </div>
  );
};

export default Index;

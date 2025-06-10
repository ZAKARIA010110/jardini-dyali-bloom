
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Palette, Scissors, Flower } from 'lucide-react';

const ServicesSection = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: <Palette className="w-12 h-12 text-[#4CAF50]" />,
      title: t('services.design.title'),
      description: t('services.design.desc'),
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80"
    },
    {
      icon: <Scissors className="w-12 h-12 text-[#4CAF50]" />,
      title: t('services.lawn.title'),
      description: t('services.lawn.desc'),
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=400&q=80"
    },
    {
      icon: <Flower className="w-12 h-12 text-[#4CAF50]" />,
      title: t('services.planting.title'),
      description: t('services.planting.desc'),
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=400&q=80"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            {t('services.title')}
          </h2>
          <div className="w-24 h-1 bg-[#4CAF50] mx-auto rounded-full"></div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="flex items-center space-x-4 rtl:space-x-reverse mb-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                </div>
                
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
                
                {/* Features */}
                <div className="mt-6 space-y-2">
                  {['✓ خدمة احترافية', '✓ ضمان الجودة', '✓ أسعار منافسة'].map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-600">
                      <span className="text-[#4CAF50] font-bold">{feature.split(' ')[0]}</span>
                      <span>{feature.split(' ').slice(1).join(' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

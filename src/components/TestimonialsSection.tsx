import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Star } from 'lucide-react';
const TestimonialsSection = () => {
  const {
    t
  } = useLanguage();
  const testimonials = [{
    name: 'أحمد بن محمد',
    location: 'الرباط',
    text: 'خدمة ممتازة! البستاني كان محترف جداً وحديقتي أصبحت أجمل من أي وقت مضى. أنصح بشدة بجارديني ديالي.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  }, {
    name: 'فاطمة الزهراء',
    location: 'الدار البيضاء',
    text: 'لقد وجدت أفضل بستاني في منطقتي بفضل هذه المنصة. العمل كان دقيق والسعر معقول جداً.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b515?auto=format&fit=crop&w=150&q=80'
  }, {
    name: 'يوسف العلوي',
    location: 'مراكش',
    text: 'كبستاني، هذه المنصة ساعدتني في الحصول على عملاء جدد وزيادة دخلي. شكراً جارديني ديالي!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
  }];
  return <section className="py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Background decorative elements */}
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full ml-2 animate-pulse"></div>
            تقييمات حقيقية من عملائنا
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              {t('testimonials.title')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => <div key={index} className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 border border-white/20 transform hover:-translate-y-2">
              {/* Quote icon */}
              <div className="text-6xl text-green-200 font-serif mb-4">"</div>

              {/* Rating */}
              <div className="flex items-center space-x-1 rtl:space-x-reverse mb-6">
                {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 animate-pulse animation-delay-500" />)}
                <span className="text-sm text-gray-500 mr-2">({testimonial.rating}.0)</span>
              </div>

              {/* Comment */}
              <p className="text-gray-700 mb-8 leading-relaxed text-lg italic">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center space-x-4 rtl:space-x-reverse pt-6 border-t border-gray-100">
                <div className="relative">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-14 h-14 rounded-full object-cover ring-4 ring-green-100 group-hover:ring-green-200 transition-all duration-300" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600 flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full ml-2"></div>
                    {testimonial.location}
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-6">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  {t('testimonials.service.quality')}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                  {t('testimonials.professional')}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  {t('testimonials.price.fair')}
                </span>
              </div>
            </div>)}
        </div>

        {/* Call to action */}
        
      </div>
    </section>;
};
export default TestimonialsSection;
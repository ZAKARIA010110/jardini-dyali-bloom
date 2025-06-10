
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const { language } = useLanguage();

  const testimonials = [
    {
      name: 'أحمد بن محمد',
      location: 'الرباط',
      text: 'خدمة ممتازة! البستاني كان محترف جداً وحديقتي أصبحت أجمل من أي وقت مضى. أنصح بشدة بجارديني ديالي.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'فاطمة الزهراء',
      location: 'الدار البيضاء',
      text: 'لقد وجدت أفضل بستاني في منطقتي بفضل هذه المنصة. العمل كان دقيق والسعر معقول جداً.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b515?auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'يوسف العلوي',
      location: 'مراكش',
      text: 'كبستاني، هذه المنصة ساعدتني في الحصول على عملاء جدد وزيادة دخلي. شكراً جارديني ديالي!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            آراء عملائنا
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            اكتشف ما يقوله عملاؤنا عن تجربتهم مع جارديني ديالي
          </p>
          <div className="w-24 h-1 bg-[#4CAF50] mx-auto rounded-full mt-6"></div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              {/* Rating */}
              <div className="flex items-center space-x-1 rtl:space-x-reverse mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <img 
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

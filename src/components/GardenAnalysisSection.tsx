
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/button';
import { Camera, Upload } from 'lucide-react';

const GardenAnalysisSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#4CAF50] rounded-full mb-6">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              تحليل حديقة الزبون
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              قم برفع صورة حديقتك لتحصل على تقييم فوري ونصائح خاصة بها من خبرائنا المتخصصين
            </p>
            <div className="w-24 h-1 bg-[#4CAF50] mx-auto rounded-full mt-6"></div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Upload className="w-6 h-6 text-[#4CAF50]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">رفع سهل</h3>
              <p className="text-gray-600 text-sm">
                ارفع صورة حديقتك بضغطة واحدة من هاتفك أو جهازك
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-lg">AI</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">تحليل ذكي</h3>
              <p className="text-gray-600 text-sm">
                تحليل فوري بالذكاء الاصطناعي لحالة النباتات والتربة
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600 font-bold text-lg">✓</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">نصائح مخصصة</h3>
              <p className="text-gray-600 text-sm">
                احصل على نصائح مخصصة لتحسين حديقتك وعلاج المشاكل
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="space-y-4">
            <Button 
              size="lg" 
              className="bg-[#4CAF50] hover:bg-[#45a049] text-white font-semibold px-12 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Camera className="w-5 h-5 ml-2" />
              ابدأ التحليل الآن
            </Button>
            <p className="text-sm text-gray-500">
              مجاني تماماً • نتائج فورية • خصوصية محمية
            </p>
          </div>

          {/* Visual Elements */}
          <div className="mt-16 relative">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-60">
              <img 
                src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=200&q=80"
                alt="Garden 1"
                className="rounded-lg object-cover h-24 w-full"
              />
              <img 
                src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=200&q=80"
                alt="Garden 2"
                className="rounded-lg object-cover h-24 w-full"
              />
              <img 
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=200&q=80"
                alt="Garden 3"
                className="rounded-lg object-cover h-24 w-full"
              />
              <img 
                src="https://images.unsplash.com/photo-1574263867128-0945c1c2f8d6?auto=format&fit=crop&w=200&q=80"
                alt="Garden 4"
                className="rounded-lg object-cover h-24 w-full"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-green-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GardenAnalysisSection;

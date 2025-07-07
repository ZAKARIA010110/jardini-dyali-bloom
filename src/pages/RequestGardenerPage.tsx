import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Megaphone, Users, MapPin, Clock, Star, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LanguageSwitcher from '../components/LanguageSwitcher';

const RequestGardenerPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                طلب خدمات البستنة
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                اختر الطريقة المناسبة لك للحصول على خدمات البستنة المحترفة
              </p>
            </div>
          </div>
        </div>

        {/* Options Cards */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* First Option: Post Job Announcement */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Megaphone className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  نشر إعلان وظيفة
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  انشر احتياجاتك للبستنة ودع البستانيين المحترفين في منطقتك يتقدمون بعروضهم
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">يصل إعلانك لجميع البستانيين في منطقتك</span>
                </div>
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">تلقي عروض أسعار متنوعة</span>
                </div>
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">اختيار أفضل عرض يناسب ميزانيتك</span>
                </div>
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">توفير الوقت والجهد</span>
                </div>
              </div>

              {/* Process Steps */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">كيف يعمل:</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">1</span>
                    <span>اكتب تفاصيل مشروعك</span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">2</span>
                    <span>تلقي عروض من البستانيين</span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">3</span>
                    <span>اختيار العرض المناسب</span>
                  </div>
                </div>
              </div>

              <Link to="/job-postings" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-lg">
                  نشر إعلان وظيفة
                </Button>
              </Link>
            </div>

            {/* Second Option: Choose Specific Gardener */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  اختيار بستاني محدد
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  تصفح قائمة البستانيين المحترفين واختر من يناسب احتياجاتك مباشرة
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">مراجعة ملفات شخصية مفصلة</span>
                </div>
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">قراءة تقييمات العملاء السابقين</span>
                </div>
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">معرفة أسعار واضحة ومحددة</span>
                </div>
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">حجز مباشر مع البستاني</span>
                </div>
              </div>

              {/* Process Steps */}
              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">كيف يعمل:</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">1</span>
                    <span>تصفح قائمة البستانيين</span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">2</span>
                    <span>اختر البستاني المناسب</span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">3</span>
                    <span>احجز موعد مباشرة</span>
                  </div>
                </div>
              </div>

              <Link to="/gardeners" className="block">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 text-lg">
                  تصفح البستانيين
                </Button>
              </Link>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="mt-16 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                لماذا تختار خدماتنا؟
              </h3>
              <p className="text-gray-600">نوفر لك أفضل تجربة للحصول على خدمات البستنة المحترفة</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">جودة مضمونة</h4>
                <p className="text-gray-600 text-sm">جميع البستانيين معتمدون ومختارون بعناية</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">سرعة في الاستجابة</h4>
                <p className="text-gray-600 text-sm">نضمن لك الحصول على رد سريع على طلباتك</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">تغطية شاملة</h4>
                <p className="text-gray-600 text-sm">خدماتنا متوفرة في جميع أنحاء المغرب</p>
              </div>
            </div>
          </div>

          {/* Back Link */}
          <div className="mt-8 text-center">
            <Link 
              to="/" 
              className="inline-flex items-center space-x-2 rtl:space-x-reverse text-gray-600 hover:text-green-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>العودة إلى الصفحة الرئيسية</span>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
      <LanguageSwitcher />
    </div>
  );
};

export default RequestGardenerPage;
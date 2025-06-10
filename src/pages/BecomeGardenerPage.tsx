
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/button';
import { CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LanguageSwitcher from '../components/LanguageSwitcher';

const BecomeGardenerPage = () => {
  const { t } = useLanguage();

  const benefits = [
    'زيادة دخلك من خلال العمل في مجال البستنة',
    'جدول عمل مرن يناسب احتياجاتك',
    'الوصول إلى عملاء جدد في منطقتك',
    'الحصول على تقييمات وآراء من العملاء',
    'منصة سهلة الاستخدام لإدارة طلباتك',
    'دعم فني متواصل من فريق جارديني ديالي'
  ];

  const steps = [
    {
      number: 1,
      title: 'أنشئ حسابك',
      description: 'سجل كبستاني محترف وأكمل ملفك الشخصي'
    },
    {
      number: 2,
      title: 'أضف خبراتك وخدماتك',
      description: 'حدد تخصصاتك وخدماتك وأسعارك ومنطقة عملك'
    },
    {
      number: 3,
      title: 'استقبل الطلبات',
      description: 'تلقى طلبات من العملاء في منطقتك وابدأ في كسب المال'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              كن جزءاً من شبكة البستانيين في جارديني ديالي
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              انضم إلى مئات البستانيين المحترفين وابدأ في زيادة دخلك وتوسيع نطاق عملك
            </p>
            
            <Link to="/signup">
              <Button 
                size="lg" 
                className="bg-[#4CAF50] hover:bg-[#45a049] text-white font-semibold px-8 py-4 text-lg"
              >
                سجل كبستاني الآن
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              لماذا تنضم كبستاني؟
            </h2>
            <div className="w-24 h-1 bg-[#4CAF50] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4 rtl:space-x-reverse">
                <CheckCircle className="flex-shrink-0 w-6 h-6 text-[#4CAF50]" />
                <p className="text-lg text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              كيف تبدأ؟
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              ثلاث خطوات بسيطة تفصلك عن بدء عملك كبستاني محترف
            </p>
            <div className="w-24 h-1 bg-[#4CAF50] mx-auto rounded-full mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div 
                key={step.number}
                className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-[#4CAF50] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-2xl">{step.number}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/signup">
              <Button className="bg-[#4CAF50] hover:bg-[#45a049] text-white font-semibold px-8 py-3 text-lg">
                ابدأ الآن
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              بستانيون نجحوا معنا
            </h2>
            <div className="w-24 h-1 bg-[#4CAF50] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center space-x-4 rtl:space-x-reverse mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80" 
                  alt="محمد" 
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-gray-900">محمد الطنجاوي</h4>
                  <p className="text-sm text-gray-600">بستاني منذ 2021</p>
                </div>
              </div>
              <p className="text-gray-700">
                "انضممت لجارديني ديالي منذ سنتين، وتضاعف دخلي بشكل كبير. المنصة سهلت علي الوصول إلى عملاء جدد والتعامل معهم بشكل احترافي."
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center space-x-4 rtl:space-x-reverse mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80" 
                  alt="آمنة" 
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-gray-900">آمنة الأندلسي</h4>
                  <p className="text-sm text-gray-600">بستانية منذ 2022</p>
                </div>
              </div>
              <p className="text-gray-700">
                "أحب مرونة العمل التي توفرها لي المنصة. يمكنني تحديد ساعات عملي ومناطق التغطية، والأهم من ذلك التواصل المباشر مع العملاء."
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center space-x-4 rtl:space-x-reverse mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80" 
                  alt="يوسف" 
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-gray-900">يوسف العلوي</h4>
                  <p className="text-sm text-gray-600">بستاني منذ 2020</p>
                </div>
              </div>
              <p className="text-gray-700">
                "أصبح لدي الآن أكثر من 150 عميلاً راضياً بفضل جارديني ديالي. المنصة توفر لي كل الأدوات اللازمة لإدارة أعمالي بكفاءة."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#4CAF50]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            ابدأ رحلتك المهنية كبستاني محترف اليوم
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            انضم إلى مجتمع البستانيين المحترفين واستفد من فرص العمل المتاحة
          </p>
          
          <Link to="/signup">
            <Button 
              size="lg" 
              className="bg-white text-[#4CAF50] hover:bg-gray-100 font-semibold px-8 py-4 text-lg"
            >
              سجل الآن
            </Button>
          </Link>
        </div>
      </section>
      
      <Footer />
      <LanguageSwitcher />
    </div>
  );
};

export default BecomeGardenerPage;

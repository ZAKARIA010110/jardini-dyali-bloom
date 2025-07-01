
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Search, UserCheck, Calendar, FileText, Mail, Wallet } from 'lucide-react';

const HowItWorksSection = () => {
  const { t } = useLanguage();

  const homeownerSteps = [
    {
      icon: <Search className="w-8 h-8 text-white" />,
      title: t('how.homeowner.step1'),
      description: t('how.homeowner.step1.desc')
    },
    {
      icon: <UserCheck className="w-8 h-8 text-white" />,
      title: t('how.homeowner.step2'),
      description: t('how.homeowner.step2.desc')
    },
    {
      icon: <Calendar className="w-8 h-8 text-white" />,
      title: t('how.homeowner.step3'),
      description: t('how.homeowner.step3.desc')
    }
  ];

  const gardenerSteps = [
    {
      icon: <FileText className="w-8 h-8 text-white" />,
      title: t('how.gardener.step1'),
      description: t('how.gardener.step1.desc')
    },
    {
      icon: <Mail className="w-8 h-8 text-white" />,
      title: t('how.gardener.step2'),
      description: t('how.gardener.step2.desc')
    },
    {
      icon: <Wallet className="w-8 h-8 text-white" />,
      title: t('how.gardener.step3'),
      description: t('how.gardener.step3.desc')
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-green-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-bounce animation-delay-1000"></div>
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-bounce animation-delay-3000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 animate-pulse"></div>
            عملية بسيطة وسريعة
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
              {t('how.title')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ثلاث خطوات بسيطة للحصول على أفضل خدمات البستنة أو لتقديم خدماتك كبستاني محترف
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Homeowners */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="text-center mb-8">
              <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center ml-2">
                  <Search className="w-4 h-4 text-white" />
                </div>
                {t('how.homeowner.title')}
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {t('how.homeowner.title')}
              </h3>
            </div>
            <div className="space-y-6">
              {homeownerSteps.map((step, index) => (
                <div key={index} className="group">
                  <div className="flex items-start space-x-4 rtl:space-x-reverse p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 group-hover:shadow-lg transition-all duration-300">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-bold text-lg">{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h4>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gardeners */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="text-center mb-8">
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center ml-2">
                  <UserCheck className="w-4 h-4 text-white" />
                </div>
                {t('how.gardener.title')}
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {t('how.gardener.title')}
              </h3>
            </div>
            <div className="space-y-6">
              {gardenerSteps.map((step, index) => (
                <div key={index} className="group">
                  <div className="flex items-start space-x-4 rtl:space-x-reverse p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 group-hover:shadow-lg transition-all duration-300">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-bold text-lg">{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h4>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

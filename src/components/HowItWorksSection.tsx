
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
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            {t('how.title')}
          </h2>
          <div className="w-24 h-1 bg-[#4CAF50] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Homeowners */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              {t('how.homeowner.title')}
            </h3>
            <div className="space-y-6">
              {homeownerSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4 rtl:space-x-reverse">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#4CAF50] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h4>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gardeners */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              {t('how.gardener.title')}
            </h3>
            <div className="space-y-6">
              {gardenerSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4 rtl:space-x-reverse">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#A5D6A7] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h4>
                    <p className="text-gray-600">{step.description}</p>
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

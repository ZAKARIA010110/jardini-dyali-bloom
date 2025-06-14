
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQPage = () => {
  const { language } = useLanguage();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqData = {
    ar: {
      title: 'الأسئلة الشائعة',
      subtitle: 'أجوبة على أكثر الأسئلة تكراراً',
      faqs: [
        {
          question: 'ما هي خدمات جارديني ديالي؟',
          answer: 'نحن منصة تربط أصحاب المنازل بالبستانيين المحترفين. نوفر خدمات تصميم الحدائق، العناية بالعشب، الزراعة والغرس، والصيانة الدورية للحدائق.'
        },
        {
          question: 'كيف يمكنني حجز بستاني؟',
          answer: 'يمكنك تصفح قائمة البستانيين المتاحين، مراجعة ملفاتهم الشخصية وتقييماتهم، ثم حجز الخدمة المطلوبة مباشرة من خلال المنصة.'
        },
        {
          question: 'هل البستانيون مؤهلون؟',
          answer: 'نعم، جميع البستانيين على منصتنا مؤهلون ومدربون. نتحقق من خبراتهم ومهاراتهم قبل قبولهم في المنصة.'
        },
        {
          question: 'ما هي تكلفة الخدمات؟',
          answer: 'تختلف الأسعار حسب نوع الخدمة وحجم العمل. يمكنك مراجعة الأسعار مع البستاني المختار قبل تأكيد الحجز.'
        },
        {
          question: 'هل يمكنني إلغاء الحجز؟',
          answer: 'نعم، يمكنك إلغاء الحجز قبل 24 ساعة من موعد الخدمة بدون أي رسوم إضافية.'
        },
        {
          question: 'كيف يمكنني أن أصبح بستانياً على المنصة؟',
          answer: 'يمكنك التسجيل كبستاني من خلال صفحة "كن بستانياً"، وسنقوم بمراجعة طلبك والتواصل معك لإكمال عملية التسجيل.'
        }
      ]
    },
    fr: {
      title: 'Questions fréquemment posées',
      subtitle: 'Réponses aux questions les plus courantes',
      faqs: [
        {
          question: 'Quels sont les services de Jardini Dyali ?',
          answer: 'Nous sommes une plateforme qui connecte les propriétaires avec des jardiniers professionnels. Nous offrons la conception de jardins, l\'entretien de pelouse, la plantation et l\'entretien régulier des jardins.'
        },
        {
          question: 'Comment puis-je réserver un jardinier ?',
          answer: 'Vous pouvez parcourir la liste des jardiniers disponibles, consulter leurs profils et évaluations, puis réserver le service requis directement via la plateforme.'
        },
        {
          question: 'Les jardiniers sont-ils qualifiés ?',
          answer: 'Oui, tous les jardiniers sur notre plateforme sont qualifiés et formés. Nous vérifions leur expérience et leurs compétences avant de les accepter sur la plateforme.'
        },
        {
          question: 'Quel est le coût des services ?',
          answer: 'Les prix varient selon le type de service et l\'ampleur du travail. Vous pouvez discuter des prix avec le jardinier choisi avant de confirmer la réservation.'
        },
        {
          question: 'Puis-je annuler ma réservation ?',
          answer: 'Oui, vous pouvez annuler votre réservation 24 heures avant le rendez-vous sans frais supplémentaires.'
        },
        {
          question: 'Comment puis-je devenir jardinier sur la plateforme ?',
          answer: 'Vous pouvez vous inscrire comme jardinier via la page "Devenir jardinier", et nous examinerons votre demande et vous contacterons pour finaliser le processus d\'inscription.'
        }
      ]
    }
  };

  const content = faqData[language as 'ar' | 'fr'] || faqData.ar;

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{content.title}</h1>
            <p className="text-xl text-gray-600">{content.subtitle}</p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {content.faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                >
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  {openFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-[#4CAF50] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                
                {openFAQ === index && (
                  <div className="px-8 pb-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-16 bg-[#4CAF50] rounded-xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              {language === 'ar' ? 'لم تجد إجابة سؤالك؟' : 'Vous ne trouvez pas la réponse à votre question ?'}
            </h2>
            <p className="text-lg mb-6">
              {language === 'ar' ? 'تواصل معنا وسنكون سعداء لمساعدتك' : 'Contactez-nous et nous serons heureux de vous aider'}
            </p>
            <a
              href="/contact"
              className="inline-block bg-white text-[#4CAF50] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              {language === 'ar' ? 'اتصل بنا' : 'Nous contacter'}
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQPage;

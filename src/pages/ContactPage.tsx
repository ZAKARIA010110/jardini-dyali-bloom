
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from "@/hooks/use-toast";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactPage = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: language === 'ar' ? 'تم إرسال الرسالة' : 'Message envoyé',
      description: language === 'ar' ? 'سنتواصل معك قريباً' : 'Nous vous répondrons bientôt'
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = {
    ar: {
      title: 'اتصل بنا',
      subtitle: 'نحن هنا للمساعدة',
      description: 'تواصل معنا لأي استفسار أو طلب خدمة',
      form: {
        name: 'الاسم الكامل',
        email: 'البريد الإلكتروني',
        subject: 'الموضوع',
        message: 'الرسالة',
        send: 'إرسال الرسالة'
      },
      info: {
        address: 'الرباط، المغرب',
        phone: '+212 5XX-XXXXXX',
        email: 'info@jardinidyali.ma'
      }
    },
    fr: {
      title: 'Nous contacter',
      subtitle: 'Nous sommes là pour vous aider',
      description: 'Contactez-nous pour toute question ou demande de service',
      form: {
        name: 'Nom complet',
        email: 'Adresse e-mail',
        subject: 'Sujet',
        message: 'Message',
        send: 'Envoyer le message'
      },
      info: {
        address: 'Rabat, Maroc',
        phone: '+212 5XX-XXXXXX',
        email: 'info@jardinidyali.ma'
      }
    }
  };

  const content = contactInfo[language as 'ar' | 'fr'] || contactInfo.ar;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{content.title}</h1>
            <p className="text-xl text-gray-600 mb-2">{content.subtitle}</p>
            <p className="text-gray-500">{content.description}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {language === 'ar' ? 'معلومات الاتصال' : 'Informations de contact'}
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="w-12 h-12 bg-[#4CAF50] rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {language === 'ar' ? 'العنوان' : 'Adresse'}
                      </h3>
                      <p className="text-gray-600">{content.info.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="w-12 h-12 bg-[#4CAF50] rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {language === 'ar' ? 'الهاتف' : 'Téléphone'}
                      </h3>
                      <p className="text-gray-600">{content.info.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="w-12 h-12 bg-[#4CAF50] rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {language === 'ar' ? 'البريد الإلكتروني' : 'E-mail'}
                      </h3>
                      <p className="text-gray-600">{content.info.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {language === 'ar' ? 'أرسل لنا رسالة' : 'Envoyez-nous un message'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {content.form.name}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {content.form.email}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {content.form.subject}
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {content.form.message}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 rtl:space-x-reverse"
                >
                  <Send className="w-5 h-5" />
                  <span>{content.form.send}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;

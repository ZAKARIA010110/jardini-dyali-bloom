import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useGardenerApplication } from '../hooks/useGardenerApplication';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Upload, Camera } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LanguageSwitcher from '../components/LanguageSwitcher';

const BecomeGardenerPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { submitApplication, uploadAvatar, loading } = useGardenerApplication();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    name: '',
    email: '',
    phone: '',
    
    // Professional Info
    city: '',
    experience: '',
    daily_rate: '',
    bio: '',
    services: [] as string[],
    languages: [] as string[],
    
    // Profile Image
    avatar: null as File | null,
    avatarPreview: ''
  });

  const availableServices = [
    'تصميم الحدائق',
    'العناية بالعشب',
    'الزراعة والغرس',
    'تقليم الأشجار',
    'نظم الري',
    'صيانة الحدائق'
  ];

  const availableLanguages = [
    'العربية',
    'الفرنسية',
    'الإنجليزية',
    'الأمازيغية'
  ];

  const cities = [
    'الرباط',
    'الدار البيضاء',
    'فاس',
    'مراكش',
    'أكادير',
    'طنجة',
    'مكناس',
    'وجدة',
    'القنيطرة',
    'تطوان'
  ];

  const experienceLevels = [
    '1-2 سنوات',
    '3-5 سنوات',
    '6-10 سنوات',
    'أكثر من 10 سنوات'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        toast.error('حجم الصورة كبير جداً. الحد الأقصى 5 ميجابايت');
        return;
      }
      
      setFormData({
        ...formData,
        avatar: file,
        avatarPreview: URL.createObjectURL(file)
      });
    }
  };

  const handleServiceToggle = (service: string) => {
    const updatedServices = formData.services.includes(service)
      ? formData.services.filter(s => s !== service)
      : [...formData.services, service];
    
    setFormData({
      ...formData,
      services: updatedServices
    });
  };

  const handleLanguageToggle = (language: string) => {
    const updatedLanguages = formData.languages.includes(language)
      ? formData.languages.filter(l => l !== language)
      : [...formData.languages, language];
    
    setFormData({
      ...formData,
      languages: updatedLanguages
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.city || 
        !formData.experience || !formData.daily_rate || !formData.bio) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    if (formData.services.length === 0) {
      toast.error('يرجى اختيار خدمة واحدة على الأقل');
      return;
    }

    if (formData.languages.length === 0) {
      toast.error('يرجى اختيار لغة واحدة على الأقل');
      return;
    }

    let avatarUrl = '';
    if (formData.avatar) {
      const uploadedUrl = await uploadAvatar(formData.avatar);
      if (uploadedUrl) {
        avatarUrl = uploadedUrl;
      }
    }

    const applicationData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      experience: formData.experience,
      daily_rate: parseInt(formData.daily_rate),
      bio: formData.bio,
      services: formData.services,
      languages: formData.languages,
      avatar_url: avatarUrl
    };

    const success = await submitApplication(applicationData);
    if (success) {
      setStep(2); // Show success step
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              انضم كبستاني محترف
            </h1>
            <p className="text-xl text-gray-600">
              ابدأ في تقديم خدماتك وزيادة دخلك مع جارديني ديالي
            </p>
          </div>

          {/* Application Form */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                معلومات التسجيل
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Image */}
                <div className="text-center">
                  <Label className="text-gray-700 font-medium block mb-4">
                    صورة الملف الشخصي
                  </Label>
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden border-4 border-green-100">
                        {formData.avatarPreview ? (
                          <img 
                            src={formData.avatarPreview} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Camera className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <label 
                        htmlFor="avatar"
                        className="absolute bottom-0 right-0 w-10 h-10 bg-[#4CAF50] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#45a049] transition-colors"
                      >
                        <Upload className="w-5 h-5 text-white" />
                        <input
                          id="avatar"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">اختر صورة واضحة لملفك الشخصي</p>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-gray-700 font-medium">
                      الاسم الكامل *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-2 text-right"
                      placeholder="أدخل اسمك الكامل"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-700 font-medium">
                      البريد الإلكتروني *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-2 text-right"
                      placeholder="example@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone" className="text-gray-700 font-medium">
                      رقم الهاتف *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-2 text-right"
                      placeholder="06XXXXXXXX"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="city" className="text-gray-700 font-medium">
                      المدينة *
                    </Label>
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4CAF50] focus:border-[#4CAF50] text-right"
                      required
                    >
                      <option value="">اختر المدينة</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="experience" className="text-gray-700 font-medium">
                      سنوات الخبرة *
                    </Label>
                    <select
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4CAF50] focus:border-[#4CAF50] text-right"
                      required
                    >
                      <option value="">اختر سنوات الخبرة</option>
                      {experienceLevels.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="daily_rate" className="text-gray-700 font-medium">
                      السعر باليوم الواحد (درهم) *
                    </Label>
                    <Input
                      id="daily_rate"
                      name="daily_rate"
                      type="number"
                      value={formData.daily_rate}
                      onChange={handleInputChange}
                      className="mt-2 text-right"
                      placeholder="مثال: 500"
                      min="200"
                      max="5000"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio" className="text-gray-700 font-medium">
                    نبذة عنك *
                  </Label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4CAF50] focus:border-[#4CAF50] text-right"
                    placeholder="اكتب نبذة مختصرة عن خبرتك وتخصصك في البستنة..."
                    required
                  />
                </div>

                {/* Services */}
                <div>
                  <Label className="text-gray-700 font-medium block mb-3">
                    الخدمات التي تقدمها * (اختر واحدة أو أكثر)
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableServices.map((service) => (
                      <label 
                        key={service}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.services.includes(service)
                            ? 'border-[#4CAF50] bg-green-50 text-[#4CAF50]'
                            : 'border-gray-300 hover:border-[#4CAF50]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.services.includes(service)}
                          onChange={() => handleServiceToggle(service)}
                          className="hidden"
                        />
                        <span className="text-sm font-medium text-right">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <Label className="text-gray-700 font-medium block mb-3">
                    اللغات التي تتحدث بها * (اختر واحدة أو أكثر)
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {availableLanguages.map((language) => (
                      <label 
                        key={language}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.languages.includes(language)
                            ? 'border-[#4CAF50] bg-green-50 text-[#4CAF50]'
                            : 'border-gray-300 hover:border-[#4CAF50]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.languages.includes(language)}
                          onChange={() => handleLanguageToggle(language)}
                          className="hidden"
                        />
                        <span className="text-sm font-medium text-right">{language}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-800 text-sm">
                    <strong>ملاحظة:</strong> سيتم مراجعة طلبك من قبل فريقنا خلال 24 ساعة. 
                    ستتلقى إشعاراً على بريدك الإلكتروني بمجرد الموافقة على طلبك أو رفضه.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white font-semibold py-3 text-lg"
                >
                  {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
                </Button>
              </form>
            </div>
          )}

          {/* Success Step */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-10 h-10 bg-[#4CAF50] rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl">✓</span>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                تم إرسال طلبك بنجاح!
              </h2>
              <p className="text-gray-600 mb-6">
                شكراً لك! تم إرسال طلب انضمامك كبستاني محترف. 
                سيتم مراجعة طلبك من قبل فريقنا خلال 24 ساعة وستتلقى إشعاراً على بريدك الإلكتروني بالنتيجة.
              </p>
              
              <Link to="/">
                <Button className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-6 py-3">
                  العودة إلى الصفحة الرئيسية
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <LanguageSwitcher />
    </div>
  );
};

export default BecomeGardenerPage;

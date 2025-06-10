
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Upload, Eye, EyeOff, Camera } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LanguageSwitcher from '../components/LanguageSwitcher';

const BecomeGardenerPage = () => {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    
    // Professional Info
    city: '',
    experience: '',
    hourlyRate: '',
    bio: '',
    services: [] as string[],
    languages: [] as string[],
    
    // Profile Image
    avatar: null as File | null,
    avatarPreview: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.phone) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('كلمة المرور غير متطابقة');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('كلمة المرور يجب أن تكون على الأقل 6 أحرف');
      return;
    }

    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.city || !formData.experience || !formData.hourlyRate || !formData.bio) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
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

    setStep(3);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate account creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('تم إنشاء حسابك بنجاح! سيتم مراجعة طلبك خلال 24 ساعة');
      setStep(4);
    } catch (error) {
      toast.error('حدث خطأ في إنشاء الحساب');
    } finally {
      setLoading(false);
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

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse mb-4">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= stepNum ? 'bg-[#4CAF50] text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step > stepNum ? 'bg-[#4CAF50]' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center text-sm text-gray-600">
              {step === 1 && 'المعلومات الشخصية'}
              {step === 2 && 'المعلومات المهنية'}
              {step === 3 && 'المراجعة والتأكيد'}
            </div>
          </div>

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                المعلومات الشخصية
              </h2>
              
              <form onSubmit={handleStep1Submit} className="space-y-6">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="password" className="text-gray-700 font-medium">
                      كلمة المرور *
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        className="text-right pr-12"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                      تأكيد كلمة المرور *
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="text-right pr-12"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white font-semibold py-3 text-lg"
                >
                  التالي
                </Button>
              </form>
            </div>
          )}

          {/* Step 2: Professional Information */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                المعلومات المهنية
              </h2>
              
              <form onSubmit={handleStep2Submit} className="space-y-6">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>

                <div>
                  <Label htmlFor="hourlyRate" className="text-gray-700 font-medium">
                    السعر بالساعة (درهم) *
                  </Label>
                  <Input
                    id="hourlyRate"
                    name="hourlyRate"
                    type="number"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    className="mt-2 text-right"
                    placeholder="مثال: 150"
                    min="50"
                    max="1000"
                    required
                  />
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

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 border-gray-300 text-gray-700"
                  >
                    السابق
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[#4CAF50] hover:bg-[#45a049] text-white font-semibold py-3"
                  >
                    التالي
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3: Review and Confirm */}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                مراجعة المعلومات
              </h2>
              
              <div className="space-y-6">
                {/* Profile Preview */}
                <div className="flex items-center space-x-6 rtl:space-x-reverse p-6 bg-gray-50 rounded-lg">
                  <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden">
                    {formData.avatarPreview ? (
                      <img 
                        src={formData.avatarPreview} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{formData.name}</h3>
                    <p className="text-gray-600">{formData.city}</p>
                    <p className="text-[#4CAF50] font-semibold">{formData.hourlyRate} درهم/ساعة</p>
                  </div>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">المعلومات الشخصية:</h4>
                    <ul className="space-y-1 text-gray-700">
                      <li>الاسم: {formData.name}</li>
                      <li>البريد الإلكتروني: {formData.email}</li>
                      <li>الهاتف: {formData.phone}</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">المعلومات المهنية:</h4>
                    <ul className="space-y-1 text-gray-700">
                      <li>المدينة: {formData.city}</li>
                      <li>الخبرة: {formData.experience}</li>
                      <li>السعر: {formData.hourlyRate} درهم/ساعة</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">النبذة:</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{formData.bio}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">الخدمات:</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.services.map((service) => (
                      <span key={service} className="bg-green-50 text-[#4CAF50] px-3 py-1 rounded-full text-sm">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">اللغات:</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.languages.map((language) => (
                      <span key={language} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">
                        {language}
                      </span>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleFinalSubmit}>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-yellow-800 text-sm">
                      <strong>ملاحظة:</strong> سيتم مراجعة طلبك من قبل فريقنا خلال 24 ساعة. 
                      ستتلقى بريداً إلكترونياً بمجرد الموافقة على طلبك.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="flex-1 border-gray-300 text-gray-700"
                    >
                      السابق
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-[#4CAF50] hover:bg-[#45a049] text-white font-semibold py-3"
                    >
                      {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
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
                شكراً لك {formData.name}! تم إرسال طلب انضمامك كبستاني محترف. 
                سيتم مراجعة طلبك من قبل فريقنا خلال 24 ساعة وستتلقى بريداً إلكترونياً بالنتيجة.
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

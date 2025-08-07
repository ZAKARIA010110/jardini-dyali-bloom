import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, MapPin, Calendar, DollarSign } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useToast } from '../components/ui/use-toast';

const PostJobPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    budget: '',
    serviceType: '',
    urgency: '',
    contactInfo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.location) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "تم نشر الإعلان بنجاح!",
        description: "سيتم التواصل معك من قبل البستانيين المهتمين قريباً",
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        location: '',
        budget: '',
        serviceType: '',
        urgency: '',
        contactInfo: ''
      });
    } catch (error) {
      toast({
        title: "خطأ في النشر",
        description: "حدث خطأ أثناء نشر الإعلان. يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-16">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                نشر إعلان وظيفة جديد
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                اكتب تفاصيل مشروع البستنة وستحصل على عروض من البستانيين المحترفين
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">تفاصيل المشروع</CardTitle>
              <CardDescription>
                يرجى ملء المعلومات التالية لمساعدة البستانيين على فهم احتياجاتك
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Job Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان المشروع *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="مثال: تنسيق حديقة منزلية"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وصف المشروع *
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="اشرح تفاصيل المشروع، نوع النباتات المطلوبة، المساحة، والخدمات المحددة..."
                    rows={6}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      الموقع *
                    </label>
                    <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                      <SelectTrigger disabled={isSubmitting}>
                        <SelectValue placeholder="اختر المدينة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casablanca">الدار البيضاء</SelectItem>
                        <SelectItem value="rabat">الرباط</SelectItem>
                        <SelectItem value="marrakech">مراكش</SelectItem>
                        <SelectItem value="fez">فاس</SelectItem>
                        <SelectItem value="tangier">طنجة</SelectItem>
                        <SelectItem value="agadir">أكادير</SelectItem>
                        <SelectItem value="meknes">مكناس</SelectItem>
                        <SelectItem value="oujda">وجدة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Service Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نوع الخدمة
                    </label>
                    <Select value={formData.serviceType} onValueChange={(value) => handleInputChange('serviceType', value)}>
                      <SelectTrigger disabled={isSubmitting}>
                        <SelectValue placeholder="اختر نوع الخدمة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="design">تصميم حدائق</SelectItem>
                        <SelectItem value="maintenance">صيانة دورية</SelectItem>
                        <SelectItem value="installation">زراعة وتركيب</SelectItem>
                        <SelectItem value="consultation">استشارة</SelectItem>
                        <SelectItem value="other">أخرى</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Budget */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      الميزانية المتوقعة (درهم)
                    </label>
                    <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                      <SelectTrigger disabled={isSubmitting}>
                        <SelectValue placeholder="اختر النطاق السعري" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-1000">أقل من 1,000 درهم</SelectItem>
                        <SelectItem value="1000-3000">1,000 - 3,000 درهم</SelectItem>
                        <SelectItem value="3000-5000">3,000 - 5,000 درهم</SelectItem>
                        <SelectItem value="5000-10000">5,000 - 10,000 درهم</SelectItem>
                        <SelectItem value="over-10000">أكثر من 10,000 درهم</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Urgency */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      الأولوية
                    </label>
                    <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                      <SelectTrigger disabled={isSubmitting}>
                        <SelectValue placeholder="متى تحتاج الخدمة؟" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgent">عاجل (خلال أسبوع)</SelectItem>
                        <SelectItem value="soon">قريباً (خلال شهر)</SelectItem>
                        <SelectItem value="flexible">مرن (في أي وقت)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    معلومات الاتصال
                  </label>
                  <Input
                    value={formData.contactInfo}
                    onChange={(e) => handleInputChange('contactInfo', e.target.value)}
                    placeholder="رقم الهاتف أو البريد الإلكتروني للتواصل"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? 'جاري النشر...' : 'نشر الإعلان'}
                  </Button>
                  <Link to="/request-gardener" className="flex-1">
                    <Button type="button" variant="outline" className="w-full" disabled={isSubmitting}>
                      إلغاء
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Back Link */}
          <div className="mt-8 text-center">
            <Link 
              to="/request-gardener" 
              className="inline-flex items-center space-x-2 rtl:space-x-reverse text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>العودة إلى خيارات الطلب</span>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
      <LanguageSwitcher />
    </div>
  );
};

export default PostJobPage;
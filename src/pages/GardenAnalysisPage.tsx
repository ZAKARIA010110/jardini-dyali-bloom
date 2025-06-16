
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Camera, Upload, CheckCircle, Sparkles, Leaf, Eye, FileImage } from 'lucide-react';

const GardenAnalysisPage = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    if (selectedImage) {
      setIsAnalyzing(true);
      // هنا يمكن إضافة منطق التحليل الفعلي
      setTimeout(() => {
        setIsAnalyzing(false);
        // عرض النتائج
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-8 shadow-lg">
              <Camera className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                تحليل حديقة الزبون
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
              احصل على تحليل فوري ومفصل لحديقتك باستخدام تقنيات الذكاء الاصطناعي المتطورة
              واكتشف كيف يمكن تحسين جمال ونمو نباتاتك
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
          </div>

          {/* Main Analysis Card */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="p-8 md:p-12">
                {!selectedImage ? (
                  <div className="text-center">
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 mb-8 hover:border-green-400 transition-colors duration-300">
                      <div className="flex flex-col items-center space-y-6">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                          <Upload className="w-12 h-12 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">ارفع صورة حديقتك</h3>
                          <p className="text-gray-600">اختر صورة واضحة وعالية الجودة لحديقتك للحصول على أفضل النتائج</p>
                        </div>
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                          />
                          <Button 
                            size="lg" 
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                          >
                            <FileImage className="w-5 h-5 ml-2" />
                            اختر صورة
                          </Button>
                        </label>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Image Preview */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                          <Eye className="w-5 h-5 ml-2 text-green-600" />
                          معاينة الصورة
                        </h3>
                        <div className="relative">
                          <img
                            src={imagePreview!}
                            alt="Garden preview"
                            className="w-full h-64 object-cover rounded-xl shadow-lg"
                          />
                          <div className="absolute top-3 right-3">
                            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                              <CheckCircle className="w-4 h-4 ml-1" />
                              جاهز للتحليل
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Analysis Options */}
                      <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                          <Sparkles className="w-5 h-5 ml-2 text-green-600" />
                          خيارات التحليل
                        </h3>
                        
                        <div className="space-y-4">
                          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">تحليل حالة النباتات</h4>
                                <p className="text-sm text-gray-600">فحص صحة النباتات وتحديد المشاكل</p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">تقييم التربة</h4>
                                <p className="text-sm text-gray-600">تحليل جودة التربة ومستوى الري</p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">اقتراحات التحسين</h4>
                                <p className="text-sm text-gray-600">نصائح مخصصة لتطوير الحديقة</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 border-t border-gray-200">
                      <Button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        size="lg"
                        className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-12 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isAnalyzing ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                            جاري التحليل...
                          </>
                        ) : (
                          <>
                            <Camera className="w-5 h-5 ml-2" />
                            ابدأ التحليل الآن
                          </>
                        )}
                      </Button>
                      
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                        <Button 
                          variant="outline" 
                          size="lg"
                          className="w-full sm:w-auto border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold px-8 py-4 text-lg"
                        >
                          <Upload className="w-5 h-5 ml-2" />
                          اختر صورة أخرى
                        </Button>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">تحليل ذكي</h3>
              <p className="text-gray-600">
                استخدام أحدث تقنيات الذكاء الاصطناعي لتحليل دقيق وشامل لحديقتك
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">نصائح مخصصة</h3>
              <p className="text-gray-600">
                احصل على توصيات مخصصة لحديقتك بناءً على نوع النباتات والمناخ المحلي
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">نتائج فورية</h3>
              <p className="text-gray-600">
                احصل على تقرير مفصل خلال دقائق مع خطة عمل واضحة لتحسين حديقتك
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GardenAnalysisPage;

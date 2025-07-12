import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { Camera, Upload, CheckCircle, AlertCircle, RotateCcw, Send, Loader2 } from 'lucide-react';

/**
 * GardenAnalysisForm - A comprehensive form component for garden analysis submission
 * Features:
 * - Image upload with preview
 * - Text description input
 * - Webhook submission
 * - Loading states and validation
 * - Success/error handling
 * - Form reset functionality
 */
const GardenAnalysisForm = () => {
  // State management for form data and UI states
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const { toast } = useToast();

  // Webhook URL for form submission
  const WEBHOOK_URL = 'https://hook.eu2.make.com/fzs21t3jnb9nbl73tippio9jtta29o89';

  /**
   * Handle image file selection and preview generation
   */
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "خطأ في نوع الملف",
          description: "يرجى اختيار صورة صالحة",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "حجم الملف كبير جداً",
          description: "يرجى اختيار صورة أصغر من 10 ميجابايت",
          variant: "destructive",
        });
        return;
      }

      setSelectedImage(file);
      
      // Generate image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Reset submit status when new image is selected
      setSubmitStatus('idle');
    }
  };

  /**
   * Form validation
   */
  const validateForm = (): boolean => {
    if (!description.trim()) {
      toast({
        title: "حقل مطلوب",
        description: "يرجى إدخال وصف للحديقة والتحسينات المطلوبة",
        variant: "destructive",
      });
      return false;
    }
    
    if (description.trim().length < 10) {
      toast({
        title: "وصف قصير جداً",
        description: "يرجى إدخال وصف أكثر تفصيلاً (على الأقل 10 أحرف)",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  /**
   * Handle form submission to webhook
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Prepare form data for multipart submission
      const formData = new FormData();
      formData.append('description', description.trim());
      
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      // Add metadata
      formData.append('timestamp', new Date().toISOString());
      formData.append('source', 'garden-analysis-form');

      // Submit to webhook
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSubmitStatus('success');
        toast({
          title: "تم الإرسال بنجاح",
          description: "تم إرسال طلب تحليل الحديقة، سنتواصل معك قريباً",
        });
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
      toast({
        title: "خطأ في الإرسال",
        description: "حدث خطأ أثناء إرسال البيانات، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Reset form to initial state
   */
  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setDescription('');
    setSubmitStatus('idle');
    
    // Reset file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    
    toast({
      title: "تم إعادة تعيين النموذج",
      description: "يمكنك الآن إدخال بيانات جديدة",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-background rounded-3xl shadow-2xl border border-border overflow-hidden">
        <div className="p-8 md:p-12">
          {/* Form Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Camera className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              تحليل حديقتك
            </h2>
            <p className="text-muted-foreground">
              ارفع صورة واصف حديقتك للحصول على تحليل مخصص ونصائح الخبراء
            </p>
          </div>

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Image Upload Section */}
            <div className="space-y-4">
              <Label htmlFor="image-upload" className="text-lg font-semibold">
                صورة الحديقة (اختيارية)
              </Label>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors duration-300">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">اختر صورة حديقتك</h3>
                      <p className="text-sm text-muted-foreground">
                        PNG, JPG, GIF حتى 10MB
                      </p>
                    </div>
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        disabled={isSubmitting}
                        className="hidden"
                      />
                      <Button 
                        type="button"
                        variant="outline"
                        size="lg"
                        disabled={isSubmitting}
                        className="pointer-events-none"
                      >
                        <Upload className="w-4 h-4 ml-2" />
                        اختر صورة
                      </Button>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Garden preview"
                      className="w-full h-64 object-cover rounded-xl border"
                    />
                    <div className="absolute top-3 right-3">
                      <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center">
                        <CheckCircle className="w-4 h-4 ml-1" />
                        تم رفع الصورة
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <label htmlFor="image-upload-replace" className="cursor-pointer">
                      <input
                        id="image-upload-replace"
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        disabled={isSubmitting}
                        className="hidden"
                      />
                      <Button 
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isSubmitting}
                        className="pointer-events-none"
                      >
                        <Upload className="w-4 h-4 ml-1" />
                        تغيير الصورة
                      </Button>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Description Section */}
            <div className="space-y-4">
              <Label htmlFor="description" className="text-lg font-semibold">
                وصف الحديقة والتحسينات المطلوبة *
              </Label>
              <Textarea
                id="description"
                placeholder="صف حديقتك الحالية وما هي التحسينات التي تريدها... مثال: لدي حديقة صغيرة أمام المنزل، أريد زراعة ورود وأشجار مثمرة، المساحة حوالي 50 متر مربع، التربة طينية..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                className="min-h-[120px] resize-none"
                required
              />
              <p className="text-sm text-muted-foreground">
                الحد الأدنى: 10 أحرف | الحالي: {description.length} حرف
              </p>
            </div>

            {/* Submit Status Messages */}
            {submitStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3 rtl:space-x-reverse">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <h4 className="font-semibold text-green-800">تم الإرسال بنجاح!</h4>
                  <p className="text-sm text-green-700">تم إرسال طلبك، سنتواصل معك خلال 24 ساعة</p>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3 rtl:space-x-reverse">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <h4 className="font-semibold text-red-800">خطأ في الإرسال</h4>
                  <p className="text-sm text-red-700">حدث خطأ، يرجى المحاولة مرة أخرى</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
              <Button
                type="submit"
                disabled={isSubmitting || !description.trim()}
                size="lg"
                className="flex-1 sm:flex-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 ml-2" />
                    إرسال طلب التحليل
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isSubmitting}
                size="lg"
              >
                <RotateCcw className="w-4 h-4 ml-2" />
                إعادة تعيين
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GardenAnalysisForm;
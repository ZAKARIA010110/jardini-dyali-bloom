import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { mockGardeners } from '../data/gardeners';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Star, MapPin, Clock, MessageCircle, Calendar, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LanguageSwitcher from '../components/LanguageSwitcher';

const GardenerProfilePage = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  
  const [showChatModal, setShowChatModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    service: '',
    date: '',
    time: '',
    description: ''
  });

  const gardener = mockGardeners.find(g => g.id === id);

  if (!gardener) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">البستاني غير موجود</h2>
          <Link to="/gardeners">
            <Button className="bg-[#4CAF50] hover:bg-[#45a049]">العودة إلى قائمة البستانيين</Button>
          </Link>
        </div>
      </div>
    );
  }

  const mockReviews = [
    {
      id: '1',
      clientName: 'سعيد الأحمدي',
      rating: 5,
      comment: 'عمل ممتاز! أحمد قام بتصميم حديقة رائعة وكان محترف جداً في التعامل.',
      date: '2024-01-15',
      service: 'تصميم الحدائق'
    },
    {
      id: '2',
      clientName: 'نور الدين',
      rating: 5,
      comment: 'خدمة سريعة وجودة عالية. أنصح به بشدة لأي شخص يحتاج بستاني محترف.',
      date: '2024-01-10',
      service: 'العناية بالعشب'
    },
    {
      id: '3',
      clientName: 'مريم العلوي',
      rating: 4,
      comment: 'راضية عن الخدمة والنتيجة. سأتعامل معه مرة أخرى في المستقبل.',
      date: '2024-01-05',
      service: 'الزراعة'
    }
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingData.service || !bookingData.date || !bookingData.time) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    toast.success('تم إرسال طلب الحجز بنجاح! سيتواصل معك البستاني قريباً.');
    setBookingData({ service: '', date: '', time: '', description: '' });
  };

  const handleChatOpen = () => {
    setShowChatModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link 
              to="/gardeners" 
              className="inline-flex items-center space-x-2 rtl:space-x-reverse text-[#4CAF50] hover:text-[#45a049] mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>العودة إلى قائمة البستانيين</span>
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Profile */}
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Header */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 rtl:md:space-x-reverse">
                  <img
                    src={gardener.avatar}
                    alt={gardener.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-green-100"
                  />
                  
                  <div className="flex-1 text-center md:text-right">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{gardener.name}</h1>
                    
                    <div className="flex items-center justify-center md:justify-start space-x-2 rtl:space-x-reverse text-gray-600 mb-3">
                      <MapPin className="w-5 h-5" />
                      <span>{gardener.location}</span>
                    </div>

                    <div className="flex items-center justify-center md:justify-start space-x-2 rtl:space-x-reverse mb-4">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-900">{gardener.rating}</span>
                      <span className="text-gray-600">({gardener.reviewCount} تقييم)</span>
                      <span className="mx-2">•</span>
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-600">{gardener.experience}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      {gardener.services.map((service, index) => (
                        <span
                          key={index}
                          className="bg-green-50 text-[#4CAF50] px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">نبذة عن البستاني</h3>
                  <p className="text-gray-700 leading-relaxed">{gardener.bio}</p>
                </div>

                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-[#4CAF50]">{gardener.hourlyRate}</div>
                    <div className="text-sm text-gray-600">درهم/ساعة</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{gardener.reviewCount}</div>
                    <div className="text-sm text-gray-600">تقييم</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{gardener.experience}</div>
                    <div className="text-sm text-gray-600">خبرة</div>
                  </div>
                </div>
              </div>

              {/* Reviews */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">آراء العملاء</h3>
                
                <div className="space-y-6">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-start space-x-4 rtl:space-x-reverse">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-lg font-semibold text-gray-600">
                            {review.clientName.charAt(0)}
                          </span>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 rtl:sm:space-x-reverse mb-2">
                            <h4 className="font-semibold text-gray-900">{review.clientName}</h4>
                            <div className="flex items-center space-x-1 rtl:space-x-reverse">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center space-x-2 rtl:space-x-reverse mb-3 text-sm text-gray-600">
                            <span>{new Date(review.date).toLocaleDateString('ar-MA')}</span>
                            <span>•</span>
                            <span className="bg-green-50 text-[#4CAF50] px-2 py-0.5 rounded-full">
                              {review.service}
                            </span>
                          </div>
                          
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Booking Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">احجز خدمة مع {gardener.name}</h3>
                  <p className="text-gray-600">احجز الآن وسيتم التواصل معك خلال 24 ساعة</p>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white font-semibold py-3 text-lg flex items-center justify-center space-x-2 rtl:space-x-reverse mb-4">
                      <Calendar className="w-5 h-5" />
                      <span>احجز الآن</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-gray-900 text-right">حجز خدمة مع {gardener.name}</DialogTitle>
                    </DialogHeader>
                    
                    <form onSubmit={handleBookingSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="service" className="text-gray-700 font-medium">
                          اختر الخدمة
                        </Label>
                        <select
                          id="service"
                          value={bookingData.service}
                          onChange={(e) => setBookingData({...bookingData, service: e.target.value})}
                          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4CAF50] focus:border-[#4CAF50] text-right"
                          required
                        >
                          <option value="">اختر الخدمة</option>
                          {gardener.services.map((service, index) => (
                            <option key={index} value={service}>{service}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <Label htmlFor="date" className="text-gray-700 font-medium">
                          تاريخ الخدمة
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          value={bookingData.date}
                          onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                          className="mt-1 text-right"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="time" className="text-gray-700 font-medium">
                          وقت الخدمة
                        </Label>
                        <Input
                          id="time"
                          type="time"
                          value={bookingData.time}
                          onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                          className="mt-1 text-right"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="description" className="text-gray-700 font-medium">
                          تفاصيل إضافية (اختياري)
                        </Label>
                        <textarea
                          id="description"
                          value={bookingData.description}
                          onChange={(e) => setBookingData({...bookingData, description: e.target.value})}
                          rows={4}
                          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4CAF50] focus:border-[#4CAF50] text-right"
                        />
                      </div>
                      
                      <div className="pt-4 flex gap-3">
                        <Button
                          type="submit"
                          className="flex-1 bg-[#4CAF50] hover:bg-[#45a049] text-white"
                        >
                          إرسال الطلب
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
                
                <Button
                  variant="outline"
                  className="w-full border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white font-semibold py-3 flex items-center justify-center space-x-2 rtl:space-x-reverse"
                  onClick={handleChatOpen}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>دردش مع البستاني</span>
                </Button>
              </div>
              
              {/* Info Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات إضافية</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <span className="text-gray-600">اللغات</span>
                    <span className="text-gray-900 font-medium">{gardener.languages.join('، ')}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <span className="text-gray-600">سنوات الخبرة</span>
                    <span className="text-gray-900 font-medium">{gardener.experience}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <span className="text-gray-600">المدينة</span>
                    <span className="text-gray-900 font-medium">{gardener.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">تكلفة الساعة</span>
                    <span className="text-[#4CAF50] font-bold">{gardener.hourlyRate} درهم/ساعة</span>
                  </div>
                </div>
              </div>
              
              {/* Similar Gardeners */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">بستانيون مشابهون</h3>
                
                <div className="space-y-4">
                  {mockGardeners.filter(g => g.id !== gardener.id && g.location === gardener.location).slice(0, 3).map((g) => (
                    <Link 
                      to={`/gardeners/${g.id}`} 
                      key={g.id}
                      className="flex items-center space-x-3 rtl:space-x-reverse p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <img 
                        src={g.avatar} 
                        alt={g.name} 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{g.name}</h4>
                        <div className="flex items-center space-x-1 rtl:space-x-reverse text-sm">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{g.rating}</span>
                          <span className="text-gray-600">• {g.location}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Modal */}
        {showChatModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-xl font-bold text-gray-900">دردشة مع {gardener.name}</h3>
                <button 
                  onClick={() => setShowChatModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-4 text-center">
                  <MessageCircle className="w-12 h-12 text-[#4CAF50] mx-auto mb-2" />
                  <p className="text-gray-600">
                    ابدأ محادثة مع {gardener.name} لمناقشة احتياجاتك
                  </p>
                </div>
                
                <div className="flex">
                  <Input 
                    placeholder="اكتب رسالتك هنا..."
                    className="flex-1 text-right"
                  />
                  <Button className="mr-2 bg-[#4CAF50] hover:bg-[#45a049]">
                    إرسال
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
      <LanguageSwitcher />
    </div>
  );
};

export default GardenerProfilePage;

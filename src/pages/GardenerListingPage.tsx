
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { mockGardeners } from '../data/gardeners';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { PaginationControls } from '../components/ui/pagination-controls';
import { Star, MapPin, Search, Filter, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LanguageSwitcher from '../components/LanguageSwitcher';

const GARDENERS_PER_PAGE = 10;

const GardenerListingPage = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedGardeners, setPaginatedGardeners] = useState(mockGardeners);
  const [bookingData, setBookingData] = useState({
    service: '',
    date: '',
    time: '',
    description: ''
  });

  const locations = ['الرباط', 'الدار البيضاء', 'فاس', 'مراكش', 'أكادير', 'طنجة'];

  // Get current page from URL params
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1', 10);
    setCurrentPage(page);
  }, [searchParams]);

  // Filter and paginate gardeners
  useEffect(() => {
    const filteredGardeners = mockGardeners.filter(gardener => {
      const matchesSearch = gardener.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           gardener.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesLocation = !selectedLocation || gardener.location === selectedLocation;
      return matchesSearch && matchesLocation;
    });

    const totalPages = Math.ceil(filteredGardeners.length / GARDENERS_PER_PAGE);
    setTotalPages(totalPages);

    const startIndex = (currentPage - 1) * GARDENERS_PER_PAGE;
    const endIndex = startIndex + GARDENERS_PER_PAGE;
    const paginated = filteredGardeners.slice(startIndex, endIndex);
    
    setPaginatedGardeners(paginated);
  }, [searchTerm, selectedLocation, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams);
    params.delete('page');
    setSearchParams(params);
  };

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams);
    params.delete('page');
    setSearchParams(params);
  };

  const totalFilteredCount = mockGardeners.filter(gardener => {
    const matchesSearch = gardener.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gardener.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLocation = !selectedLocation || gardener.location === selectedLocation;
    return matchesSearch && matchesLocation;
  }).length;

  const handleBookingSubmit = (e: React.FormEvent, gardener: any) => {
    e.preventDefault();
    
    if (!bookingData.service || !bookingData.date || !bookingData.time) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    toast.success(`تم إرسال طلب الحجز مع ${gardener.name} بنجاح! سيتواصل معك البستاني قريباً.`);
    setBookingData({ service: '', date: '', time: '', description: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20">
        {/* Header Section */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {t('marketplace.title')}
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t('marketplace.subtitle')}
              </p>
            </div>

            {/* Search and Filter */}
            <div className="mt-8 flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="ابحث عن بستاني أو خدمة..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pr-10 text-right"
                />
              </div>
              
              <div className="relative">
                <select
                  value={selectedLocation}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-right focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                >
                  <option value="">جميع المدن</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-6">
            <p className="text-gray-600">
              تم العثور على {totalFilteredCount} بستاني محترف
              {totalPages > 1 && (
                <span className="text-gray-500"> - صفحة {currentPage} من {totalPages}</span>
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedGardeners.map((gardener) => (
              <div key={gardener.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={gardener.avatar}
                    alt={gardener.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full flex items-center space-x-1 rtl:space-x-reverse">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">{gardener.rating}</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{gardener.name}</h3>
                  
                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{gardener.location}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {gardener.services.slice(0, 3).map((service, index) => (
                      <span
                        key={index}
                        className="bg-green-50 text-[#4CAF50] px-2 py-1 rounded-full text-sm"
                      >
                        {service}
                      </span>
                    ))}
                  </div>

                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">{gardener.bio}</p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[#4CAF50] font-bold text-lg">
                      {gardener.hourlyRate} {t('marketplace.hourly.rate')}
                    </span>
                    <span className="text-gray-600 text-sm">
                      {gardener.reviewCount} {t('marketplace.reviews')}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <Link to={`/gardeners/${gardener.id}`} className="flex-1">
                      <Button 
                        variant="outline" 
                        className="w-full border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white"
                      >
                        {t('marketplace.view.profile')}
                      </Button>
                    </Link>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="flex-1 bg-[#4CAF50] hover:bg-[#45a049] text-white">
                          <Calendar className="w-4 h-4 ml-1" />
                          احجز الآن
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold text-gray-900 text-right">حجز خدمة مع {gardener.name}</DialogTitle>
                        </DialogHeader>
                        
                        <form onSubmit={(e) => handleBookingSubmit(e, gardener)} className="space-y-4">
                          <div>
                            <Label htmlFor={`service-${gardener.id}`} className="text-gray-700 font-medium">
                              اختر الخدمة
                            </Label>
                            <select
                              id={`service-${gardener.id}`}
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
                            <Label htmlFor={`date-${gardener.id}`} className="text-gray-700 font-medium">
                              تاريخ الخدمة
                            </Label>
                            <Input
                              id={`date-${gardener.id}`}
                              type="date"
                              value={bookingData.date}
                              onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                              className="mt-1 text-right"
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor={`time-${gardener.id}`} className="text-gray-700 font-medium">
                              وقت الخدمة
                            </Label>
                            <Input
                              id={`time-${gardener.id}`}
                              type="time"
                              value={bookingData.time}
                              onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                              className="mt-1 text-right"
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor={`description-${gardener.id}`} className="text-gray-700 font-medium">
                              تفاصيل إضافية (اختياري)
                            </Label>
                            <textarea
                              id={`description-${gardener.id}`}
                              value={bookingData.description}
                              onChange={(e) => setBookingData({...bookingData, description: e.target.value})}
                              rows={3}
                              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4CAF50] focus:border-[#4CAF50] text-right"
                            />
                          </div>
                          
                          <div className="pt-4">
                            <Button
                              type="submit"
                              className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white"
                            >
                              إرسال الطلب
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {paginatedGardeners.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">لا توجد نتائج للبحث الحالي</p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedLocation('');
                  setCurrentPage(1);
                  setSearchParams({});
                }}
                className="mt-4 bg-[#4CAF50] hover:bg-[#45a049]"
              >
                إعادة تعيين البحث
              </Button>
            </div>
          )}

          {/* Always show pagination if there are multiple pages */}
          {totalPages > 1 && (
            <div className="mt-8">
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      <Footer />
      <LanguageSwitcher />
    </div>
  );
};

export default GardenerListingPage;


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { mockGardeners } from '../data/gardeners';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Star, MapPin, Search, Filter } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LanguageSwitcher from '../components/LanguageSwitcher';

const GardenerListingPage = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const locations = ['الرباط', 'الدار البيضاء', 'فاس', 'مراكش', 'أكادير', 'طنجة'];

  const filteredGardeners = mockGardeners.filter(gardener => {
    const matchesSearch = gardener.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gardener.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLocation = !selectedLocation || gardener.location === selectedLocation;
    return matchesSearch && matchesLocation;
  });

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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 text-right"
                />
              </div>
              
              <div className="relative">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
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
              تم العثور على {filteredGardeners.length} بستاني محترف
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGardeners.map((gardener) => (
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
                    <Link to={`/gardeners/${gardener.id}`} className="flex-1">
                      <Button className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white">
                        {t('marketplace.book.now')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredGardeners.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">لا توجد نتائج للبحث الحالي</p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedLocation('');
                }}
                className="mt-4 bg-[#4CAF50] hover:bg-[#45a049]"
              >
                إعادة تعيين البحث
              </Button>
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

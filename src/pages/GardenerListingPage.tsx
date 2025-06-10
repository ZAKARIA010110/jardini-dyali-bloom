
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { mockGardeners } from '../data/gardeners';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Star, MapPin, Search } from 'lucide-react';

const GardenerListingPage = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const filteredGardeners = mockGardeners.filter(gardener => {
    const matchesSearch = gardener.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gardener.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLocation = !selectedLocation || gardener.location === selectedLocation;
    return matchesSearch && matchesLocation;
  });

  const locations = [...new Set(mockGardeners.map(g => g.location))];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('marketplace.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('marketplace.subtitle')}
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="ابحث عن بستاني أو خدمة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-12 text-right"
              />
            </div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent text-right bg-white"
            >
              <option value="">جميع المدن</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Gardeners Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGardeners.map((gardener) => (
            <div key={gardener.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
              {/* Avatar */}
              <div className="p-6 text-center">
                <img
                  src={gardener.avatar}
                  alt={gardener.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-green-100"
                />
                
                {/* Name and Location */}
                <h3 className="text-lg font-bold text-gray-900 mb-1">{gardener.name}</h3>
                <div className="flex items-center justify-center space-x-1 rtl:space-x-reverse text-gray-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{gardener.location}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-center space-x-1 rtl:space-x-reverse mb-4">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-900">{gardener.rating}</span>
                  <span className="text-sm text-gray-600">({gardener.reviewCount} {t('marketplace.reviews')})</span>
                </div>

                {/* Services */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {gardener.services.slice(0, 2).map((service, index) => (
                      <span
                        key={index}
                        className="bg-green-50 text-[#4CAF50] text-xs px-2 py-1 rounded-full font-medium"
                      >
                        {service}
                      </span>
                    ))}
                    {gardener.services.length > 2 && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                        +{gardener.services.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="text-center mb-4">
                  <span className="text-2xl font-bold text-[#4CAF50]">{gardener.hourlyRate}</span>
                  <span className="text-gray-600 text-sm"> {t('marketplace.hourly.rate')}</span>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Link to={`/gardeners/${gardener.id}`}>
                    <Button 
                      variant="outline" 
                      className="w-full border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white"
                    >
                      {t('marketplace.view.profile')}
                    </Button>
                  </Link>
                  <Button className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white">
                    {t('marketplace.book.now')}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredGardeners.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد نتائج</h3>
            <p className="text-gray-600">جرب تغيير معايير البحث للعثور على بستانيين آخرين</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GardenerListingPage;

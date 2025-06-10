
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { mockGardeners } from '../data/gardeners';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Users, Calendar, Star, MapPin, Phone, Mail, Eye } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AdminDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGardener, setSelectedGardener] = useState<any>(null);

  // Mock booking data
  const mockBookings = [
    {
      id: '1',
      clientName: 'أحمد محمد',
      gardenerName: 'يوسف البستاني',
      service: 'تصميم الحديقة',
      date: '2024-01-15',
      status: 'مؤكد',
      price: '500 درهم'
    },
    {
      id: '2',
      clientName: 'فاطمة الزهراء',
      gardenerName: 'محمد الحديقي',
      service: 'قص العشب',
      date: '2024-01-16',
      status: 'قيد الانتظار',
      price: '200 درهم'
    }
  ];

  const filteredGardeners = mockGardeners.filter(gardener =>
    gardener.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gardener.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Redirect if not admin
  if (user?.userType !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">غير مصرح لك بالوصول</h2>
          <p className="text-gray-600">هذه الصفحة مخصصة للمدراء فقط</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              لوحة تحكم المدير
            </h1>
            <p className="text-gray-600">إدارة البستانيين والحجوزات</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-[#4CAF50]" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">إجمالي البستانيين</p>
                  <p className="text-2xl font-bold text-gray-900">{mockGardeners.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-blue-500" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">الحجوزات اليوم</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Star className="w-8 h-8 text-yellow-500" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">متوسط التقييم</p>
                  <p className="text-2xl font-bold text-gray-900">4.8</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <MapPin className="w-8 h-8 text-red-500" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">المدن المغطاة</p>
                  <p className="text-2xl font-bold text-gray-900">6</p>
                </div>
              </div>
            </div>
          </div>

          {/* Gardeners Management */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">إدارة البستانيين</h2>
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <Input
                    type="text"
                    placeholder="البحث عن بستاني..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-right"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الاسم</TableHead>
                    <TableHead className="text-right">الموقع</TableHead>
                    <TableHead className="text-right">التقييم</TableHead>
                    <TableHead className="text-right">عدد المراجعات</TableHead>
                    <TableHead className="text-right">السعر/ساعة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGardeners.map((gardener) => (
                    <TableRow key={gardener.id}>
                      <TableCell className="font-medium text-right">{gardener.name}</TableCell>
                      <TableCell className="text-right">{gardener.location}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1 rtl:space-x-reverse">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{gardener.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{gardener.reviewCount}</TableCell>
                      <TableCell className="text-right">{gardener.hourlyRate} درهم</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedGardener(gardener)}
                            >
                              <Eye className="w-4 h-4 ml-2" />
                              عرض التفاصيل
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-right">تفاصيل البستاني</DialogTitle>
                            </DialogHeader>
                            {selectedGardener && (
                              <div className="space-y-6">
                                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                  <img
                                    src={selectedGardener.avatar}
                                    alt={selectedGardener.name}
                                    className="w-20 h-20 rounded-full object-cover"
                                  />
                                  <div className="text-right">
                                    <h3 className="text-xl font-bold">{selectedGardener.name}</h3>
                                    <p className="text-gray-600">{selectedGardener.location}</p>
                                    <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2">
                                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                      <span>{selectedGardener.rating}</span>
                                      <span className="text-gray-600">({selectedGardener.reviewCount} مراجعة)</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold mb-2">الخدمات المقدمة:</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedGardener.services.map((service: string, index: number) => (
                                      <span
                                        key={index}
                                        className="bg-green-50 text-[#4CAF50] px-3 py-1 rounded-full text-sm"
                                      >
                                        {service}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold mb-2">النبذة الشخصية:</h4>
                                  <p className="text-gray-700">{selectedGardener.bio}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">سنوات الخبرة:</h4>
                                    <p className="text-gray-700">{selectedGardener.experience}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">السعر بالساعة:</h4>
                                    <p className="text-[#4CAF50] font-bold">{selectedGardener.hourlyRate} درهم</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Bookings Management */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">إدارة الحجوزات</h2>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">اسم العميل</TableHead>
                    <TableHead className="text-right">البستاني</TableHead>
                    <TableHead className="text-right">الخدمة</TableHead>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">السعر</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium text-right">{booking.clientName}</TableCell>
                      <TableCell className="text-right">{booking.gardenerName}</TableCell>
                      <TableCell className="text-right">{booking.service}</TableCell>
                      <TableCell className="text-right">{booking.date}</TableCell>
                      <TableCell className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          booking.status === 'مؤكد' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{booking.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;

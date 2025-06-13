
import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Star, Eye } from 'lucide-react';

interface Gardener {
  id: string;
  name: string;
  location: string;
  bio: string;
  hourly_rate: number;
  experience: string;
  services: string[];
  rating: number;
  review_count: number;
  avatar_url: string;
  phone: string;
  email: string;
  languages: string[];
}

interface GardenersTabProps {
  gardeners: Gardener[];
}

const GardenersTab: React.FC<GardenersTabProps> = ({ gardeners }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGardener, setSelectedGardener] = useState<Gardener | null>(null);

  const filteredGardeners = gardeners.filter(gardener =>
    gardener.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gardener.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
                <TableCell className="text-right">{gardener.review_count}</TableCell>
                <TableCell className="text-right">{gardener.hourly_rate} درهم</TableCell>
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
                              src={selectedGardener.avatar_url}
                              alt={selectedGardener.name}
                              className="w-20 h-20 rounded-full object-cover"
                            />
                            <div className="text-right">
                              <h3 className="text-xl font-bold">{selectedGardener.name}</h3>
                              <p className="text-gray-600">{selectedGardener.location}</p>
                              <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span>{selectedGardener.rating}</span>
                                <span className="text-gray-600">({selectedGardener.review_count} مراجعة)</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">الخدمات المقدمة:</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedGardener.services?.map((service: string, index: number) => (
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
                              <p className="text-[#4CAF50] font-bold">{selectedGardener.hourly_rate} درهم</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">الهاتف:</h4>
                              <p className="text-gray-700">{selectedGardener.phone}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">البريد الإلكتروني:</h4>
                              <p className="text-gray-700">{selectedGardener.email}</p>
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
  );
};

export default GardenersTab;

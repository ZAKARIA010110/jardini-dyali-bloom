
import React, { useState } from 'react';
import { Users, Search, Filter, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface Homeowner {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  joinedDate: string;
  totalBookings: number;
  status: 'active' | 'inactive';
}

// Mock data for demonstration
const mockHomeowners: Homeowner[] = [
  {
    id: '1',
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    phone: '+212 6 12 34 56 78',
    location: 'الرباط',
    joinedDate: '2024-01-15',
    totalBookings: 5,
    status: 'active'
  },
  {
    id: '2',
    name: 'فاطمة الزهراء',
    email: 'fatima@example.com',
    phone: '+212 6 87 65 43 21',
    location: 'الدار البيضاء',
    joinedDate: '2024-02-20',
    totalBookings: 3,
    status: 'active'
  }
];

const HomeownersTab: React.FC = () => {
  const [homeowners, setHomeowners] = useState<Homeowner[]>(mockHomeowners);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHomeowner, setSelectedHomeowner] = useState<Homeowner | null>(null);

  const filteredHomeowners = homeowners.filter(homeowner =>
    homeowner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    homeowner.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">أصحاب المنازل</h2>
          <p className="text-gray-600">إدارة حسابات أصحاب المنازل</p>
        </div>
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="البحث عن صاحب منزل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 w-64"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 ml-2" />
            تصفية
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-500">إجمالي أصحاب المنازل</p>
              <p className="text-2xl font-bold text-gray-900">{homeowners.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-500">نشط</p>
              <p className="text-2xl font-bold text-gray-900">
                {homeowners.filter(h => h.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Users className="w-6 h-6 text-gray-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-500">غير نشط</p>
              <p className="text-2xl font-bold text-gray-900">
                {homeowners.filter(h => h.status === 'inactive').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  صاحب المنزل
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الموقع
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحجوزات
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاريخ الانضمام
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredHomeowners.map((homeowner) => (
                <tr key={homeowner.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {homeowner.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{homeowner.name}</p>
                        <p className="text-sm text-gray-500">{homeowner.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{homeowner.location}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{homeowner.totalBookings}</td>
                  <td className="px-6 py-4">
                    <Badge variant={homeowner.status === 'active' ? 'default' : 'secondary'}>
                      {homeowner.status === 'active' ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{homeowner.joinedDate}</td>
                  <td className="px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedHomeowner(homeowner)}>
                          <Eye className="w-4 h-4 ml-2" />
                          عرض التفاصيل
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 ml-2" />
                          تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 ml-2" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      <Dialog open={!!selectedHomeowner} onOpenChange={() => setSelectedHomeowner(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>تفاصيل صاحب المنزل</DialogTitle>
          </DialogHeader>
          {selectedHomeowner && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-lg">
                    {selectedHomeowner.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedHomeowner.name}</h3>
                  <p className="text-gray-600">{selectedHomeowner.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">الهاتف</label>
                  <p className="text-sm text-gray-900">{selectedHomeowner.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">الموقع</label>
                  <p className="text-sm text-gray-900">{selectedHomeowner.location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">الحجوزات</label>
                  <p className="text-sm text-gray-900">{selectedHomeowner.totalBookings}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">تاريخ الانضمام</label>
                  <p className="text-sm text-gray-900">{selectedHomeowner.joinedDate}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomeownersTab;

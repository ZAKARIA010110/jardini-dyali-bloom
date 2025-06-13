
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Calendar, Clock } from 'lucide-react';

interface Booking {
  id: string;
  client_name: string;
  gardener_name: string;
  service: string;
  booking_date: string;
  booking_time: string;
  status: string;
  price: string;
}

interface BookingsTabProps {
  bookings: Booking[];
}

const BookingsTab: React.FC<BookingsTabProps> = ({ bookings }) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'مؤكد':
        return 'bg-green-100 text-green-800';
      case 'قيد الانتظار':
        return 'bg-yellow-100 text-yellow-800';
      case 'ملغي':
        return 'bg-red-100 text-red-800';
      case 'مكتمل':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow mb-8">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Calendar className="w-5 h-5 ml-2" />
          إدارة الحجوزات
        </h2>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">اسم العميل</TableHead>
              <TableHead className="text-right">البستاني</TableHead>
              <TableHead className="text-right">الخدمة</TableHead>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">الوقت</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">السعر</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium text-right">{booking.client_name}</TableCell>
                <TableCell className="text-right">{booking.gardener_name}</TableCell>
                <TableCell className="text-right">{booking.service}</TableCell>
                <TableCell className="text-right">{booking.booking_date}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 ml-1" />
                    {booking.booking_time}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
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
  );
};

export default BookingsTab;

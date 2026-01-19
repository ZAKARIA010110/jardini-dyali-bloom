import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Check, X, Eye, Calendar, Clock } from 'lucide-react';
import { useGardenerData } from '@/hooks/useGardenerData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const GardenerBookings: React.FC = () => {
  const { bookings, loading, refetch } = useGardenerData();
  const [filter, setFilter] = useState<string>('all');
  const [completionNotes, setCompletionNotes] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const updateBookingStatus = async (bookingId: string, status: 'confirmed' | 'completed' | 'cancelled', notes?: string) => {
    try {
      const updateData: any = { status };
      
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
        if (notes) {
          updateData.completion_notes = notes;
        }
      }

      const { error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', bookingId);

      if (error) throw error;

      toast.success(
        status === 'confirmed' ? 'تم تأكيد الحجز بنجاح!' :
        status === 'completed' ? 'تم تأكيد إكمال الخدمة!' :
        'تم إلغاء الحجز'
      );

      refetch();
      setSelectedBooking(null);
      setCompletionNotes('');
    } catch (error: any) {
      console.error('Error updating booking:', error);
      toast.error('حدث خطأ في تحديث الحجز');
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">معلق</Badge>;
      case 'confirmed':
        return <Badge className="bg-blue-100 text-blue-800">مؤكد</Badge>;
      case 'in_progress':
        return <Badge className="bg-purple-100 text-purple-800">قيد التنفيذ</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">مكتمل</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">ملغي</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: 'all', label: 'الكل' },
          { value: 'pending', label: 'معلق' },
          { value: 'confirmed', label: 'مؤكد' },
          { value: 'in_progress', label: 'قيد التنفيذ' },
          { value: 'completed', label: 'مكتمل' },
          { value: 'cancelled', label: 'ملغي' }
        ].map(({ value, label }) => (
          <Button
            key={value}
            variant={filter === value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(value)}
            className={filter === value ? 'bg-green-500 hover:bg-green-600' : ''}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <Card className="bg-white">
            <CardContent className="py-12 text-center">
              <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">لا توجد حجوزات {filter !== 'all' ? 'في هذه الفئة' : ''}</p>
            </CardContent>
          </Card>
        ) : (
          filteredBookings.map((booking) => (
            <Card key={booking.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{booking.service}</h3>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(booking.booking_date).toLocaleDateString('ar-MA')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {booking.booking_time}
                      </span>
                    </div>
                    <p className="text-green-600 font-medium">{booking.price || 0} درهم</p>
                  </div>

                  <div className="flex gap-2">
                    {booking.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600"
                          onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                        >
                          <Check className="w-4 h-4 ml-1" />
                          تأكيد
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        >
                          <X className="w-4 h-4 ml-1" />
                          رفض
                        </Button>
                      </>
                    )}

                    {(booking.status === 'confirmed' || booking.status === 'in_progress') && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600"
                            onClick={() => setSelectedBooking(booking.id)}
                          >
                            <Check className="w-4 h-4 ml-1" />
                            تأكيد الإكمال
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>تأكيد إكمال الخدمة</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p className="text-gray-600">هل تريد تأكيد إكمال خدمة "{booking.service}"؟</p>
                            <div>
                              <label className="block text-sm font-medium mb-2">ملاحظات الإكمال (اختياري)</label>
                              <Textarea
                                value={completionNotes}
                                onChange={(e) => setCompletionNotes(e.target.value)}
                                placeholder="أضف أي ملاحظات عن الخدمة المقدمة..."
                                rows={3}
                              />
                            </div>
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setSelectedBooking(null);
                                  setCompletionNotes('');
                                }}
                              >
                                إلغاء
                              </Button>
                              <Button
                                className="bg-green-500 hover:bg-green-600"
                                onClick={() => updateBookingStatus(booking.id, 'completed', completionNotes)}
                              >
                                تأكيد الإكمال
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}

                    {booking.notes && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 ml-1" />
                            التفاصيل
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>تفاصيل الحجز</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-gray-600">ملاحظات العميل:</p>
                              <p className="bg-gray-50 p-3 rounded mt-1">{booking.notes}</p>
                            </div>
                            {booking.completion_notes && (
                              <div>
                                <p className="text-sm text-gray-600">ملاحظات الإكمال:</p>
                                <p className="bg-gray-50 p-3 rounded mt-1">{booking.completion_notes}</p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default GardenerBookings;

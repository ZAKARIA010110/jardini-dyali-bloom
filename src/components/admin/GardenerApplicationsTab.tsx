
import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Eye, Check, X, Calendar } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '../../context/LanguageContext';

interface GardenerApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  experience: string;
  daily_rate: number;
  bio: string;
  services: string[];
  languages: string[];
  avatar_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at: string;
}

const GardenerApplicationsTab: React.FC = () => {
  const { language } = useLanguage();
  const [applications, setApplications] = useState<GardenerApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<GardenerApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('gardener_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('خطأ في تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: 'approved' | 'rejected', notes?: string) => {
    try {
      const { error } = await supabase
        .from('gardener_applications')
        .update({
          status,
          admin_notes: notes,
          reviewed_at: new Date().toISOString(),
          reviewed_by: null // Would be admin user id in real implementation
        })
        .eq('id', applicationId);

      if (error) throw error;

      // If approved, create gardener profile
      if (status === 'approved') {
        const application = applications.find(app => app.id === applicationId);
        if (application) {
          const { error: gardenerError } = await supabase
            .from('gardeners')
            .insert({
              name: application.name,
              email: application.email,
              phone: application.phone,
              location: application.city,
              experience: application.experience,
              hourly_rate: Math.round(application.daily_rate / 8), // Convert daily to hourly
              bio: application.bio,
              services: application.services,
              languages: application.languages,
              avatar_url: application.avatar_url,
              rating: 0,
              review_count: 0
            });

          if (gardenerError) {
            console.error('Error creating gardener profile:', gardenerError);
            toast.error('تم قبول الطلب لكن حدث خطأ في إنشاء الملف الشخصي');
          }
        }
      }

      toast.success(status === 'approved' ? 'تم قبول الطلب بنجاح!' : 'تم رفض الطلب');
      fetchApplications();
      setSelectedApplication(null);
      setAdminNotes('');
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('حدث خطأ في تحديث الطلب');
    }
  };

  const filteredApplications = applications.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">في الانتظار</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">مقبول</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">مرفوض</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">جاري تحميل الطلبات...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow mb-8">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">طلبات البستانيين</h2>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Input
              type="text"
              placeholder="البحث في الطلبات..."
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
              <TableHead className="text-right">البريد الإلكتروني</TableHead>
              <TableHead className="text-right">المدينة</TableHead>
              <TableHead className="text-right">السعر اليومي</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">تاريخ التقديم</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.map((application) => (
              <TableRow key={application.id}>
                <TableCell className="font-medium text-right">{application.name}</TableCell>
                <TableCell className="text-right">{application.email}</TableCell>
                <TableCell className="text-right">{application.city}</TableCell>
                <TableCell className="text-right">{application.daily_rate} درهم</TableCell>
                <TableCell className="text-right">
                  {getStatusBadge(application.status)}
                </TableCell>
                <TableCell className="text-right">
                  {new Date(application.created_at).toLocaleDateString('ar-MA')}
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedApplication(application)}
                      >
                        <Eye className="w-4 h-4 ml-2" />
                        عرض التفاصيل
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-right">تفاصيل طلب البستاني</DialogTitle>
                      </DialogHeader>
                      {selectedApplication && (
                        <div className="space-y-6">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            {selectedApplication.avatar_url && (
                              <img
                                src={selectedApplication.avatar_url}
                                alt={selectedApplication.name}
                                className="w-20 h-20 rounded-full object-cover"
                              />
                            )}
                            <div className="text-right">
                              <h3 className="text-xl font-bold">{selectedApplication.name}</h3>
                              <p className="text-gray-600">{selectedApplication.email}</p>
                              <p className="text-gray-600">{selectedApplication.phone}</p>
                              <p className="text-gray-600">{selectedApplication.city}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">سنوات الخبرة:</h4>
                              <p className="text-gray-700">{selectedApplication.experience}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">السعر اليومي:</h4>
                              <p className="text-[#4CAF50] font-bold">{selectedApplication.daily_rate} درهم</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">الخدمات المقدمة:</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedApplication.services?.map((service: string, index: number) => (
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
                            <h4 className="font-semibold mb-2">اللغات:</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedApplication.languages?.map((language: string, index: number) => (
                                <span
                                  key={index}
                                  className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
                                >
                                  {language}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">النبذة الشخصية:</h4>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedApplication.bio}</p>
                          </div>

                          {selectedApplication.status === 'pending' && (
                            <div className="space-y-4 border-t pt-4">
                              <div>
                                <label className="block text-sm font-medium mb-2">ملاحظات المدير (اختياري):</label>
                                <textarea
                                  value={adminNotes}
                                  onChange={(e) => setAdminNotes(e.target.value)}
                                  className="w-full p-3 border rounded-md text-right"
                                  rows={3}
                                  placeholder="أضف ملاحظات حول القرار..."
                                />
                              </div>
                              <div className="flex gap-4 justify-end">
                                <Button
                                  onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected', adminNotes)}
                                  variant="destructive"
                                  className="flex items-center gap-2"
                                >
                                  <X className="w-4 h-4" />
                                  رفض الطلب
                                </Button>
                                <Button
                                  onClick={() => updateApplicationStatus(selectedApplication.id, 'approved', adminNotes)}
                                  className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                                >
                                  <Check className="w-4 h-4" />
                                  قبول الطلب
                                </Button>
                              </div>
                            </div>
                          )}

                          {selectedApplication.status !== 'pending' && selectedApplication.admin_notes && (
                            <div className="border-t pt-4">
                              <h4 className="font-semibold mb-2">ملاحظات المدير:</h4>
                              <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedApplication.admin_notes}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredApplications.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            لا توجد طلبات بستانيين متاحة
          </div>
        )}
      </div>
    </div>
  );
};

export default GardenerApplicationsTab;

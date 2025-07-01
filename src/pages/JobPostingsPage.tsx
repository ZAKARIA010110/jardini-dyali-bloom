import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { supabase } from '../integrations/supabase/client';
import { useAuthState } from '../hooks/useAuthState';
import { Plus, MapPin, Calendar, DollarSign, Users, Clock } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface JobPosting {
  id: string;
  title: string;
  description: string;
  service_type: string;
  location: string;
  preferred_date: string;
  preferred_time: string;
  budget_min: number;
  budget_max: number;
  status: string;
  created_at: string;
  bid_count?: number;
}

interface Bid {
  id: string;
  gardener_id: string;
  bid_amount: number;
  message: string;
  status: string;
  created_at: string;
  gardener: {
    name: string;
    avatar_url: string;
    rating: number;
    experience: string;
  };
}

const JobPostingsPage = () => {
  const { user } = useAuthState();
  const navigate = useNavigate();
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    service_type: '',
    location: '',
    preferred_date: '',
    preferred_time: '',
    budget_min: '',
    budget_max: ''
  });

  const serviceTypes = [
    'تصميم الحدائق',
    'الزراعة',
    'العناية بالعشب',
    'تقليم الأشجار',
    'نظام الري',
    'مكافحة الآفات',
    'تنسيق المناظر الطبيعية',
    'صيانة دورية'
  ];

  useEffect(() => {
    if (user) {
      fetchJobPostings();
    }
  }, [user]);

  const fetchJobPostings = async () => {
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .select(`
          *,
          gardener_bids(count)
        `)
        .eq('homeowner_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const jobsWithBidCount = data?.map(job => ({
        ...job,
        bid_count: job.gardener_bids[0]?.count || 0
      })) || [];

      setJobPostings(jobsWithBidCount);
    } catch (error) {
      console.error('Error fetching job postings:', error);
      toast.error('خطأ في تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  };

  const fetchJobBids = async (jobId: string) => {
    try {
      const { data, error } = await supabase
        .from('gardener_bids')
        .select(`
          *,
          gardener:gardeners(
            name,
            avatar_url,
            rating,
            experience
          )
        `)
        .eq('job_posting_id', jobId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBids(data || []);
    } catch (error) {
      console.error('Error fetching bids:', error);
      toast.error('خطأ في تحميل العروض');
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      const { error } = await supabase
        .from('job_postings')
        .insert({
          homeowner_id: user.id,
          title: formData.title,
          description: formData.description,
          service_type: formData.service_type,
          location: formData.location,
          preferred_date: formData.preferred_date,
          preferred_time: formData.preferred_time,
          budget_min: parseInt(formData.budget_min),
          budget_max: parseInt(formData.budget_max)
        });

      if (error) throw error;

      toast.success('تم إنشاء الطلب بنجاح!');
      setShowCreateForm(false);
      setFormData({
        title: '',
        description: '',
        service_type: '',
        location: '',
        preferred_date: '',
        preferred_time: '',
        budget_min: '',
        budget_max: ''
      });
      fetchJobPostings();
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('خطأ في إنشاء الطلب');
    }
  };

  const handleAcceptBid = async (bidId: string, jobId: string, gardenerId: string) => {
    try {
      // Update bid status to accepted
      await supabase
        .from('gardener_bids')
        .update({ status: 'accepted' })
        .eq('id', bidId);

      // Update job posting status and assign gardener
      await supabase
        .from('job_postings')
        .update({
          status: 'assigned',
          assigned_gardener_id: gardenerId,
          assigned_at: new Date().toISOString()
        })
        .eq('id', jobId);

      // Reject other bids
      await supabase
        .from('gardener_bids')
        .update({ status: 'rejected' })
        .eq('job_posting_id', jobId)
        .neq('id', bidId);

      toast.success('تم قبول العرض بنجاح!');
      fetchJobPostings();
      fetchJobBids(jobId);
    } catch (error) {
      console.error('Error accepting bid:', error);
      toast.error('خطأ في قبول العرض');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'مفتوح';
      case 'assigned': return 'تم التعيين';
      case 'completed': return 'مكتمل';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">تسجيل الدخول مطلوب</h2>
          <Button onClick={() => navigate('/login')}>تسجيل الدخول</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">طلبات العمل</h1>
              <p className="text-gray-600 mt-2">أنشئ طلب عمل واحصل على عروض من البستانيين</p>
            </div>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 ml-2" />
              طلب جديد
            </Button>
          </div>

          {showCreateForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>إنشاء طلب عمل جديد</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateJob} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">عنوان الطلب</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="مثال: تصميم حديقة منزل"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="service_type">نوع الخدمة</Label>
                      <select
                        id="service_type"
                        value={formData.service_type}
                        onChange={(e) => setFormData({...formData, service_type: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      >
                        <option value="">اختر الخدمة</option>
                        {serviceTypes.map((service) => (
                          <option key={service} value={service}>{service}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">وصف العمل</Label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="اشرح تفاصيل العمل المطلوب..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="location">الموقع</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        placeholder="المدينة/المنطقة"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="preferred_date">التاريخ المفضل</Label>
                      <Input
                        id="preferred_date"
                        type="date"
                        value={formData.preferred_date}
                        onChange={(e) => setFormData({...formData, preferred_date: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="preferred_time">الوقت المفضل</Label>
                      <Input
                        id="preferred_time"
                        type="time"
                        value={formData.preferred_time}
                        onChange={(e) => setFormData({...formData, preferred_time: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="budget_min">الحد الأدنى للميزانية (درهم)</Label>
                      <Input
                        id="budget_min"
                        type="number"
                        value={formData.budget_min}
                        onChange={(e) => setFormData({...formData, budget_min: e.target.value})}
                        placeholder="500"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="budget_max">الحد الأقصى للميزانية (درهم)</Label>
                      <Input
                        id="budget_max"
                        type="number"
                        value={formData.budget_max}
                        onChange={(e) => setFormData({...formData, budget_max: e.target.value})}
                        placeholder="1500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      إنشاء الطلب
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateForm(false)}
                    >
                      إلغاء
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">جاري تحميل الطلبات...</p>
                </div>
              ) : jobPostings.length === 0 ? (
                <Card className="p-8 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد طلبات</h3>
                  <p className="text-gray-600 mb-4">أنشئ أول طلب عمل لك</p>
                  <Button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    إنشاء طلب جديد
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {jobPostings.map((job) => (
                    <Card
                      key={job.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedJob?.id === job.id ? 'ring-2 ring-green-500' : ''
                      }`}
                      onClick={() => {
                        setSelectedJob(job);
                        fetchJobBids(job.id);
                      }}
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
                            <Badge className={getStatusColor(job.status)}>
                              {getStatusText(job.status)}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              {job.budget_min} - {job.budget_max} درهم
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {job.bid_count} عرض
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 ml-1" />
                            {job.location}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 ml-1" />
                            {job.preferred_date}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 ml-1" />
                            {job.preferred_time}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 ml-1" />
                            {job.bid_count} عرض
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div>
              {selectedJob ? (
                <Card>
                  <CardHeader>
                    <CardTitle>العروض المقدمة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bids.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-600">لا توجد عروض حتى الآن</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bids.map((bid) => (
                          <div key={bid.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                  <span className="text-green-600 font-semibold">
                                    {bid.gardener.name.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">{bid.gardener.name}</h4>
                                  <div className="text-sm text-gray-600">
                                    ⭐ {bid.gardener.rating} • {bid.gardener.experience}
                                  </div>
                                </div>
                              </div>
                              <Badge className={
                                bid.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                bid.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }>
                                {bid.status === 'accepted' ? 'مقبول' :
                                 bid.status === 'rejected' ? 'مرفوض' : 'في الانتظار'}
                              </Badge>
                            </div>

                            <div className="mb-3">
                              <div className="text-lg font-bold text-green-600 mb-2">
                                {bid.bid_amount} درهم
                              </div>
                              {bid.message && (
                                <p className="text-gray-700 text-sm">{bid.message}</p>
                              )}
                            </div>

                            {bid.status === 'pending' && selectedJob.status === 'open' && (
                              <Button
                                onClick={() => handleAcceptBid(bid.id, selectedJob.id, bid.gardener_id)}
                                className="w-full bg-green-600 hover:bg-green-700"
                                size="sm"
                              >
                                قبول العرض
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-600">اختر طلب عمل لعرض العروض المقدمة</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobPostingsPage;
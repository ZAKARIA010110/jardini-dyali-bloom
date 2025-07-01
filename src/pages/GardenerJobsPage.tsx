import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { supabase } from '../integrations/supabase/client';
import { useAuthState } from '../hooks/useAuthState';
import { MapPin, Calendar, DollarSign, Clock, MessageCircle } from 'lucide-react';
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
  homeowner_name?: string;
  existing_bid?: {
    id: string;
    bid_amount: number;
    message: string;
    status: string;
  };
}

const GardenerJobsPage = () => {
  const { user } = useAuthState();
  const navigate = useNavigate();
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidData, setBidData] = useState({
    bid_amount: '',
    message: ''
  });
  const [loading, setLoading] = useState(true);
  const [gardenerProfile, setGardenerProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      checkGardenerProfile();
      fetchJobPostings();
    }
  }, [user]);

  const checkGardenerProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('gardeners')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setGardenerProfile(data);
    } catch (error) {
      console.error('Error checking gardener profile:', error);
    }
  };

  const fetchJobPostings = async () => {
    if (!gardenerProfile) return;

    try {
      const { data, error } = await supabase
        .from('job_postings')
        .select(`
          *,
          gardener_bids!left(id, bid_amount, message, status, gardener_id)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get homeowner profiles separately
      const homeownerIds = data?.map(job => job.homeowner_id) || [];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', homeownerIds);

      const jobsWithBids = data?.map(job => ({
        ...job,
        homeowner_name: profiles?.find(p => p.id === job.homeowner_id)?.name || 'مالك المنزل',
        existing_bid: job.gardener_bids?.find((bid: any) => 
          bid.gardener_id === gardenerProfile.id
        ) || null
      })) || [];

      setJobPostings(jobsWithBids);
    } catch (error) {
      console.error('Error fetching job postings:', error);
      toast.error('خطأ في تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedJob || !gardenerProfile) return;

    try {
      const { error } = await supabase
        .from('gardener_bids')
        .insert({
          job_posting_id: selectedJob.id,
          gardener_id: gardenerProfile.id,
          bid_amount: parseInt(bidData.bid_amount),
          message: bidData.message
        });

      if (error) throw error;

      toast.success('تم تقديم العرض بنجاح!');
      setShowBidForm(false);
      setBidData({ bid_amount: '', message: '' });
      setSelectedJob(null);
      fetchJobPostings();
    } catch (error: any) {
      console.error('Error submitting bid:', error);
      if (error.code === '23505') {
        toast.error('لقد قدمت عرضاً لهذا الطلب من قبل');
      } else {
        toast.error('خطأ في تقديم العرض');
      }
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

  if (!gardenerProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 flex items-center justify-center">
          <Card className="p-8 text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">ملف البستاني مطلوب</h2>
            <p className="text-gray-600 mb-4">
              لعرض طلبات العمل والتقدم بعروضك، تحتاج إلى إنشاء ملف بستاني أولاً
            </p>
            <Button 
              onClick={() => navigate('/become-gardener')}
              className="bg-green-600 hover:bg-green-700"
            >
              إنشاء ملف بستاني
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">طلبات العمل المتاحة</h1>
            <p className="text-gray-600 mt-2">تصفح الطلبات وقدم عروضك للأعمال المناسبة</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">جاري تحميل الطلبات...</p>
                </div>
              ) : jobPostings.length === 0 ? (
                <Card className="p-8 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد طلبات متاحة</h3>
                  <p className="text-gray-600">ستظهر هنا الطلبات الجديدة عند توفرها</p>
                </Card>
              ) : (
                <div className="space-y-6">
                  {jobPostings.map((job) => (
                    <Card key={job.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                              <Badge variant="secondary">{job.service_type}</Badge>
                              {job.existing_bid && (
                                <Badge className={
                                  job.existing_bid.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                  job.existing_bid.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }>
                                  {job.existing_bid.status === 'accepted' ? 'تم قبول عرضك' :
                                   job.existing_bid.status === 'rejected' ? 'تم رفض عرضك' : 'عرضك قيد المراجعة'}
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm">بواسطة: {job.homeowner_name}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-green-600 mb-1">
                              {job.budget_min} - {job.budget_max} درهم
                            </div>
                            <div className="text-sm text-gray-600">
                              {new Date(job.created_at).toLocaleDateString('ar-MA')}
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4">{job.description}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 ml-1" />
                            {job.location}
                          </div>
                          {job.preferred_date && (
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 ml-1" />
                              {new Date(job.preferred_date).toLocaleDateString('ar-MA')}
                            </div>
                          )}
                          {job.preferred_time && (
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 ml-1" />
                              {job.preferred_time}
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-center">
                          <Button
                            variant="outline"
                            onClick={() => setSelectedJob(job)}
                          >
                            عرض التفاصيل
                          </Button>
                          
                          {!job.existing_bid ? (
                            <Button
                              onClick={() => {
                                setSelectedJob(job);
                                setShowBidForm(true);
                              }}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              تقديم عرض
                            </Button>
                          ) : (
                            <Button variant="outline" disabled>
                              {job.existing_bid.status === 'accepted' ? 'تم قبول عرضك' : 
                               job.existing_bid.status === 'rejected' ? 'تم رفض عرضك' : 
                               'عرضك قيد المراجعة'}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div>
              {selectedJob && !showBidForm ? (
                <Card>
                  <CardHeader>
                    <CardTitle>تفاصيل الطلب</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{selectedJob.title}</h4>
                        <p className="text-gray-700 text-sm">{selectedJob.description}</p>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">النوع:</span>
                            <div className="font-medium">{selectedJob.service_type}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">الموقع:</span>
                            <div className="font-medium">{selectedJob.location}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">التاريخ:</span>
                            <div className="font-medium">
                              {selectedJob.preferred_date ? 
                                new Date(selectedJob.preferred_date).toLocaleDateString('ar-MA') : 
                                'مرن'
                              }
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">الوقت:</span>
                            <div className="font-medium">{selectedJob.preferred_time || 'مرن'}</div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {selectedJob.budget_min} - {selectedJob.budget_max} درهم
                          </div>
                          <div className="text-sm text-gray-600">الميزانية المتوقعة</div>
                        </div>
                      </div>

                      {!selectedJob.existing_bid && (
                        <Button
                          onClick={() => setShowBidForm(true)}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          تقديم عرض
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : showBidForm && selectedJob ? (
                <Card>
                  <CardHeader>
                    <CardTitle>تقديم عرض</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitBid} className="space-y-4">
                      <div>
                        <Label htmlFor="bid_amount">مبلغ العرض (درهم)</Label>
                        <Input
                          id="bid_amount"
                          type="number"
                          value={bidData.bid_amount}
                          onChange={(e) => setBidData({...bidData, bid_amount: e.target.value})}
                          placeholder={`بين ${selectedJob.budget_min} و ${selectedJob.budget_max}`}
                          min={selectedJob.budget_min}
                          max={selectedJob.budget_max}
                          required
                        />
                        <p className="text-sm text-gray-600 mt-1">
                          الميزانية المتوقعة: {selectedJob.budget_min} - {selectedJob.budget_max} درهم
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="message">رسالة للعميل (اختياري)</Label>
                        <textarea
                          id="message"
                          value={bidData.message}
                          onChange={(e) => setBidData({...bidData, message: e.target.value})}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="اشرح لماذا أنت الخيار الأفضل لهذا العمل..."
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button
                          type="submit"
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          تقديم العرض
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowBidForm(false);
                            setBidData({ bid_amount: '', message: '' });
                          }}
                        >
                          إلغاء
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">اختر طلب عمل لعرض التفاصيل</p>
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

export default GardenerJobsPage;
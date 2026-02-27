import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/useAuth';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Save, User, MapPin, Globe, Briefcase, DollarSign,
  Plus, X, Star, Calendar, Phone, Mail, Loader2
} from 'lucide-react';

const AVAILABLE_SERVICES = [
  'تقليم الأشجار', 'تنسيق الحدائق', 'زراعة النباتات', 'ري وسقي',
  'تصميم الحدائق', 'مكافحة الآفات', 'تنظيف الحدائق', 'صيانة العشب',
  'تركيب نظام الري', 'زراعة الأزهار'
];

const AVAILABLE_LANGUAGES = ['العربية', 'الفرنسية', 'الإنجليزية', 'الأمازيغية', 'الإسبانية'];

const DAY_NAMES = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

interface GardenerFormData {
  name: string;
  phone: string;
  bio: string;
  location: string;
  experience: string;
  hourly_rate: number;
  languages: string[];
  services: string[];
  is_available: boolean;
}

interface AvailabilitySlot {
  id?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

const GardenerMyProfilePage: React.FC = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<GardenerFormData>({
    name: '', phone: '', bio: '', location: '', experience: '',
    hourly_rate: 0, languages: [], services: [], is_available: true
  });
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [stats, setStats] = useState({ rating: 0, review_count: 0, total_bookings: 0, completed: 0 });

  useEffect(() => {
    if (!authLoading && user) fetchAllData();
  }, [user, authLoading]);

  const fetchAllData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [profileRes, gardenerRes, availRes, bookingsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('gardener_profiles').select('*').eq('id', user.id).single(),
        supabase.from('gardener_availability').select('*').eq('gardener_id', user.id).order('day_of_week'),
        supabase.from('bookings').select('id, status').eq('gardener_id', user.id)
      ]);

      const p = profileRes.data;
      const g = gardenerRes.data;

      if (p && g) {
        setFormData({
          name: p.name || '',
          phone: p.phone || '',
          bio: g.bio || '',
          location: g.location || '',
          experience: g.experience || '',
          hourly_rate: g.hourly_rate || 0,
          languages: g.languages || [],
          services: g.services || [],
          is_available: g.is_available ?? true
        });
        setStats({
          rating: g.rating || 0,
          review_count: g.review_count || 0,
          total_bookings: bookingsRes.data?.length || 0,
          completed: bookingsRes.data?.filter(b => b.status === 'completed').length || 0
        });
      }

      if (availRes.data && availRes.data.length > 0) {
        setAvailability(availRes.data.map(a => ({
          id: a.id, day_of_week: a.day_of_week ?? 0,
          start_time: a.start_time || '08:00', end_time: a.end_time || '17:00',
          is_available: a.is_available ?? true
        })));
      } else {
        setAvailability(DAY_NAMES.map((_, i) => ({
          day_of_week: i, start_time: '08:00', end_time: '17:00',
          is_available: i >= 1 && i <= 5
        })));
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error: pErr } = await supabase.from('profiles')
        .update({ name: formData.name, phone: formData.phone }).eq('id', user.id);
      if (pErr) throw pErr;

      const { error: gErr } = await supabase.from('gardener_profiles')
        .update({
          bio: formData.bio, location: formData.location, experience: formData.experience,
          hourly_rate: formData.hourly_rate, languages: formData.languages,
          services: formData.services, is_available: formData.is_available
        }).eq('id', user.id);
      if (gErr) throw gErr;

      // Save availability
      for (const slot of availability) {
        if (slot.id) {
          await supabase.from('gardener_availability').update({
            start_time: slot.start_time, end_time: slot.end_time, is_available: slot.is_available
          }).eq('id', slot.id);
        } else {
          await supabase.from('gardener_availability').insert({
            gardener_id: user.id, day_of_week: slot.day_of_week,
            start_time: slot.start_time, end_time: slot.end_time, is_available: slot.is_available
          });
        }
      }

      toast.success('تم حفظ جميع التغييرات بنجاح!');
      fetchAllData();
    } catch (err: any) {
      console.error('Save error:', err);
      toast.error('خطأ في حفظ التغييرات');
    } finally {
      setSaving(false);
    }
  };

  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const toggleLanguage = (lang: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
  };

  const updateAvailability = (index: number, field: keyof AvailabilitySlot, value: any) => {
    setAvailability(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-green-600" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (profile?.user_type !== 'gardener') return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">ملفي الشخصي</h1>
            <p className="text-gray-600 mt-1">عدّل معلوماتك الشخصية وخدماتك وأسعارك</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <Star className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                <p className="text-2xl font-bold">{stats.rating.toFixed(1)}</p>
                <p className="text-xs text-gray-500">التقييم</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <User className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                <p className="text-2xl font-bold">{stats.review_count}</p>
                <p className="text-xs text-gray-500">التقييمات</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="w-6 h-6 text-green-500 mx-auto mb-1" />
                <p className="text-2xl font-bold">{stats.total_bookings}</p>
                <p className="text-xs text-gray-500">إجمالي الحجوزات</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Briefcase className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-xs text-gray-500">مكتملة</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="w-5 h-5 text-green-600" />
                  المعلومات الأساسية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>الاسم الكامل</Label>
                    <Input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="mt-1" />
                  </div>
                  <div>
                    <Label>رقم الهاتف</Label>
                    <Input value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} placeholder="+212 6XX XXX XXX" className="mt-1" />
                  </div>
                  <div>
                    <Label>البريد الإلكتروني</Label>
                    <Input value={user.email || ''} disabled className="mt-1 bg-gray-100" />
                  </div>
                  <div>
                    <Label>سنوات الخبرة</Label>
                    <Input value={formData.experience} onChange={e => setFormData(p => ({ ...p, experience: e.target.value }))} placeholder="مثال: 5 سنوات" className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label>الموقع / المدينة</Label>
                  <Input value={formData.location} onChange={e => setFormData(p => ({ ...p, location: e.target.value }))} placeholder="مثال: الرباط، المغرب" className="mt-1" />
                </div>
                <div>
                  <Label>نبذة عنك</Label>
                  <Textarea value={formData.bio} onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))} rows={4} placeholder="اكتب نبذة مختصرة عن خبراتك..." className="mt-1" />
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">متاح للعمل</p>
                    <p className="text-sm text-gray-500">عند التفعيل، يمكن للعملاء حجز خدماتك</p>
                  </div>
                  <Switch checked={formData.is_available} onCheckedChange={v => setFormData(p => ({ ...p, is_available: v }))} />
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  السعر
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-w-xs">
                  <Label>السعر بالساعة (درهم)</Label>
                  <Input
                    type="number" min={0}
                    value={formData.hourly_rate}
                    onChange={e => setFormData(p => ({ ...p, hourly_rate: Number(e.target.value) }))}
                    className="mt-1 text-lg font-bold"
                  />
                  <p className="text-sm text-gray-500 mt-1">هذا السعر سيظهر في ملفك العام</p>
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Briefcase className="w-5 h-5 text-green-600" />
                  الخدمات ({formData.services.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_SERVICES.map(service => {
                    const active = formData.services.includes(service);
                    return (
                      <button
                        key={service}
                        onClick={() => toggleService(service)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                          active
                            ? 'bg-green-600 text-white border-green-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'
                        }`}
                      >
                        {active ? <X className="w-3 h-3 inline ml-1" /> : <Plus className="w-3 h-3 inline ml-1" />}
                        {service}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe className="w-5 h-5 text-green-600" />
                  اللغات ({formData.languages.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_LANGUAGES.map(lang => {
                    const active = formData.languages.includes(lang);
                    return (
                      <button
                        key={lang}
                        onClick={() => toggleLanguage(lang)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                          active
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {active ? <X className="w-3 h-3 inline ml-1" /> : <Plus className="w-3 h-3 inline ml-1" />}
                        {lang}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5 text-green-600" />
                  أوقات العمل
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availability.map((slot, i) => (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${slot.is_available ? 'bg-white' : 'bg-gray-50 opacity-60'}`}>
                      <Switch checked={slot.is_available} onCheckedChange={v => updateAvailability(i, 'is_available', v)} />
                      <span className="font-medium w-20 text-sm">{DAY_NAMES[slot.day_of_week]}</span>
                      {slot.is_available && (
                        <div className="flex items-center gap-2">
                          <Input type="time" value={slot.start_time} onChange={e => updateAvailability(i, 'start_time', e.target.value)} className="w-32" />
                          <span className="text-gray-400">→</span>
                          <Input type="time" value={slot.end_time} onChange={e => updateAvailability(i, 'end_time', e.target.value)} className="w-32" />
                        </div>
                      )}
                      {!slot.is_available && <span className="text-sm text-gray-400">غير متاح</span>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Save */}
            <div className="flex justify-end sticky bottom-4">
              <Button onClick={handleSave} disabled={saving} size="lg" className="bg-green-600 hover:bg-green-700 shadow-lg">
                {saving ? <Loader2 className="w-5 h-5 ml-2 animate-spin" /> : <Save className="w-5 h-5 ml-2" />}
                {saving ? 'جاري الحفظ...' : 'حفظ جميع التغييرات'}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GardenerMyProfilePage;

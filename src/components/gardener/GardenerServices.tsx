import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Save } from 'lucide-react';
import { useGardenerData } from '@/hooks/useGardenerData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/context/useAuth';

const AVAILABLE_SERVICES = [
  'تصميم الحدائق',
  'قص العشب',
  'زراعة الأشجار',
  'العناية بالنباتات',
  'التسميد',
  'زراعة الورود',
  'النباتات الزينة',
  'السقي الذكي',
  'الزراعة العضوية',
  'صيانة الحدائق',
  'تقليم الأشجار',
  'مكافحة الآفات',
  'تركيب أنظمة الري',
  'تنسيق الحدائق'
];

const GardenerServices: React.FC = () => {
  const { user } = useAuth();
  const { profile, loading, refetch } = useGardenerData();
  const [services, setServices] = useState<string[]>(profile?.services || []);
  const [hourlyRate, setHourlyRate] = useState<number>(profile?.hourly_rate || 0);
  const [newService, setNewService] = useState('');
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (profile) {
      setServices(profile.services || []);
      setHourlyRate(profile.hourly_rate || 0);
    }
  }, [profile]);

  const addService = (service: string) => {
    if (service && !services.includes(service)) {
      setServices([...services, service]);
    }
    setNewService('');
  };

  const removeService = (service: string) => {
    setServices(services.filter(s => s !== service));
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('gardener_profiles')
        .update({
          services,
          hourly_rate: hourlyRate
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('تم حفظ التغييرات بنجاح!');
      refetch();
    } catch (error: any) {
      console.error('Error saving services:', error);
      toast.error('حدث خطأ في حفظ التغييرات');
    } finally {
      setSaving(false);
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
      {/* Hourly Rate */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">سعر الساعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="w-32 text-center"
              min={0}
            />
            <span className="text-gray-600">درهم / ساعة</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            هذا السعر سيظهر في ملفك الشخصي للعملاء
          </p>
        </CardContent>
      </Card>

      {/* Current Services */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">الخدمات المقدمة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-6">
            {services.length === 0 ? (
              <p className="text-gray-500">لم تضف أي خدمات بعد</p>
            ) : (
              services.map((service) => (
                <Badge
                  key={service}
                  variant="secondary"
                  className="bg-green-100 text-green-800 px-3 py-1 flex items-center gap-2"
                >
                  {service}
                  <button
                    onClick={() => removeService(service)}
                    className="hover:text-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))
            )}
          </div>

          {/* Add Custom Service */}
          <div className="flex gap-2 mb-6">
            <Input
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              placeholder="أضف خدمة جديدة..."
              onKeyPress={(e) => e.key === 'Enter' && addService(newService)}
            />
            <Button
              onClick={() => addService(newService)}
              disabled={!newService}
              className="bg-green-500 hover:bg-green-600"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Available Services */}
          <div>
            <p className="text-sm text-gray-600 mb-3">اختر من الخدمات الشائعة:</p>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SERVICES.filter(s => !services.includes(s)).map((service) => (
                <Button
                  key={service}
                  variant="outline"
                  size="sm"
                  onClick={() => addService(service)}
                  className="text-sm"
                >
                  <Plus className="w-3 h-3 ml-1" />
                  {service}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-500 hover:bg-green-600"
        >
          <Save className="w-4 h-4 ml-2" />
          {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </Button>
      </div>
    </div>
  );
};

export default GardenerServices;

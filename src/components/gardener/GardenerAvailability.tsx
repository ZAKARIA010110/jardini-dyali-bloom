import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Save, Clock } from 'lucide-react';
import { useAuth } from '@/context/useAuth';
import { useGardenerData } from '@/hooks/useGardenerData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const DAYS_OF_WEEK = [
  { value: 0, label: 'الأحد' },
  { value: 1, label: 'الإثنين' },
  { value: 2, label: 'الثلاثاء' },
  { value: 3, label: 'الأربعاء' },
  { value: 4, label: 'الخميس' },
  { value: 5, label: 'الجمعة' },
  { value: 6, label: 'السبت' }
];

interface DayAvailability {
  day_of_week: number;
  is_available: boolean;
  start_time: string;
  end_time: string;
}

const GardenerAvailability: React.FC = () => {
  const { user } = useAuth();
  const { profile, availability: savedAvailability, loading, refetch } = useGardenerData();
  const [isAvailable, setIsAvailable] = useState(profile?.is_available ?? true);
  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setIsAvailable(profile.is_available ?? true);
    }
    
    // Initialize availability for all days
    const defaultAvailability = DAYS_OF_WEEK.map(day => {
      const saved = savedAvailability.find(a => a.day_of_week === day.value);
      return {
        day_of_week: day.value,
        is_available: saved?.is_available ?? (day.value !== 0 && day.value !== 6), // Default: Mon-Fri available
        start_time: saved?.start_time || '09:00',
        end_time: saved?.end_time || '18:00'
      };
    });
    setAvailability(defaultAvailability);
  }, [profile, savedAvailability]);

  const updateDayAvailability = (dayIndex: number, field: keyof DayAvailability, value: any) => {
    setAvailability(prev => prev.map(day => 
      day.day_of_week === dayIndex ? { ...day, [field]: value } : day
    ));
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // Update gardener profile availability status
      const { error: profileError } = await supabase
        .from('gardener_profiles')
        .update({ is_available: isAvailable })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Delete existing availability records
      await supabase
        .from('gardener_availability')
        .delete()
        .eq('gardener_id', user.id);

      // Insert new availability records
      const availabilityRecords = availability.map(day => ({
        gardener_id: user.id,
        day_of_week: day.day_of_week,
        is_available: day.is_available,
        start_time: day.start_time,
        end_time: day.end_time
      }));

      const { error: availabilityError } = await supabase
        .from('gardener_availability')
        .insert(availabilityRecords);

      if (availabilityError) throw availabilityError;

      toast.success('تم حفظ التغييرات بنجاح!');
      refetch();
    } catch (error: any) {
      console.error('Error saving availability:', error);
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
      {/* General Availability */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">الحالة العامة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">متاح للعمل</p>
              <p className="text-sm text-gray-500">
                عند إيقاف هذا الخيار، لن يتمكن العملاء من حجز مواعيد جديدة
              </p>
            </div>
            <Switch
              checked={isAvailable}
              onCheckedChange={setIsAvailable}
            />
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5" />
            جدول العمل الأسبوعي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {DAYS_OF_WEEK.map((day) => {
              const dayAvailability = availability.find(a => a.day_of_week === day.value);
              return (
                <div 
                  key={day.value} 
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    dayAvailability?.is_available ? 'bg-green-50' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={dayAvailability?.is_available ?? false}
                      onCheckedChange={(checked) => updateDayAvailability(day.value, 'is_available', checked)}
                    />
                    <span className={`font-medium w-20 ${!dayAvailability?.is_available && 'text-gray-400'}`}>
                      {day.label}
                    </span>
                  </div>
                  
                  {dayAvailability?.is_available && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={dayAvailability?.start_time || '09:00'}
                        onChange={(e) => updateDayAvailability(day.value, 'start_time', e.target.value)}
                        className="w-28"
                      />
                      <span className="text-gray-500">إلى</span>
                      <Input
                        type="time"
                        value={dayAvailability?.end_time || '18:00'}
                        onChange={(e) => updateDayAvailability(day.value, 'end_time', e.target.value)}
                        className="w-28"
                      />
                    </div>
                  )}
                </div>
              );
            })}
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

export default GardenerAvailability;

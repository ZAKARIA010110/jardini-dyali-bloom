import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Save, User, MapPin, Phone, Globe, Plus, X } from 'lucide-react';
import { useAuth } from '@/context/useAuth';
import { useGardenerData } from '@/hooks/useGardenerData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AVAILABLE_LANGUAGES = ['العربية', 'الفرنسية', 'الإنجليزية', 'الأمازيغية', 'الإسبانية'];

const GardenerProfile: React.FC = () => {
  const { user, profile: authProfile } = useAuth();
  const { profile, loading, refetch } = useGardenerData();
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    experience: '',
    languages: [] as string[]
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile && authProfile) {
      setFormData({
        name: authProfile.name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        experience: profile.experience || '',
        languages: profile.languages || []
      });
    }
  }, [profile, authProfile]);

  const addLanguage = (language: string) => {
    if (!formData.languages.includes(language)) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, language]
      }));
    }
  };

  const removeLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== language)
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // Update main profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ name: formData.name })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update gardener profile
      const { error: gardenerError } = await supabase
        .from('gardener_profiles')
        .update({
          bio: formData.bio,
          location: formData.location,
          experience: formData.experience,
          languages: formData.languages
        })
        .eq('id', user.id);

      if (gardenerError) throw gardenerError;

      toast.success('تم حفظ التغييرات بنجاح!');
      refetch();
    } catch (error: any) {
      console.error('Error saving profile:', error);
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
      {/* Basic Info */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <User className="w-5 h-5" />
            المعلومات الأساسية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="experience">سنوات الخبرة</Label>
              <Input
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                placeholder="مثال: 5 سنوات"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            الموقع
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="مثال: الرباط، المغرب"
          />
          <p className="text-sm text-gray-500 mt-2">
            أدخل المدينة أو المنطقة التي تقدم فيها خدماتك
          </p>
        </CardContent>
      </Card>

      {/* Bio */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">نبذة عنك</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="اكتب نبذة مختصرة عن نفسك وخبراتك في مجال البستنة..."
            rows={4}
          />
          <p className="text-sm text-gray-500 mt-2">
            هذه النبذة ستظهر في ملفك الشخصي للعملاء
          </p>
        </CardContent>
      </Card>

      {/* Languages */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Globe className="w-5 h-5" />
            اللغات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.languages.length === 0 ? (
              <p className="text-gray-500">لم تضف أي لغات بعد</p>
            ) : (
              formData.languages.map((language) => (
                <Badge
                  key={language}
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 px-3 py-1 flex items-center gap-2"
                >
                  {language}
                  <button
                    onClick={() => removeLanguage(language)}
                    className="hover:text-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {AVAILABLE_LANGUAGES.filter(l => !formData.languages.includes(l)).map((language) => (
              <Button
                key={language}
                variant="outline"
                size="sm"
                onClick={() => addLanguage(language)}
                className="text-sm"
              >
                <Plus className="w-3 h-3 ml-1" />
                {language}
              </Button>
            ))}
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

export default GardenerProfile;

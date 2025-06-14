import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth'; // UPDATED
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { User, Settings, Save, ArrowLeft } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  user_type: string;
  avatar_url?: string;
}

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login');
        return;
      }
      fetchProfile();
    }
  }, [user, authLoading, navigate]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        toast.error('خطأ في تحميل الملف الشخصي');
      } else if (profileData) {
        setProfile(profileData);
        setName(profileData.name || '');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name,
          user_type: profile?.user_type || 'homeowner'
        });

      if (error) throw error;

      toast.success('تم حفظ التغييرات بنجاح');
      fetchProfile();
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error('خطأ في حفظ التغييرات');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="ml-4"
              >
                <ArrowLeft className="w-4 h-4 ml-2" />
                رجوع
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">الملف الشخصي</h1>
            </div>
            <p className="text-gray-600">إدارة معلوماتك الشخصية</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-6">
              <Settings className="w-5 h-5 text-green-600 ml-2" />
              <h2 className="text-xl font-bold text-gray-900">معلومات المستخدم</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Avatar */}
              <div className="md:col-span-2 flex justify-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-green-600" />
                </div>
              </div>

              {/* Name Field */}
              <div className="md:col-span-2">
                <Label htmlFor="name" className="text-gray-700 font-medium">
                  الاسم الكامل
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>

              {/* Email Field (Read-only) */}
              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  className="mt-2 bg-gray-100"
                  disabled
                />
              </div>

              {/* User Type Field (Read-only) */}
              <div>
                <Label htmlFor="userType" className="text-gray-700 font-medium">
                  نوع الحساب
                </Label>
                <Input
                  id="userType"
                  value={
                    profile?.user_type === 'admin' ? 'مدير' :
                    profile?.user_type === 'gardener' ? 'بستاني' : 'مالك منزل'
                  }
                  className="mt-2 bg-gray-100"
                  disabled
                />
              </div>

              {/* Save Button */}
              <div className="md:col-span-2 flex justify-end space-x-4 rtl:space-x-reverse pt-4">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 ml-2" />
                  {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;

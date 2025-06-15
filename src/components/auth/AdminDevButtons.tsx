
import React from 'react';
import { Button } from '../ui/button';
import { Settings, Database, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../integrations/supabase/client';
import { createAdminForCurrentUser } from '../../context/adminUtils';

interface AdminDevButtonsProps {
  loading: boolean;
  isRetrying: boolean;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
}

const AdminDevButtons: React.FC<AdminDevButtonsProps> = ({ 
  loading, 
  isRetrying, 
  setEmail, 
  setPassword 
}) => {
  const handleCreateAdmin = async () => {
    try {
      console.log('Creating admin user...');
      
      // Create new admin user
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: 'zakariadrk00@gmail.com',
        password: 'admin123456',
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: 'Zakaria Admin',
            user_type: 'admin'
          }
        }
      });

      if (signupError) {
        if (signupError.message.includes('already registered')) {
          toast.info('حساب المدير موجود بالفعل. يمكنك تسجيل الدخول مباشرة');
          setEmail('zakariadrk00@gmail.com');
          setPassword('admin123456');
          return;
        }
        throw signupError;
      }

      if (signupData.user) {
        console.log('Admin user created:', signupData.user.id);
        toast.success('تم إنشاء حساب المدير بنجاح! يمكنك الآن تسجيل الدخول');
        setEmail('zakariadrk00@gmail.com');
        setPassword('admin123456');
      }
    } catch (error: any) {
      console.error('Admin creation error:', error);
      toast.error('فشل في إنشاء حساب المدير: ' + error.message);
    }
  };

  const handleMakeCurrentUserAdmin = async () => {
    try {
      console.log('Making current user admin...');
      
      const result = await createAdminForCurrentUser();
      
      if (result.success) {
        toast.success('تم تحويل المستخدم الحالي إلى مدير بنجاح!');
        // Reload the page to refresh admin status
        window.location.reload();
      } else {
        toast.error('فشل في تحويل المستخدم إلى مدير: ' + result.error);
      }
    } catch (error: any) {
      console.error('Make admin error:', error);
      toast.error('حدث خطأ: ' + error.message);
    }
  };

  const handleResetData = async () => {
    try {
      console.log('Resetting data...');
      
      // Clear existing data
      await supabase.from('bookings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('admin_chat').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('gardeners').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      // Insert sample gardeners
      const { error: gardenersError } = await supabase.from('gardeners').insert([
        {
          id: 'aaaa1111-1111-1111-1111-111111111111',
          name: 'يوسف البستاني',
          location: 'الرباط',
          bio: 'بستاني محترف مع خبرة 8 سنوات في تصميم وصيانة الحدائق',
          hourly_rate: 80,
          experience: '8 سنوات',
          services: ['تصميم الحدائق', 'قص العشب', 'زراعة الأشجار'],
          rating: 4.8,
          review_count: 127,
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          phone: '+212661234567',
          email: 'youssef@example.com',
          languages: ['العربية', 'الفرنسية']
        },
        {
          id: 'bbbb2222-2222-2222-2222-222222222222',
          name: 'محمد الحديقي',
          location: 'الدار البيضاء',
          bio: 'خبير في العناية بالنباتات والأشجار المثمرة',
          hourly_rate: 75,
          experience: '6 سنوات',
          services: ['العناية بالنباتات', 'قص العشب', 'التسميد'],
          rating: 4.9,
          review_count: 98,
          avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          phone: '+212662345678',
          email: 'mohamed@example.com',
          languages: ['العربية', 'الإنجليزية']
        },
        {
          id: 'cccc3333-3333-3333-3333-333333333333',
          name: 'أمين الورديغي',
          location: 'فاس',
          bio: 'متخصص في زراعة الورود والنباتات الزينة',
          hourly_rate: 70,
          experience: '5 سنوات',
          services: ['زراعة الورود', 'النباتات الزينة', 'التصميم'],
          rating: 4.7,
          review_count: 89,
          avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
          phone: '+212663456789',
          email: 'amine@example.com',
          languages: ['العربية', 'الفرنسية']
        },
        {
          id: 'dddd4444-4444-4444-4444-444444444444',
          name: 'عبدالله الفلاح',
          location: 'مراكش',
          bio: 'بستاني شاب ومتحمس مع تركيز على الاستدامة',
          hourly_rate: 65,
          experience: '3 سنوات',
          services: ['السقي الذكي', 'الزراعة العضوية', 'صيانة الحدائق'],
          rating: 4.6,
          review_count: 54,
          avatar_url: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150',
          phone: '+212664567890',
          email: 'abdullah@example.com',
          languages: ['العربية']
        }
      ]);

      if (gardenersError) {
        console.error('Gardeners insert error:', gardenersError);
      }

      // Insert sample bookings
      const { error: bookingsError } = await supabase.from('bookings').insert([
        {
          id: 'book1111-1111-1111-1111-111111111111',
          gardener_id: 'aaaa1111-1111-1111-1111-111111111111',
          client_name: 'أحمد محمد',
          gardener_name: 'يوسف البستاني',
          service: 'تصميم الحديقة',
          booking_date: '2024-06-15',
          booking_time: '10:00 - 12:00',
          status: 'مؤكد',
          price: '500 درهم'
        },
        {
          id: 'book2222-2222-2222-2222-222222222222',
          gardener_id: 'bbbb2222-2222-2222-2222-222222222222',
          client_name: 'فاطمة الزهراء',
          gardener_name: 'محمد الحديقي',
          service: 'قص العشب',
          booking_date: '2024-06-16',
          booking_time: '14:00 - 16:00',
          status: 'قيد الانتظار',
          price: '200 درهم'
        },
        {
          id: 'book3333-3333-3333-3333-333333333333',
          gardener_id: 'cccc3333-3333-3333-3333-333333333333',
          client_name: 'سارة العلوي',
          gardener_name: 'أمين الورديغي',
          service: 'تنظيف وتسميد',
          booking_date: '2024-06-17',
          booking_time: '09:00 - 11:30',
          status: 'مؤكد',
          price: '350 درهم'
        },
        {
          id: 'book4444-4444-4444-4444-444444444444',
          gardener_id: 'dddd4444-4444-4444-4444-444444444444',
          client_name: 'زكريا أمجاد',
          gardener_name: 'عبدالله الفلاح',
          service: 'سقي وصيانة',
          booking_date: '2024-06-18',
          booking_time: '16:00 - 18:00',
          status: 'ملغي',
          price: '250 درهم'
        }
      ]);

      if (bookingsError) {
        console.error('Bookings insert error:', bookingsError);
      }

      toast.success('تم إعادة تعيين البيانات بنجاح!');
    } catch (error: any) {
      console.error('Data reset error:', error);
      toast.error('فشل في إعادة تعيين البيانات: ' + error.message);
    }
  };

  return (
    <div className="space-y-3">
      {/* Admin Setup Button - Now visible for setup */}
      <Button
        type="button"
        onClick={handleCreateAdmin}
        variant="outline"
        className="w-full border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white"
        disabled={loading || isRetrying}
      >
        <Settings className="w-4 h-4 ml-2" />
        إعداد حساب المدير
      </Button>

      {/* Make Current User Admin Button */}
      <Button
        type="button"
        onClick={handleMakeCurrentUserAdmin}
        variant="outline"
        className="w-full border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
        disabled={loading || isRetrying}
      >
        <Shield className="w-4 h-4 ml-2" />
        جعل المستخدم الحالي مدير
      </Button>

      {/* Reset Data Button - For development */}
      <Button
        type="button"
        onClick={handleResetData}
        variant="outline"
        className="w-full border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
        disabled={loading || isRetrying}
      >
        <Database className="w-4 h-4 ml-2" />
        إعادة تعيين البيانات التجريبية
      </Button>
    </div>
  );
};

export default AdminDevButtons;

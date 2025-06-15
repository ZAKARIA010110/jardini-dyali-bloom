
import { useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

export interface GardenerApplicationData {
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
}

export const useGardenerApplication = () => {
  const [loading, setLoading] = useState(false);

  const submitApplication = async (data: GardenerApplicationData): Promise<boolean> => {
    setLoading(true);
    try {
      console.log('Submitting gardener application:', data);

      // Submit application without requiring authentication
      const { error } = await supabase
        .from('gardener_applications')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          city: data.city,
          experience: data.experience,
          daily_rate: data.daily_rate,
          bio: data.bio,
          services: data.services,
          languages: data.languages,
          avatar_url: data.avatar_url,
          status: 'pending'
        });

      if (error) {
        console.error('Error submitting application:', error);
        throw error;
      }

      console.log('Application submitted successfully');
      toast.success('تم إرسال طلبك بنجاح! سيتم مراجعته خلال 24 ساعة');
      return true;

    } catch (error: any) {
      console.error('Application submission error:', error);
      toast.error('حدث خطأ في إرسال الطلب: ' + (error.message || 'خطأ غير متوقع'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `gardener-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading avatar:', uploadError);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Avatar upload error:', error);
      return null;
    }
  };

  return {
    submitApplication,
    uploadAvatar,
    loading
  };
};

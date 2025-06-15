
-- إصلاح مشكلة RLS في جدول admin_notifications
-- السماح للدوال بإدراج الإشعارات بدون قيود RLS

-- حذف السياسة الحالية إن وجدت
DROP POLICY IF EXISTS "Admins can view all notifications" ON public.admin_notifications;

-- إنشاء سياسة جديدة للقراءة للمديرين فقط
CREATE POLICY "Admins can view all notifications" 
  ON public.admin_notifications 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'admin'
    )
  );

-- إنشاء سياسة للإدراج تسمح للدوال النظام بإدراج الإشعارات
CREATE POLICY "System can insert notifications" 
  ON public.admin_notifications 
  FOR INSERT 
  WITH CHECK (true);

-- تحديث الدالة لتكون SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.notify_admin_new_gardener()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.admin_notifications (type, title, message, data)
  VALUES (
    'new_gardener_application',
    'طلب بستاني جديد',
    'تم تقديم طلب تسجيل بستاني جديد من ' || NEW.name,
    jsonb_build_object(
      'application_id', NEW.id,
      'gardener_name', NEW.name,
      'gardener_email', NEW.email,
      'city', NEW.city
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

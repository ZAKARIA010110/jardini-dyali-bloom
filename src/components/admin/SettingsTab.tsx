
import React, { useState } from 'react';
import { Settings, Bell, Lock, Globe, Mail, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';

const SettingsTab: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">إعدادات النظام</h2>
        <p className="text-gray-600">إدارة إعدادات المنصة والأمان</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <Settings className="w-5 h-5" />
              <span>الإعدادات العامة</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم المنصة
              </label>
              <Input defaultValue="Jardini Dyali" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف المنصة
              </label>
              <Input defaultValue="منصة لخدمات البستنة في المغرب" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني للدعم
              </label>
              <Input defaultValue="support@jardini-dyali.com" />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <Bell className="w-5 h-5" />
              <span>إعدادات الإشعارات</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  إشعارات البريد الإلكتروني
                </label>
                <p className="text-xs text-gray-500">
                  إرسال إشعارات عبر البريد الإلكتروني
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  إشعارات الرسائل النصية
                </label>
                <p className="text-xs text-gray-500">
                  إرسال إشعارات عبر الرسائل النصية
                </p>
              </div>
              <Switch
                checked={smsNotifications}
                onCheckedChange={setSmsNotifications}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <Lock className="w-5 h-5" />
              <span>إعدادات الأمان</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">
              <Shield className="w-4 h-4 ml-2" />
              تغيير كلمة المرور
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  وضع الصيانة
                </label>
                <p className="text-xs text-gray-500">
                  تعطيل الوصول للمستخدمين مؤقتاً
                </p>
              </div>
              <Switch
                checked={maintenanceMode}
                onCheckedChange={setMaintenanceMode}
              />
            </div>
          </CardContent>
        </Card>

        {/* Language & Localization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <Globe className="w-5 h-5" />
              <span>اللغة والتوطين</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اللغة الافتراضية
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option value="ar">العربية</option>
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المنطقة الزمنية
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option value="Africa/Casablanca">المغرب (GMT+1)</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          حفظ الإعدادات
        </Button>
      </div>
    </div>
  );
};

export default SettingsTab;

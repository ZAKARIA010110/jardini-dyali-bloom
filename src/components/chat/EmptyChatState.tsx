
import React from 'react';
import { Bot } from 'lucide-react';

export const EmptyChatState: React.FC = () => {
  return (
    <div className="text-center text-gray-500 py-8">
      <Bot className="w-12 h-12 mx-auto mb-2 text-gray-400" />
      <p>مرحباً بك في دردشة الدعم الفني</p>
      <p className="text-sm">اكتب رسالتك للتواصل مع فريق جارديني ديالي</p>
    </div>
  );
};

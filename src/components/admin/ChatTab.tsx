
import React from 'react';
import { MessageCircle } from 'lucide-react';
import AdminChat from '../AdminChat';

const ChatTab = () => {
  return (
    <div className="bg-white rounded-lg shadow mb-8 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <MessageCircle className="w-5 h-5 ml-2" />
        دردشة الدعم الفني
      </h2>
      <AdminChat />
    </div>
  );
};

export default ChatTab;

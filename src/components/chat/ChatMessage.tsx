
import React from 'react';
import { Bot, User } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../../types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message }) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('ar-MA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      className={`flex ${message.message_type === 'admin' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          message.message_type === 'admin'
            ? 'bg-[#4CAF50] text-white'
            : message.message_type === 'support'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-800'
        }`}
      >
        <div className="flex items-center mb-1">
          {message.message_type === 'admin' ? (
            <User className="w-3 h-3 ml-1" />
          ) : (
            <Bot className="w-3 h-3 ml-1" />
          )}
          <span className="text-xs opacity-75">
            {message.message_type === 'admin' ? 'أنت' : 'الدعم الفني'}
          </span>
        </div>
        <p className="text-sm">{message.message}</p>
        <p className="text-xs opacity-75 mt-1">
          {formatTime(message.created_at)}
        </p>
      </div>
    </div>
  );
};

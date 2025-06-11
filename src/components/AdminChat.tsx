
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MessageCircle } from 'lucide-react';
import { useAdminChat } from '../hooks/useAdminChat';
import { MessagesList } from './chat/MessagesList';
import { MessageInput } from './chat/MessageInput';

const AdminChat = () => {
  const {
    messages,
    newMessage,
    setNewMessage,
    loading,
    sendMessage,
    handleKeyPress
  } = useAdminChat();

  return (
    <Card className="h-96 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-right">
          <MessageCircle className="w-5 h-5 ml-2" />
          دردشة المدير - الدعم الفني
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-4">
        <MessagesList messages={messages} />
        <MessageInput
          value={newMessage}
          onChange={setNewMessage}
          onSend={sendMessage}
          onKeyPress={handleKeyPress}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
};

export default AdminChat;

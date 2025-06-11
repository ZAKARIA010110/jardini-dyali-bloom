
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../integrations/supabase/client';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MessageCircle, Send, Bot, User } from 'lucide-react';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  message: string;
  message_type: 'admin' | 'system' | 'support';
  created_at: string;
}

const AdminChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchMessages();
    
    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('admin_chat_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'admin_chat'
        },
        (payload) => {
          console.log('New message received:', payload);
          setMessages(prev => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_chat')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('خطأ في تحميل الرسائل');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('admin_chat')
        .insert({
          admin_id: user.id,
          message: newMessage.trim(),
          message_type: 'admin'
        });

      if (error) throw error;

      setNewMessage('');
      
      // Simulate system response after a short delay
      setTimeout(async () => {
        const responses = [
          'مرحباً! كيف يمكنني مساعدتك اليوم؟',
          'شكراً لتواصلك معنا. فريق الدعم سيرد عليك قريباً.',
          'تم استلام رسالتك. سنقوم بمراجعتها والرد عليك خلال 24 ساعة.',
          'هل تحتاج مساعدة إضافية في إدارة النظام؟',
          'تم تسجيل استفسارك. فريق جارديني ديالي في خدمتك.'
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        await supabase
          .from('admin_chat')
          .insert({
            admin_id: user.id,
            message: randomResponse,
            message_type: 'support'
          });
      }, 2000);

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('خطأ في إرسال الرسالة');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('ar-MA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="h-96 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-right">
          <MessageCircle className="w-5 h-5 ml-2" />
          دردشة المدير - الدعم الفني
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-4">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-3 max-h-64">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Bot className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>مرحباً بك في دردشة الدعم الفني</p>
              <p className="text-sm">اكتب رسالتك للتواصل مع فريق جارديني ديالي</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.message_type === 'admin' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.message_type === 'admin'
                      ? 'bg-[#4CAF50] text-white'
                      : msg.message_type === 'support'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <div className="flex items-center mb-1">
                    {msg.message_type === 'admin' ? (
                      <User className="w-3 h-3 ml-1" />
                    ) : (
                      <Bot className="w-3 h-3 ml-1" />
                    )}
                    <span className="text-xs opacity-75">
                      {msg.message_type === 'admin' ? 'أنت' : 'الدعم الفني'}
                    </span>
                  </div>
                  <p className="text-sm">{msg.message}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {formatTime(msg.created_at)}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="flex space-x-2 rtl:space-x-reverse">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="اكتب رسالتك هنا..."
            className="flex-1 text-right"
            disabled={loading}
          />
          <Button
            onClick={sendMessage}
            disabled={loading || !newMessage.trim()}
            className="bg-[#4CAF50] hover:bg-[#45a049]"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminChat;

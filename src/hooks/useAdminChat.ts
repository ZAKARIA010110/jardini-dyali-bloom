
import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth'; // FIXED import
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { ChatMessage } from '../types/chat';

export const useAdminChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

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
          const newMsg = payload.new as {
            id: string;
            message: string;
            message_type: string;
            created_at: string;
          };
          
          // Ensure message_type is properly typed
          if (newMsg.message_type === 'admin' || newMsg.message_type === 'system' || newMsg.message_type === 'support') {
            setMessages(prev => [...prev, {
              id: newMsg.id,
              message: newMsg.message,
              message_type: newMsg.message_type as 'admin' | 'system' | 'support',
              created_at: newMsg.created_at
            }]);
          }
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
      
      // Filter and type the messages properly
      const typedMessages = (data || []).filter(msg => 
        msg.message_type === 'admin' || msg.message_type === 'system' || msg.message_type === 'support'
      ).map(msg => ({
        id: msg.id,
        message: msg.message,
        message_type: msg.message_type as 'admin' | 'system' | 'support',
        created_at: msg.created_at
      }));
      
      setMessages(typedMessages);
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

  return {
    messages,
    newMessage,
    setNewMessage,
    loading,
    sendMessage,
    handleKeyPress
  };
};

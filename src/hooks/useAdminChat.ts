import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
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
    
    const channel = supabase
      .channel('admin_chat_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'admin_chat' }, (payload) => {
        const newMsg = payload.new as any;
        setMessages(prev => [...prev, {
          id: newMsg.id,
          message: newMsg.message,
          message_type: newMsg.sender_type as 'admin' | 'system' | 'support',
          created_at: newMsg.created_at
        }]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase.from('admin_chat').select('*').order('created_at', { ascending: true });
      if (error) throw error;
      
      const typedMessages = (data || []).map(msg => ({
        id: msg.id,
        message: msg.message,
        message_type: msg.sender_type as 'admin' | 'system' | 'support',
        created_at: msg.created_at
      }));
      setMessages(typedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('admin_chat').insert({
        user_id: user.id,
        message: newMessage.trim(),
        sender_type: 'admin'
      });
      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('خطأ في إرسال الرسالة');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return { messages, newMessage, setNewMessage, loading, sendMessage, handleKeyPress };
};

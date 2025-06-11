
export interface ChatMessage {
  id: string;
  message: string;
  message_type: 'admin' | 'system' | 'support';
  created_at: string;
}

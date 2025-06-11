
import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Send } from 'lucide-react';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  loading: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  onKeyPress,
  loading
}) => {
  return (
    <div className="flex space-x-2 rtl:space-x-reverse">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={onKeyPress}
        placeholder="اكتب رسالتك هنا..."
        className="flex-1 text-right"
        disabled={loading}
      />
      <Button
        onClick={onSend}
        disabled={loading || !value.trim()}
        className="bg-[#4CAF50] hover:bg-[#45a049]"
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );
};


import React, { useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageType } from '../../types/chat';
import { ChatMessageComponent } from './ChatMessage';
import { EmptyChatState } from './EmptyChatState';

interface MessagesListProps {
  messages: ChatMessageType[];
}

export const MessagesList: React.FC<MessagesListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto mb-4 space-y-3 max-h-64">
      {messages.length === 0 ? (
        <EmptyChatState />
      ) : (
        messages.map((msg) => (
          <ChatMessageComponent key={msg.id} message={msg} />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

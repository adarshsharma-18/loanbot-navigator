
import React from 'react';

interface MessageBubbleProps {
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ content, sender, timestamp }) => {
  const formattedTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
      <div>
        <div className={`${sender === 'user' ? 'message-bubble-user' : 'message-bubble-ai'}`}>
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
        <div className={`text-xs mt-1 text-foreground/50 ${sender === 'user' ? 'text-right' : 'text-left'}`}>
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;

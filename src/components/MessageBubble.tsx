
import React from 'react';

interface MessageBubbleProps {
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  agent?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ content, sender, timestamp, agent }) => {
  const formattedTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Format agent name for display
  const formatAgentName = (agent?: string) => {
    if (!agent) return null;
    
    // Convert camel case to readable format
    const formatted = agent.replace(/([A-Z])/g, ' $1').trim();
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };
  
  const agentName = formatAgentName(agent);
  
  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
      <div>
        {sender === 'ai' && agentName && (
          <div className="text-xs mb-1 text-loan/70 font-medium">
            {agentName}
          </div>
        )}
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

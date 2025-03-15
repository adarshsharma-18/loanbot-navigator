
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
  
  // Helper to render content with proper formatting
  const renderFormattedContent = (content: string) => {
    // Split content by new lines to handle multi-line responses
    const lines = content.split('\n');
    
    return lines.map((line, index) => {
      // Check if this is a list item
      const isListItem = line.trim().startsWith('- ');
      
      // Check if this is a section header (ends with :)
      const isSectionHeader = line.trim().endsWith(':') && !line.includes(':');
      
      // Apply appropriate styling
      let className = '';
      if (isListItem) className = 'pl-2 flex';
      if (isSectionHeader) className = 'font-medium mt-2';
      
      // For list items, add a bullet point
      const formattedLine = isListItem ? (
        <span className="flex items-start">
          <span className="mr-2 mt-1 inline-block h-1.5 w-1.5 rounded-full bg-current"></span>
          <span>{line.replace('- ', '')}</span>
        </span>
      ) : line;
      
      return (
        <React.Fragment key={index}>
          {index > 0 && <br />}
          <span className={className}>{formattedLine}</span>
        </React.Fragment>
      );
    });
  };
  
  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
      <div>
        {sender === 'ai' && agentName && (
          <div className="text-xs mb-1 text-loan/70 font-medium">
            {agentName}
          </div>
        )}
        <div className={`${sender === 'user' ? 'message-bubble-user' : 'message-bubble-ai'}`}>
          <p className="whitespace-pre-wrap">{renderFormattedContent(content)}</p>
        </div>
        <div className={`text-xs mt-1 text-foreground/50 ${sender === 'user' ? 'text-right' : 'text-left'}`}>
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;

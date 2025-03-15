
import React from 'react';

interface MessageBubbleProps {
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  agentType?: 'intent_classifier' | 'loan_eligibility' | 'loan_application' | 'financial_literacy';
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ content, sender, timestamp, agentType }) => {
  const formattedTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const getAgentTypeLabel = () => {
    switch (agentType) {
      case 'intent_classifier':
        return 'Loan Advisor';
      case 'loan_eligibility':
        return 'Eligibility Checker';
      case 'loan_application':
        return 'Application Guide';
      case 'financial_literacy':
        return 'Financial Coach';
      default:
        return null;
    }
  };

  const agentLabel = sender === 'ai' ? getAgentTypeLabel() : null;
  
  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
      <div>
        {agentLabel && (
          <div className="text-xs text-foreground/70 mb-1 ml-1 font-medium">
            {agentLabel}
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

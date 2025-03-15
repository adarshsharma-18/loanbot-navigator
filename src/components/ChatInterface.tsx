
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import MessageBubble from './MessageBubble';
import VoiceButton from './VoiceButton';
import { useChat } from '../context/ChatContext';

const ChatInterface: React.FC = () => {
  const [message, setMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const { currentConversation, sendMessage, isProcessing } = useChat();
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [currentConversation?.messages]);
  
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (message.trim() && !isProcessing) {
      await sendMessage(message.trim());
      setMessage('');
      
      // Focus back to input
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  const handleVoiceResult = (transcript: string) => {
    if (transcript) {
      setMessage(transcript);
      setTimeout(() => {
        handleSubmit();
      }, 500);
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="chat-container flex-1">
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto mb-4 space-y-1 pr-2"
          style={{ maxHeight: 'calc(100vh - 240px)' }}
        >
          {currentConversation?.messages && currentConversation.messages.length > 0 ? (
            currentConversation.messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                content={msg.content}
                sender={msg.sender}
                timestamp={msg.timestamp}
                agentType={msg.agentType}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <div className="w-16 h-16 bg-loan/10 rounded-full flex items-center justify-center mb-4">
                <div className="w-8 h-8 bg-loan/20 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-loan rounded-full"></div>
                </div>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Ask me anything about loans</h3>
              <p className="max-w-md">I can help you find the right loan, understand interest rates, or check your eligibility.</p>
            </div>
          )}
          
          {isProcessing && (
            <div className="flex justify-start mb-4">
              <div className="message-bubble-ai flex items-center space-x-2">
                <div className="w-2 h-2 bg-loan rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-loan rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-loan rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="flex items-end space-x-2">
          <div className="relative flex-1">
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
              className="input-field min-h-[50px] max-h-[150px] py-3 pl-4 pr-12 resize-none"
              style={{ paddingRight: '3rem' }}
              disabled={isProcessing}
            />
            <button
              type="submit"
              className="absolute right-3 bottom-3 text-foreground/70 hover:text-loan transition-colors disabled:opacity-50"
              disabled={!message.trim() || isProcessing}
            >
              <Send size={20} />
            </button>
          </div>
          
          <VoiceButton 
            onResult={handleVoiceResult} 
            disabled={isProcessing}
          />
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;


import React from 'react';
import { useChat } from '../context/ChatContext';
import { MessageSquare, Trash2, Plus } from 'lucide-react';

const ChatHistory: React.FC = () => {
  const { 
    conversations, 
    currentConversation, 
    loadConversation, 
    deleteConversation,
    startNewConversation
  } = useChat();

  const formatDate = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const conversationDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (conversationDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (conversationDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  // Group conversations by date
  const groupedConversations = conversations.reduce((acc, conversation) => {
    const dateKey = formatDate(conversation.createdAt);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(conversation);
    return acc;
  }, {} as Record<string, typeof conversations>);

  return (
    <div className="h-full flex flex-col p-4">
      <div className="mb-4">
        <button 
          onClick={startNewConversation}
          className="w-full bg-loan text-white rounded-lg py-2 px-4 flex items-center justify-center space-x-2 hover:bg-loan-dark transition-colors"
        >
          <Plus size={18} />
          <span>New Chat</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2">
        {Object.entries(groupedConversations).map(([dateKey, convs]) => (
          <div key={dateKey} className="mb-4">
            <h3 className="text-xs text-foreground/50 font-medium mb-2 px-2">{dateKey}</h3>
            <div className="space-y-1">
              {convs.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => loadConversation(conversation.id)}
                  className={`w-full text-left p-2 rounded-lg flex items-center justify-between group transition-colors ${
                    currentConversation?.id === conversation.id 
                      ? 'bg-loan/10 text-loan' 
                      : 'hover:bg-secondary text-foreground'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <MessageSquare size={16} />
                    <span className="truncate">{conversation.title}</span>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conversation.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive/70 transition-opacity"
                    aria-label="Delete conversation"
                  >
                    <Trash2 size={16} />
                  </button>
                </button>
              ))}
            </div>
          </div>
        ))}
        
        {conversations.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <MessageSquare className="mb-2 opacity-20" size={40} />
            <p>No conversations yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;

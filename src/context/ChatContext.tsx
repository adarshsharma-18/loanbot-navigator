import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { classifyIntentAndGetResponse } from '../services/agentService';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  agent?: string;
  context?: Record<string, any>;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  currentAgent?: string;
  agentContext?: Record<string, any>;
}

interface ChatContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isProcessing: boolean;
  sendMessage: (content: string) => Promise<void>;
  startNewConversation: () => void;
  loadConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  clearConversations: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      const storedConversations = localStorage.getItem(`loanbot_conversations_${user.id}`);
      if (storedConversations) {
        try {
          const parsedConversations = JSON.parse(storedConversations).map((conv: any) => ({
            ...conv,
            createdAt: new Date(conv.createdAt),
            updatedAt: new Date(conv.updatedAt),
            messages: conv.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
          }));
          setConversations(parsedConversations);
          
          if (parsedConversations.length > 0) {
            setCurrentConversation(parsedConversations[0]);
          } else {
            startNewConversation();
          }
        } catch (error) {
          console.error('Error parsing conversations:', error);
          startNewConversation();
        }
      } else {
        startNewConversation();
      }
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated && user && conversations.length > 0) {
      localStorage.setItem(`loanbot_conversations_${user.id}`, JSON.stringify(conversations));
    }
  }, [conversations, isAuthenticated, user]);

  const startNewConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      title: `New Conversation ${conversations.length + 1}`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
  }, [conversations.length]);

  const loadConversation = useCallback((id: string) => {
    const conversation = conversations.find(conv => conv.id === id);
    if (conversation) {
      setCurrentConversation(conversation);
    }
  }, [conversations]);

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    if (currentConversation?.id === id) {
      if (conversations.length > 1) {
        const nextConversation = conversations.find(conv => conv.id !== id);
        setCurrentConversation(nextConversation || null);
      } else {
        startNewConversation();
      }
    }
  }, [conversations, currentConversation, startNewConversation]);

  const clearConversations = useCallback(() => {
    setConversations([]);
    startNewConversation();
  }, [startNewConversation]);

  const sendMessage = async (content: string) => {
    if (!currentConversation) {
      startNewConversation();
    }
    
    setIsProcessing(true);
    
    try {
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        content,
        sender: 'user',
        timestamp: new Date(),
      };
      
      const updatedConversation = {
        ...currentConversation!,
        messages: [...currentConversation!.messages, userMessage],
        updatedAt: new Date(),
      };
      
      let conversationToUpdate = updatedConversation;
      if (updatedConversation.messages.length === 1) {
        const title = content.length > 30 ? `${content.substring(0, 30)}...` : content;
        conversationToUpdate = {
          ...updatedConversation,
          title,
        };
      }
      
      setCurrentConversation(conversationToUpdate);
      
      setConversations(prev => 
        prev.map(conv => conv.id === conversationToUpdate.id ? conversationToUpdate : conv)
      );
      
      const agentResponse = await classifyIntentAndGetResponse(content);
      
      const aiMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        content: agentResponse.text,
        sender: 'ai',
        timestamp: new Date(),
        agent: agentResponse.agent,
        context: agentResponse.context,
      };
      
      const finalConversation = {
        ...conversationToUpdate,
        messages: [...conversationToUpdate.messages, aiMessage],
        updatedAt: new Date(),
        currentAgent: agentResponse.agent,
        agentContext: agentResponse.context,
      };
      
      setCurrentConversation(finalConversation);
      
      setConversations(prev => 
        prev.map(conv => conv.id === finalConversation.id ? finalConversation : conv)
      );
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to get a response. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversation,
        isProcessing,
        sendMessage,
        startNewConversation,
        loadConversation,
        deleteConversation,
        clearConversations,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

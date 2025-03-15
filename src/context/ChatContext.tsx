
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  agentType?: 'intent_classifier' | 'loan_eligibility' | 'loan_application' | 'financial_literacy';
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
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

// API settings
const AGENT_API_URL = "http://localhost:5000/api/chat";

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load conversations from localStorage on mount
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
          
          // Set the most recent conversation as current
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

  // Save conversations to localStorage when they change
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
        // Set the first conversation that's not the one being deleted
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

  // Call the Python backend API
  const callAgentAPI = async (message: string, conversationId: string): Promise<{ response: string, agentType: string }> => {
    try {
      const userId = user?.id || 'anonymous';
      
      const response = await fetch(AGENT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          conversation_id: conversationId,
          message: message
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        response: data.response,
        agentType: data.agent_type
      };
    } catch (error) {
      console.error('Error calling agent API:', error);
      return {
        response: "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.",
        agentType: "intent_classifier"
      };
    }
  };

  const sendMessage = async (content: string) => {
    if (!currentConversation) {
      startNewConversation();
    }
    
    setIsProcessing(true);
    
    try {
      // Create user message
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        content,
        sender: 'user',
        timestamp: new Date(),
      };
      
      // Update conversation with user message
      const updatedConversation = {
        ...currentConversation!,
        messages: [...currentConversation!.messages, userMessage],
        updatedAt: new Date(),
      };
      
      // If this is the first message, update the conversation title
      let conversationToUpdate = updatedConversation;
      if (updatedConversation.messages.length === 1) {
        const title = content.length > 30 ? `${content.substring(0, 30)}...` : content;
        conversationToUpdate = {
          ...updatedConversation,
          title,
        };
      }
      
      setCurrentConversation(conversationToUpdate);
      
      // Update conversations list
      setConversations(prev => 
        prev.map(conv => conv.id === conversationToUpdate.id ? conversationToUpdate : conv)
      );
      
      // Call the agent API
      const { response: aiResponse, agentType } = await callAgentAPI(content, conversationToUpdate.id);
      
      // Create AI message
      const aiMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        agentType: agentType as any,
      };
      
      // Update conversation with AI message
      const finalConversation = {
        ...conversationToUpdate,
        messages: [...conversationToUpdate.messages, aiMessage],
        updatedAt: new Date(),
      };
      
      setCurrentConversation(finalConversation);
      
      // Update conversations list
      setConversations(prev => 
        prev.map(conv => conv.id === finalConversation.id ? finalConversation : conv)
      );
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to get a response. Please try again later.');
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

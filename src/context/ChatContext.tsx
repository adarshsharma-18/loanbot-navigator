
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
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

  // AI response generation (mock)
  const generateAIResponse = async (message: string): Promise<string> => {
    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Very basic loan-related responses for demo
    if (message.toLowerCase().includes('loan')) {
      return "I can help you with various loan options. Are you looking for a mortgage, personal loan, or business loan?";
    } else if (message.toLowerCase().includes('mortgage')) {
      return "For mortgages, I'd need to know your credit score, income, desired loan amount, and how much of a down payment you can make. Would you like to provide these details?";
    } else if (message.toLowerCase().includes('interest')) {
      return "Current interest rates vary based on your credit score, loan type, and market conditions. For the best rates, you'd want a credit score above 740, a stable income, and a low debt-to-income ratio.";
    } else if (message.toLowerCase().includes('qualify')) {
      return "Loan qualification depends on several factors: credit score, income stability, debt-to-income ratio, and loan purpose. Would you like me to walk you through a pre-qualification assessment?";
    } else if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
      return "Hello! I'm your LoanBot advisor. How can I assist you today with your loan needs?";
    } else {
      return "I understand you're interested in loan options. Could you provide more specific information about what type of financing you're looking for?";
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
      
      // Generate AI response
      const aiResponse = await generateAIResponse(content);
      
      // Create AI message
      const aiMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
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

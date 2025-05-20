import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AIController, MessageRequest } from '../controllers/AIController';
import { useAuth } from './AuthContext';
import aiAssistantService, { ChatMessage } from '../services/aiAssistantService';

// Define the shape of a message
export interface Message {
  role: 'user' | 'assistant';
  content: string;
  metadata?: {
    type?: string;
    module?: string;
    sources?: Array<{
      id: string;
      source: string;
      category: string;
    }>;
    platform?: string;
    [key: string]: any;
  };
  structuredData?: any;
}

// Define the context interface
interface AIAssistantContextType {
  messages: Message[];
  sendMessage: (message: string) => Promise<void>;
  clearConversation: () => void;
  isProcessing: boolean;
  activeModule: string | undefined;
  setActiveModule: (moduleId: string) => void;
  businessProfileId: string | undefined;
  setBusinessProfileId: (profileId: string) => void;
}

// Create the context with default values
const AIAssistantContext = createContext<AIAssistantContextType>({
  messages: [],
  sendMessage: async () => {},
  clearConversation: () => {},
  isProcessing: false,
  activeModule: undefined,
  setActiveModule: () => {},
  businessProfileId: undefined,
  setBusinessProfileId: () => {},
});

// Hook for using the AI Assistant context
export const useAIAssistant = () => useContext(AIAssistantContext);

interface AIAssistantProviderProps {
  children: ReactNode;
}

export const AIAssistantProvider: React.FC<AIAssistantProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeModule, setActiveModule] = useState<string | undefined>(undefined);
  const [businessProfileId, setBusinessProfileId] = useState<string | undefined>(undefined);

  // Get the current user and guest status from auth context
  const { user, isGuest } = useAuth();

  // Initialize the AI controller
  const aiController = AIController.getInstance();

  // Expose functions to window for external access
  useEffect(() => {
    // Create a global namespace for Shakti Margam
    if (!window.ShaktiMargam) {
      window.ShaktiMargam = {};
    }

    // Expose the setActiveModule function
    window.ShaktiMargam.setActiveModule = (moduleId: string) => {
      console.log('Setting active module from external source:', moduleId);
      setActiveModule(moduleId);
    };

    // Expose the clearConversation function
    window.ShaktiMargam.clearConversation = () => {
      console.log('Clearing conversation from external source');
      clearConversation();
    };

    // Cleanup on unmount
    return () => {
      if (window.ShaktiMargam) {
        window.ShaktiMargam.setActiveModule = undefined;
        window.ShaktiMargam.clearConversation = undefined;
      }
    };
  }, []);

  // Load conversation from Supabase when user or activeModule changes
  useEffect(() => {
    const loadChatHistory = async () => {
      // Only load chat history if user is authenticated (not guest) and a module is selected
      if (user && activeModule && !isGuest) {
        try {
          // Get chat history from Supabase
          const chatHistory = await aiAssistantService.getChatHistory(user.id, activeModule);

          // Convert to Message format
          const formattedMessages: Message[] = chatHistory.map(msg => ({
            role: msg.is_user_message ? 'user' : 'assistant',
            content: msg.content,
            metadata: {
              module: activeModule
            }
          }));

          setMessages(formattedMessages);

          // Generate a conversation ID if we have messages
          if (formattedMessages.length > 0 && !conversationId) {
            setConversationId(`${user.id}-${activeModule}-${Date.now()}`);
          }
        } catch (error) {
          console.error('Error loading chat history from Supabase:', error);
        }
      } else if (isGuest && activeModule) {
        // For guest users, we'll use local storage to maintain session chat history
        const guestChatHistory = localStorage.getItem(`guestChat-${activeModule}`);
        if (guestChatHistory) {
          try {
            const parsedMessages = JSON.parse(guestChatHistory) as Message[];
            setMessages(parsedMessages);

            // Generate a conversation ID for guest
            if (!conversationId) {
              setConversationId(`guest-${activeModule}-${Date.now()}`);
            }
          } catch (error) {
            console.error('Error parsing guest chat history:', error);
          }
        } else {
          // Clear messages if switching to a new module with no history
          setMessages([]);
          setConversationId(`guest-${activeModule}-${Date.now()}`);
        }
      }
    };

    loadChatHistory();
  }, [user, activeModule, isGuest]);

  // Save conversation when it changes
  useEffect(() => {
    if (messages.length > 0 && conversationId) {
      if (isGuest && activeModule) {
        // For guest users, save to module-specific local storage
        localStorage.setItem(
          `guestChat-${activeModule}`,
          JSON.stringify(messages)
        );
      } else {
        // For authenticated users, save the current conversation for session persistence
        localStorage.setItem(
          'shaktiMargamConversation',
          JSON.stringify({ messages, conversationId })
        );
      }
    }
  }, [messages, conversationId, isGuest, activeModule]);

  // Send a message to the AI assistant
  const sendMessage = async (message: string) => {
    setIsProcessing(true);

    try {
      // Add user message to state immediately for UI feedback
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'user', content: message },
      ]);

      // Save user message to Supabase if user is authenticated (not guest) and module is selected
      if (user && activeModule && !isGuest) {
        await aiAssistantService.saveMessage(user.id, message, true, activeModule);
      }

      // Prepare the message request for the AI controller
      const request: MessageRequest = {
        message,
        activeModule,
        businessProfileId,
      };

      let aiResponse;

      // If user is authenticated (not guest), use the Supabase service
      if (user && activeModule && !isGuest) {
        // Get response from AI service
        aiResponse = await aiAssistantService.sendMessageToAI(user.id, message, activeModule);
      } else {
        // Fallback to local AI controller if not authenticated or in guest mode
        const response = await aiController.processMessage(request, conversationId);
        aiResponse = response.response;

        // Update conversation ID if this is a new conversation
        if (!conversationId) {
          setConversationId(isGuest ?
            `guest-${activeModule}-${Date.now()}` :
            response.conversationId);
        }
      }

      // Add assistant response to state
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'assistant',
          content: aiResponse,
          metadata: { module: activeModule }
        },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message to state
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'assistant',
          content: 'I apologize, but I encountered an error processing your request. Please try again.'
        },
      ]);

      // Save error message to Supabase if user is authenticated (not guest)
      if (user && activeModule && !isGuest) {
        await aiAssistantService.saveMessage(
          user.id,
          'I apologize, but I encountered an error processing your request. Please try again.',
          false,
          activeModule
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Clear the current conversation
  const clearConversation = () => {
    setMessages([]);
    setConversationId(undefined);

    // Clear appropriate storage based on user type
    if (isGuest && activeModule) {
      localStorage.removeItem(`guestChat-${activeModule}`);
    } else {
      localStorage.removeItem('shaktiMargamConversation');
    }

    // Note: We don't delete messages from Supabase as they serve as a history record
    // Instead, we just clear the local state
  };

  // Context value
  const value = {
    messages,
    sendMessage,
    clearConversation,
    isProcessing,
    activeModule,
    setActiveModule,
    businessProfileId,
    setBusinessProfileId,
  };

  return (
    <AIAssistantContext.Provider value={value}>
      {children}
    </AIAssistantContext.Provider>
  );
};

export default AIAssistantProvider;

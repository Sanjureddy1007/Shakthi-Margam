import { aiAssistant } from './supabase';

export interface ChatMessage {
  id?: string;
  user_id: string;
  content: string;
  is_user_message: boolean;
  module_id: string;
  created_at?: string;
}

export interface UserPreferences {
  id?: string;
  user_id: string;
  theme?: string;
  language?: string;
  notification_enabled?: boolean;
  active_module?: string;
  created_at?: string;
  updated_at?: string;
}

export const aiAssistantService = {
  /**
   * Save a chat message
   */
  saveMessage: async (userId: string, message: string, isUser: boolean, moduleId: string): Promise<boolean> => {
    try {
      const { error } = await aiAssistant.saveMessage(userId, message, isUser, moduleId);
      
      if (error) {
        console.error('Error saving message:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in saveMessage:', error);
      return false;
    }
  },
  
  /**
   * Get chat history for a user and module
   */
  getChatHistory: async (userId: string, moduleId: string): Promise<ChatMessage[]> => {
    try {
      const { data, error } = await aiAssistant.getChatHistory(userId, moduleId);
      
      if (error) {
        console.error('Error fetching chat history:', error);
        return [];
      }
      
      return data as ChatMessage[];
    } catch (error) {
      console.error('Error in getChatHistory:', error);
      return [];
    }
  },
  
  /**
   * Save user preferences
   */
  saveUserPreferences: async (userId: string, preferences: Partial<UserPreferences>): Promise<boolean> => {
    try {
      const { error } = await aiAssistant.saveUserPreferences(userId, {
        ...preferences,
        updated_at: new Date().toISOString()
      });
      
      if (error) {
        console.error('Error saving user preferences:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in saveUserPreferences:', error);
      return false;
    }
  },
  
  /**
   * Get user preferences
   */
  getUserPreferences: async (userId: string): Promise<UserPreferences | null> => {
    try {
      const { data, error } = await aiAssistant.getUserPreferences(userId);
      
      if (error) {
        console.error('Error fetching user preferences:', error);
        return null;
      }
      
      return data as UserPreferences;
    } catch (error) {
      console.error('Error in getUserPreferences:', error);
      return null;
    }
  },
  
  /**
   * Send a message to the AI assistant and get a response
   */
  sendMessageToAI: async (userId: string, message: string, moduleId: string): Promise<string> => {
    try {
      // Save the user message
      await aiAssistantService.saveMessage(userId, message, true, moduleId);
      
      // In a real implementation, this would call an API endpoint that processes the message
      // and returns a response from the AI model
      
      // For now, we'll use a mock response based on the module and message content
      let aiResponse = '';
      
      if (moduleId === 'initial-assessment') {
        aiResponse = "Based on your input, I recommend focusing on defining your unique value proposition. What specific problem does your business solve for customers in Telangana?";
      } else if (moduleId === 'financial-analysis') {
        aiResponse = "Looking at your financial situation, I suggest exploring the MUDRA loan scheme which is specifically designed for women entrepreneurs in your stage of business.";
      } else if (moduleId === 'social-media-strategy') {
        aiResponse = "For your business type, Instagram and Facebook would be the most effective platforms in Telangana. Would you like me to help you create a content calendar?";
      } else if (moduleId === 'telangana-market-insights') {
        aiResponse = "The market for your product in Telangana is growing at 12% annually. The districts of Hyderabad, Warangal, and Nizamabad show the highest demand.";
      } else {
        aiResponse = "Thank you for your message. I'm here to help you with your business needs. Could you provide more details about what you're looking for?";
      }
      
      // Save the AI response
      await aiAssistantService.saveMessage(userId, aiResponse, false, moduleId);
      
      return aiResponse;
    } catch (error) {
      console.error('Error in sendMessageToAI:', error);
      return "I'm sorry, I encountered an error processing your request. Please try again.";
    }
  }
};

export default aiAssistantService;

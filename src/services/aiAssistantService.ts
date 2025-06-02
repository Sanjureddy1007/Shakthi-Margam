import { aiAssistant } from './supabase'; // Assuming supabase client is correctly configured

export interface ChatMessage {
  id?: string; // Optional: ID from the database
  user_id: string;
  content: string;
  is_user_message: boolean;
  module_id: string;
  created_at?: string; // Optional: Timestamp from the database
  // Optional: Add other fields like metadata if needed
  metadata?: Record<string, any>; 
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

export interface AIResponseData {
  content: string;
  citations?: Array<{
    id: string;
    title: string;
    source: string;
    // Add other citation fields if necessary
  }>;
  usage?: Record<string, any>; // e.g., token usage
  error?: string; // For backend to signal an error
  fallback?: boolean; // Indicates if this is a fallback response
  done?: boolean; // For streaming: indicates the end of the stream
}


export const aiAssistantService = {
  /**
   * Save a chat message to Supabase
   */
  saveMessage: async (
    userId: string,
    message: string,
    isUser: boolean,
    moduleId: string,
    metadata?: Record<string, any>
  ): Promise<boolean> => {
    try {
      const { error } = await aiAssistant.saveMessage(userId, message, isUser, moduleId, metadata);
      if (error) {
        console.error('Error saving message to Supabase:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Exception in saveMessage:', error);
      return false;
    }
  },

  /**
   * Get chat history for a user and module from Supabase
   */
  getChatHistory: async (userId: string, moduleId: string): Promise<ChatMessage[]> => {
    try {
      const { data, error } = await aiAssistant.getChatHistory(userId, moduleId);
      if (error) {
        console.error('Error fetching chat history from Supabase:', error);
        return [];
      }
      return data as ChatMessage[];
    } catch (error) {
      console.error('Exception in getChatHistory:', error);
      return [];
    }
  },

  /**
   * Save user preferences to Supabase
   */
  saveUserPreferences: async (userId: string, preferences: Partial<UserPreferences>): Promise<boolean> => {
    try {
      const { error } = await aiAssistant.saveUserPreferences(userId, {
        ...preferences,
        updated_at: new Date().toISOString(),
      });
      if (error) {
        console.error('Error saving user preferences to Supabase:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Exception in saveUserPreferences:', error);
      return false;
    }
  },

  /**
   * Get user preferences from Supabase
   */
  getUserPreferences: async (userId: string): Promise<UserPreferences | null> => {
    try {
      const { data, error } = await aiAssistant.getUserPreferences(userId);
      if (error) {
        console.error('Error fetching user preferences from Supabase:', error);
        return null;
      }
      return data as UserPreferences;
    } catch (error) {
      console.error('Exception in getUserPreferences:', error);
      return null;
    }
  },

  /**
   * Send a message to the AI assistant (non-streaming) and get a single response.
   */
  sendMessageToAI: async (
    userId: string,
    message: string,
    moduleId: string,
    authToken?: string // Optional auth token for backend verification
  ): Promise<AIResponseData> => {
    try {
      // Save the user message first
      await aiAssistantService.saveMessage(userId, message, true, moduleId);

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await fetch('/api/ai/chat', { // Ensure this matches your Vercel backend route
        method: 'POST',
        headers,
        body: JSON.stringify({
          message,
          moduleId,
          userId, // Sending userId in body; backend should verify if authToken is present
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `API error: ${response.status}` }));
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      const data: AIResponseData = await response.json();

      // Save the AI response
      await aiAssistantService.saveMessage(userId, data.content, false, moduleId, {
        citations: data.citations,
        usage: data.usage,
      });

      return data;
    } catch (error: any) {
      console.error('Error in sendMessageToAI (non-streaming):', error);
      const fallbackContent = "I'm sorry, I encountered an error processing your request. Please try again.";
      // Save the fallback response
      await aiAssistantService.saveMessage(userId, fallbackContent, false, moduleId, {
        error: error.message,
        fallback: true,
      });
      return { content: fallbackContent, error: error.message, fallback: true };
    }
  },

  /**
   * Send a message to the AI assistant and get a streaming response using Server-Sent Events (SSE).
   * @returns An EventSource object that the caller can use to close the connection.
   */
  sendMessageToAIStream: (
    userId: string,
    message: string,
    moduleId: string,
    callbacks: {
      onMessageChunk: (chunk: AIResponseData) => void; // Called for each piece of content
      onCitations?: (citations: AIResponseData['citations']) => void; // Called when citations are received
      onComplete: (fullContent: string, finalData: AIResponseData) => void; // Called when the stream is fully processed
      onError: (errorContent: string, error?: Error) => void; // Called on error
    },
    authToken?: string // Optional auth token
  ): EventSource => {
    // Save the user message first (asynchronously)
    aiAssistantService.saveMessage(userId, message, true, moduleId);

    const url = new URL('/api/ai/chat/stream', window.location.origin); // Ensure this matches your Vercel backend route
    url.searchParams.append('message', encodeURIComponent(message));
    url.searchParams.append('moduleId', moduleId);
    url.searchParams.append('userId', userId); // Backend should verify if authToken is present
    if (authToken) {
        url.searchParams.append('token', authToken); // Or send via header if EventSource supports it with fetch
    }


    const eventSource = new EventSource(url.toString());
    let fullContent = '';
    let finalDataObject: AIResponseData = { content: '' };

    eventSource.onmessage = (event) => {
      try {
        const parsedData: AIResponseData = JSON.parse(event.data);
        
        if (parsedData.citations && callbacks.onCitations) {
          finalDataObject.citations = parsedData.citations;
          callbacks.onCitations(parsedData.citations);
        }

        if (parsedData.content) {
          fullContent += parsedData.content;
          callbacks.onMessageChunk(parsedData); // Send the chunk which might contain content
        }
        
        if (parsedData.usage) {
            finalDataObject.usage = parsedData.usage;
        }

        if (parsedData.done) {
          finalDataObject.content = fullContent;
          // Save the complete AI response
          aiAssistantService.saveMessage(userId, fullContent, false, moduleId, {
            citations: finalDataObject.citations,
            usage: finalDataObject.usage,
            streamed: true,
          });
          callbacks.onComplete(fullContent, finalDataObject);
          eventSource.close();
        }
      } catch (e) {
        console.error('Error parsing SSE message data:', event.data, e);
        // Potentially call onError or just log, as the stream might continue or an error event will fire
      }
    };

    eventSource.onerror = (errorEvent) => {
      console.error('EventSource failed:', errorEvent);
      const error = new Error("Connection to AI service failed or was interrupted.");
      const fallbackContent = "I'm sorry, I encountered an error processing your request. Please try again.";
      // Save the fallback response
      aiAssistantService.saveMessage(userId, fallbackContent, false, moduleId, {
        error: error.message,
        fallback: true,
      });
      callbacks.onError(fallbackContent, error);
      eventSource.close();
    };

    return eventSource;
  },
};

export default aiAssistantService;

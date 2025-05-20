import { ShaktiMargamAIEngine, ConversationContext, Message } from '../services/ai/ShaktiMargamAIEngine';

export interface MessageRequest {
  message: string;
  businessProfileId?: string;
  activeModule?: string;
}

export interface MessageResponse {
  response: string;
  conversationId: string;
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

export class AIController {
  private static instance: AIController;
  private aiEngine: ShaktiMargamAIEngine;
  private conversations: Map<string, ConversationContext>;

  private constructor() {
    this.aiEngine = new ShaktiMargamAIEngine();
    this.conversations = new Map();
  }

  public static getInstance(): AIController {
    if (!AIController.instance) {
      AIController.instance = new AIController();
    }
    return AIController.instance;
  }

  public async processMessage(request: MessageRequest, conversationId?: string): Promise<MessageResponse> {
    // Get or create conversation context
    const context = this.getConversationContext(conversationId);

    // Update context with request data
    if (request.businessProfileId) {
      context.businessProfileId = request.businessProfileId;
    }

    if (request.activeModule) {
      context.activeModule = request.activeModule;
    }

    // Add user message to context
    context.messages.push({
      role: 'user',
      content: request.message
    });

    try {
      // Check if we're in development mode with placeholder env vars
      const isDevelopment = import.meta.env.DEV &&
        (import.meta.env.VITE_OPENAI_API_KEY?.includes('your_openai_api_key_here') ||
         !import.meta.env.VITE_OPENAI_API_KEY);

      let responseContent: string;
      let responseMetadata: any = undefined;
      let structuredData: any = undefined;

      if (isDevelopment) {
        console.log('Using mock response in development mode');

        // Create a mock response based on the message content
        responseContent = this.getMockResponse(request.message);
        responseMetadata = {
          module: request.activeModule || 'general',
          sources: [
            {
              id: 'mock-source-1',
              source: 'Telangana Women Entrepreneurship Knowledge Base',
              category: 'business-guide'
            }
          ]
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        // Process message with AI engine
        const aiResponse = await this.aiEngine.processMessage(request.message, context);

        // Check if response is a string or an object
        if (typeof aiResponse === 'string') {
          responseContent = aiResponse;
        } else {
          // Handle structured response
          responseContent = aiResponse.content || aiResponse.toString();
          responseMetadata = aiResponse.metadata;
          structuredData = aiResponse.structuredData;
        }
      }

      // Add assistant response to context
      context.messages.push({
        role: 'assistant',
        content: responseContent,
        metadata: responseMetadata,
        structuredData: structuredData
      });

      // Generate conversation ID if not provided
      const newConversationId = conversationId || this.generateConversationId();

      // Store updated context
      this.conversations.set(newConversationId, context);

      return {
        response: responseContent,
        conversationId: newConversationId,
        metadata: responseMetadata,
        structuredData: structuredData
      };
    } catch (error) {
      console.error('Error processing message:', error);
      return {
        response: 'I apologize, but I encountered an error processing your request. Please try again.',
        conversationId: conversationId || this.generateConversationId()
      };
    }
  }

  private getConversationContext(conversationId?: string): ConversationContext {
    if (conversationId && this.conversations.has(conversationId)) {
      return this.conversations.get(conversationId)!;
    }

    // Create new context if none exists
    return {
      messages: []
    };
  }

  private generateConversationId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  public getBusinessProfile(businessProfileId: string): any {
    // This would fetch the business profile from a database
    // For now, return a placeholder
    return {
      id: businessProfileId,
      name: 'Sample Business',
      industry: 'Technology',
      stage: 'Growth'
    };
  }

  public getConversationHistory(conversationId: string): Message[] {
    const context = this.getConversationContext(conversationId);
    return context.messages;
  }

  public clearConversation(conversationId: string): void {
    if (this.conversations.has(conversationId)) {
      this.conversations.delete(conversationId);
    }
  }

  // Function to get a mock response based on user input
  private getMockResponse(userMessage: string): string {
    const lowercaseMessage = userMessage.toLowerCase();

    // Check for keywords in the user message
    if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi')) {
      return "Hello! I'm Shakti Margam AI Assistant. How can I help you with your business in Telangana today?";
    } else if (lowercaseMessage.includes('business') || lowercaseMessage.includes('start')) {
      return "Starting a business in Telangana requires several steps. First, you'll need to register your business, obtain necessary licenses, and comply with local regulations. The Telangana government offers special programs for women entrepreneurs through WE-HUB and TSWDC. Would you like specific information about any of these aspects?";
    } else if (lowercaseMessage.includes('funding') || lowercaseMessage.includes('loan') || lowercaseMessage.includes('money')) {
      return "There are several funding options available for women entrepreneurs in Telangana. These include government schemes like WE-HUB incubation grants, Stree Nidhi loans, MUDRA loans, and private funding through organizations like TiE Hyderabad. The amount and eligibility criteria vary based on your business type and stage.";
    } else if (lowercaseMessage.includes('marketing') || lowercaseMessage.includes('promote')) {
      return "For marketing your business in Telangana, I recommend a mix of digital and traditional approaches. Social media platforms like Instagram and Facebook are effective for reaching urban customers, while local networks and community engagement work well in smaller towns. You might also consider participating in government-organized trade fairs and exhibitions.";
    } else if (lowercaseMessage.includes('training') || lowercaseMessage.includes('learn')) {
      return "Telangana offers several training programs for women entrepreneurs. WE-HUB provides specialized business development workshops, TASK offers technology training, and TSWDC conducts entrepreneurship development programs. Many of these are subsidized or free for women entrepreneurs.";
    } else {
      return "Thank you for your question. As a specialized assistant for women entrepreneurs in Telangana, I can provide information about business registration, funding opportunities, market trends, government schemes, and practical business strategies tailored to the local context. Could you please provide more details about your specific business needs?";
    }
  }
}

/**
 * API Service for Shakti Margam
 * Handles all API calls to the backend services
 */

// Get API endpoint and key from environment variables
const API_ENDPOINT = import.meta.env.VITE_AI_API_ENDPOINT || 'http://localhost:3000/api/ai';
const API_KEY = import.meta.env.VITE_API_KEY || 'development_key';

// Standard error response type
interface ErrorResponse {
  status: 'error';
  error: {
    code: string;
    message: string;
  };
}

// Standard success response type
interface SuccessResponse<T> {
  status: 'success';
  data: T;
  meta?: {
    pagination?: {
      total: number;
      page: number;
      pageSize: number;
    };
    timestamp: string;
  };
}

// Combined response type
type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// Message request and response types
export interface MessageRequest {
  message: string;
  businessProfileId?: string;
  activeModule?: string;
}

export interface MessageResponse {
  response: string;
  conversationId: string;
}

// Business profile types
export interface BusinessProfileRequest {
  profile: any;
}

export interface BusinessProfileResponse {
  profileId: string;
}

/**
 * Main API service class
 */
class ApiService {
  private static instance: ApiService;
  private baseUrl: string;
  private apiKey: string;

  private constructor() {
    this.baseUrl = API_ENDPOINT;
    this.apiKey = API_KEY;
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  /**
   * Make a GET request
   */
  private async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data: ApiResponse<T> = await response.json();
      
      if (data.status === 'error') {
        throw new Error(`API error: ${data.error.code} - ${data.error.message}`);
      }
      
      return (data as SuccessResponse<T>).data;
    } catch (error) {
      console.error('API GET request failed:', error);
      throw error;
    }
  }

  /**
   * Make a POST request
   */
  private async post<T>(endpoint: string, body: any): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data: ApiResponse<T> = await response.json();
      
      if (data.status === 'error') {
        throw new Error(`API error: ${data.error.code} - ${data.error.message}`);
      }
      
      return (data as SuccessResponse<T>).data;
    } catch (error) {
      console.error('API POST request failed:', error);
      throw error;
    }
  }

  /**
   * Send a message to the AI assistant
   */
  public async sendMessage(request: MessageRequest, conversationId?: string): Promise<MessageResponse> {
    const endpoint = conversationId 
      ? `/message?conversationId=${conversationId}` 
      : '/message';
    
    return this.post<MessageResponse>(endpoint, request);
  }

  /**
   * Get conversation history
   */
  public async getConversation(conversationId: string): Promise<any> {
    return this.get<any>(`/conversation/${conversationId}`);
  }

  /**
   * Save a business profile
   */
  public async saveBusinessProfile(profile: any): Promise<BusinessProfileResponse> {
    return this.post<BusinessProfileResponse>('/profiles', { profile });
  }

  /**
   * Get module resources
   */
  public async getModuleResources(moduleId: string): Promise<any> {
    return this.get<any>(`/modules/${moduleId}/resources`);
  }

  /**
   * Submit contact form
   */
  public async submitContactForm(formData: any): Promise<any> {
    return this.post<any>('/contact', formData);
  }

  /**
   * Submit newsletter signup
   */
  public async submitNewsletterSignup(email: string): Promise<any> {
    return this.post<any>('/newsletter', { email });
  }
}

export default ApiService;

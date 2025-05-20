/**
 * Auth API Service for Shakti Margam
 * Handles authentication API calls to the backend services
 */

// Get API endpoint from environment variables
const API_ENDPOINT = import.meta.env.VITE_AUTH_API_ENDPOINT || 'http://localhost:3000/api/auth';

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
  token?: string;
  refresh_token?: string;
  data: T;
}

// Combined response type
type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// User types
export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRegistration extends UserCredentials {
  name: string;
  phoneNumber?: string;
  district?: string;
  city?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  district?: string;
  city?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  user: any;
  profile: UserProfile | null;
}

/**
 * Main Auth API service class
 */
class AuthApiService {
  private static instance: AuthApiService;
  private baseUrl: string;
  private token: string | null;

  private constructor() {
    this.baseUrl = API_ENDPOINT;
    this.token = localStorage.getItem('auth_token');
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): AuthApiService {
    if (!AuthApiService.instance) {
      AuthApiService.instance = new AuthApiService();
    }
    return AuthApiService.instance;
  }

  /**
   * Set auth token
   */
  public setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  /**
   * Clear auth token
   */
  public clearToken(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  /**
   * Get auth headers
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Make a GET request
   */
  private async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data: ApiResponse<T> = await response.json();
      
      if (data.status === 'error') {
        throw new Error(`API error: ${(data as ErrorResponse).error.code} - ${(data as ErrorResponse).error.message}`);
      }
      
      // Store token if available
      if ((data as SuccessResponse<T>).token) {
        this.setToken((data as SuccessResponse<T>).token!);
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
        headers: this.getHeaders(),
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data: ApiResponse<T> = await response.json();
      
      if (data.status === 'error') {
        throw new Error(`API error: ${(data as ErrorResponse).error.code} - ${(data as ErrorResponse).error.message}`);
      }
      
      // Store token if available
      if ((data as SuccessResponse<T>).token) {
        this.setToken((data as SuccessResponse<T>).token!);
      }
      
      return (data as SuccessResponse<T>).data;
    } catch (error) {
      console.error('API POST request failed:', error);
      throw error;
    }
  }

  /**
   * Make a PUT request
   */
  private async put<T>(endpoint: string, body: any): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data: ApiResponse<T> = await response.json();
      
      if (data.status === 'error') {
        throw new Error(`API error: ${(data as ErrorResponse).error.code} - ${(data as ErrorResponse).error.message}`);
      }
      
      return (data as SuccessResponse<T>).data;
    } catch (error) {
      console.error('API PUT request failed:', error);
      throw error;
    }
  }

  /**
   * Register a new user
   */
  public async register(userData: UserRegistration): Promise<AuthResponse> {
    return this.post<AuthResponse>('/register', userData);
  }

  /**
   * Login user
   */
  public async login(credentials: UserCredentials): Promise<AuthResponse> {
    return this.post<AuthResponse>('/login', credentials);
  }

  /**
   * Get current user
   */
  public async getCurrentUser(): Promise<AuthResponse> {
    return this.get<AuthResponse>('/me');
  }

  /**
   * Update user details
   */
  public async updateUserDetails(userData: Partial<UserProfile>): Promise<UserProfile> {
    return this.put<UserProfile>('/update-details', userData);
  }

  /**
   * Update password
   */
  public async updatePassword(currentPassword: string, newPassword: string): Promise<any> {
    return this.put<any>('/update-password', {
      currentPassword,
      newPassword
    });
  }

  /**
   * Request password reset
   */
  public async requestPasswordReset(email: string): Promise<any> {
    return this.post<any>('/forgot-password', { email });
  }

  /**
   * Reset password
   */
  public async resetPassword(token: string, password: string): Promise<any> {
    return this.post<any>(`/reset-password/${token}`, { password });
  }

  /**
   * Logout user
   */
  public async logout(): Promise<any> {
    const result = await this.post<any>('/logout', {});
    this.clearToken();
    return result;
  }

  /**
   * Refresh token
   */
  public async refreshToken(refreshToken: string): Promise<any> {
    const result = await this.post<any>('/refresh-token', { refresh_token: refreshToken });
    
    if (result.token) {
      this.setToken(result.token);
    }
    
    return result;
  }
}

export default AuthApiService;

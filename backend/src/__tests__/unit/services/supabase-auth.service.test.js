const supabaseAuthService = require('../../../services/supabase-auth.service');
const { getSupabaseClient, getSupabaseAdmin } = require('../../../config/supabase');
const emailService = require('../../../services/email.service');
const logger = require('../../../utils/logger');

// Mock dependencies
jest.mock('../../../config/supabase');
jest.mock('../../../services/email.service');
jest.mock('../../../utils/logger');

describe('Supabase Auth Service', () => {
  let mockSupabaseClient;
  let mockSupabaseAdmin;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock Supabase client
    mockSupabaseClient = {
      auth: {
        signUp: jest.fn(),
        signInWithPassword: jest.fn(),
        getUser: jest.fn(),
        updateUser: jest.fn(),
        resetPasswordForEmail: jest.fn(),
        signOut: jest.fn()
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn()
    };

    // Mock Supabase admin
    mockSupabaseAdmin = {
      auth: {
        admin: {
          deleteUser: jest.fn()
        }
      }
    };

    // Set up mock returns
    getSupabaseClient.mockReturnValue(mockSupabaseClient);
    getSupabaseAdmin.mockReturnValue(mockSupabaseAdmin);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phoneNumber: '1234567890',
        district: 'Test District',
        city: 'Test City'
      };

      const mockUser = { id: 'user-123', email: userData.email };
      const mockSession = { access_token: 'token-123' };
      const mockProfile = { id: mockUser.id, name: userData.name };

      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null
      });

      mockSupabaseClient.from().insert().select.mockResolvedValue({
        data: [mockProfile],
        error: null
      });

      emailService.sendWelcomeEmail.mockResolvedValue(true);

      // Act
      const result = await supabaseAuthService.register(userData);

      // Assert
      expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            phone_number: userData.phoneNumber,
            district: userData.district,
            city: userData.city
          }
        }
      });

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('profiles');
      expect(mockSupabaseClient.insert).toHaveBeenCalledWith({
        id: mockUser.id,
        name: userData.name,
        email: userData.email,
        phone_number: userData.phoneNumber,
        district: userData.district,
        city: userData.city
      });

      expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith({
        name: userData.name,
        email: userData.email
      });

      expect(result).toEqual({
        user: mockUser,
        profile: mockProfile,
        session: mockSession
      });
    });

    it('should handle profile creation error', async () => {
      // Arrange
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = { id: 'user-123', email: userData.email };
      const mockSession = { access_token: 'token-123' };

      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null
      });

      mockSupabaseClient.from().insert().select.mockResolvedValue({
        data: null,
        error: { message: 'Profile creation failed' }
      });

      // Act & Assert
      await expect(supabaseAuthService.register(userData)).rejects.toThrow('Profile creation failed');
      expect(mockSupabaseAdmin.auth.admin.deleteUser).toHaveBeenCalledWith(mockUser.id);
    });

    it('should handle auth error', async () => {
      // Arrange
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: null,
        error: { message: 'Auth error' }
      });

      // Act & Assert
      await expect(supabaseAuthService.register(userData)).rejects.toThrow('Auth error');
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      // Arrange
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = { id: 'user-123', email: credentials.email };
      const mockSession = { access_token: 'token-123' };
      const mockProfile = { id: mockUser.id, name: 'Test User' };

      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null
      });

      mockSupabaseClient.from().select().eq().single.mockResolvedValue({
        data: mockProfile,
        error: null
      });

      // Act
      const result = await supabaseAuthService.login(credentials);

      // Assert
      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: credentials.email,
        password: credentials.password
      });

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('profiles');
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('*');
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', mockUser.id);
      expect(mockSupabaseClient.single).toHaveBeenCalled();

      expect(result).toEqual({
        user: mockUser,
        profile: mockProfile,
        session: mockSession
      });
    });

    it('should handle login error', async () => {
      // Arrange
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Invalid login credentials' }
      });

      // Act & Assert
      await expect(supabaseAuthService.login(credentials)).rejects.toThrow('Invalid login credentials');
    });
  });

  // Additional tests for other methods would follow the same pattern
});

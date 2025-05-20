const authController = require('../../../controllers/auth.controller');
const supabaseAuthService = require('../../../services/supabase-auth.service');
const { getSupabaseClient } = require('../../../config/supabase');
const AppError = require('../../../utils/appError');
const { mockRequest, mockResponse } = require('mock-req-res');

// Mock dependencies
jest.mock('../../../services/supabase-auth.service');
jest.mock('../../../config/supabase');

describe('Auth Controller', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock request, response, and next
    req = mockRequest();
    res = mockResponse();
    next = jest.fn();
  });

  describe('register', () => {
    it('should register a user and send token response', async () => {
      // Arrange
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phoneNumber: '1234567890',
        district: 'Test District',
        city: 'Test City'
      };

      req.body = userData;

      const mockUser = { id: 'user-123', email: userData.email };
      const mockProfile = { id: mockUser.id, name: userData.name };
      const mockSession = { access_token: 'token-123' };

      supabaseAuthService.register.mockResolvedValue({
        user: mockUser,
        profile: mockProfile,
        session: mockSession
      });

      // Act
      await authController.register(req, res, next);

      // Assert
      expect(supabaseAuthService.register).toHaveBeenCalledWith(userData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        token: mockSession.access_token,
        refresh_token: undefined,
        data: {
          user: mockUser,
          profile: mockProfile
        }
      });
    });

    it('should handle email already in use error', async () => {
      // Arrange
      req.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      supabaseAuthService.register.mockRejectedValue(new Error('User already registered'));

      // Act
      await authController.register(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0].statusCode).toBe(400);
      expect(next.mock.calls[0][0].message).toBe('Email already in use');
    });

    it('should pass other errors to next middleware', async () => {
      // Arrange
      req.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const error = new Error('Some other error');
      supabaseAuthService.register.mockRejectedValue(error);

      // Act
      await authController.register(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('login', () => {
    it('should login a user and send token response', async () => {
      // Arrange
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      req.body = credentials;

      const mockUser = { id: 'user-123', email: credentials.email };
      const mockProfile = { id: mockUser.id, name: 'Test User' };
      const mockSession = { 
        access_token: 'token-123',
        refresh_token: 'refresh-token-123'
      };

      supabaseAuthService.login.mockResolvedValue({
        user: mockUser,
        profile: mockProfile,
        session: mockSession
      });

      // Act
      await authController.login(req, res, next);

      // Assert
      expect(supabaseAuthService.login).toHaveBeenCalledWith(credentials);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        token: mockSession.access_token,
        refresh_token: mockSession.refresh_token,
        data: {
          user: mockUser,
          profile: mockProfile
        }
      });
    });

    it('should handle missing credentials', async () => {
      // Arrange
      req.body = {};

      // Act
      await authController.login(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0].statusCode).toBe(400);
      expect(next.mock.calls[0][0].message).toBe('Please provide email and password');
    });

    it('should handle invalid credentials', async () => {
      // Arrange
      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      supabaseAuthService.login.mockRejectedValue(new Error('Invalid login credentials'));

      // Act
      await authController.login(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0].statusCode).toBe(401);
      expect(next.mock.calls[0][0].message).toBe('Invalid credentials');
    });
  });

  describe('getMe', () => {
    it('should return the current user', async () => {
      // Arrange
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const mockProfile = { id: mockUser.id, name: 'Test User' };
      
      req.user = mockUser;
      req.user.profile = mockProfile;

      // Act
      await authController.getMe(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          user: mockUser,
          profile: mockProfile
        }
      });
    });
  });

  // Additional tests for other controller methods would follow the same pattern
});

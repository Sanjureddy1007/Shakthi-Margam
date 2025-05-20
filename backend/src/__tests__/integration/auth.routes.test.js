const request = require('supertest');
const express = require('express');
const authRoutes = require('../../routes/auth.routes');
const supabaseAuthService = require('../../services/supabase-auth.service');
const { protect } = require('../../middleware/auth');
const AppError = require('../../utils/appError');

// Mock dependencies
jest.mock('../../services/supabase-auth.service');
jest.mock('../../middleware/auth');

describe('Auth Routes', () => {
  let app;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create Express app
    app = express();
    app.use(express.json());

    // Mock error handler
    app.use((err, req, res, next) => {
      res.status(err.statusCode || 500).json({
        status: 'error',
        message: err.message,
        code: err.code
      });
    });

    // Set up routes
    app.use('/api/auth', authRoutes);
  });

  describe('POST /api/auth/register', () => {
    it('should register a user successfully', async () => {
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
      const mockProfile = { id: mockUser.id, name: userData.name };
      const mockSession = { access_token: 'token-123' };

      supabaseAuthService.register.mockResolvedValue({
        user: mockUser,
        profile: mockProfile,
        session: mockSession
      });

      // Act
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        status: 'success',
        token: mockSession.access_token,
        data: {
          user: mockUser,
          profile: mockProfile
        }
      });
      expect(supabaseAuthService.register).toHaveBeenCalledWith(userData);
    });

    it('should return 400 if email is already in use', async () => {
      // Arrange
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      supabaseAuthService.register.mockImplementation(() => {
        const error = new Error('User already registered');
        error.message = 'already registered';
        throw error;
      });

      // Act
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Email already in use',
        code: 'EMAIL_IN_USE'
      });
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login a user successfully', async () => {
      // Arrange
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

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
      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        token: mockSession.access_token,
        refresh_token: mockSession.refresh_token,
        data: {
          user: mockUser,
          profile: mockProfile
        }
      });
      expect(supabaseAuthService.login).toHaveBeenCalledWith(credentials);
    });

    it('should return 400 if email or password is missing', async () => {
      // Arrange
      const credentials = {
        email: 'test@example.com'
        // Missing password
      };

      // Act
      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Please provide email and password',
        code: 'MISSING_CREDENTIALS'
      });
    });

    it('should return 401 if credentials are invalid', async () => {
      // Arrange
      const credentials = {
        email: 'test@example.com',
        password: 'wrong-password'
      };

      supabaseAuthService.login.mockImplementation(() => {
        const error = new Error('Invalid login credentials');
        error.message = 'Invalid login credentials';
        throw error;
      });

      // Act
      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials);

      // Assert
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return the current user', async () => {
      // Arrange
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const mockProfile = { id: mockUser.id, name: 'Test User' };

      // Mock protect middleware to set req.user
      protect.mockImplementation((req, res, next) => {
        req.user = mockUser;
        req.user.profile = mockProfile;
        next();
      });

      // Act
      const response = await request(app)
        .get('/api/auth/me');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        data: {
          user: mockUser,
          profile: mockProfile
        }
      });
    });

    it('should return 401 if not authenticated', async () => {
      // Arrange
      protect.mockImplementation((req, res, next) => {
        next(new AppError('Not authorized to access this route', 401, 'UNAUTHORIZED'));
      });

      // Act
      const response = await request(app)
        .get('/api/auth/me');

      // Assert
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Not authorized to access this route',
        code: 'UNAUTHORIZED'
      });
    });
  });

  // Additional tests for other routes would follow the same pattern
});

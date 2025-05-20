const { protect, restrictTo, checkOwnership } = require('../../../middleware/auth');
const { getSupabaseClient } = require('../../../config/supabase');
const AppError = require('../../../utils/appError');
const logger = require('../../../utils/logger');
const { mockRequest, mockResponse } = require('mock-req-res');

// Mock dependencies
jest.mock('../../../config/supabase');
jest.mock('../../../utils/logger');

describe('Auth Middleware', () => {
  let mockSupabaseClient;
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock Supabase client
    mockSupabaseClient = {
      auth: {
        getUser: jest.fn()
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn()
    };

    // Set up mock returns
    getSupabaseClient.mockReturnValue(mockSupabaseClient);

    // Mock request, response, and next
    req = mockRequest({
      headers: {
        authorization: 'Bearer test-token'
      }
    });
    res = mockResponse();
    next = jest.fn();
  });

  describe('protect', () => {
    it('should call next if token is valid', async () => {
      // Arrange
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const mockProfile = { id: mockUser.id, name: 'Test User' };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      mockSupabaseClient.from().select().eq().single.mockResolvedValue({
        data: mockProfile,
        error: null
      });

      // Act
      await protect(req, res, next);

      // Assert
      expect(mockSupabaseClient.auth.getUser).toHaveBeenCalledWith('test-token');
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('profiles');
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('*');
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', mockUser.id);
      expect(mockSupabaseClient.single).toHaveBeenCalled();

      expect(req.user).toEqual(mockUser);
      expect(req.user.profile).toEqual(mockProfile);
      expect(req.token).toEqual('test-token');
      expect(next).toHaveBeenCalledWith();
    });

    it('should call next with error if no token is provided', async () => {
      // Arrange
      req = mockRequest({
        headers: {}
      });

      // Act
      await protect(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0].statusCode).toBe(401);
      expect(next.mock.calls[0][0].message).toBe('Not authorized to access this route');
    });

    it('should call next with error if token is invalid', async () => {
      // Arrange
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid token' }
      });

      // Act
      await protect(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0].statusCode).toBe(401);
      expect(next.mock.calls[0][0].message).toBe('Invalid or expired token. Please log in again');
    });

    it('should continue even if profile fetch fails', async () => {
      // Arrange
      const mockUser = { id: 'user-123', email: 'test@example.com' };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      mockSupabaseClient.from().select().eq().single.mockResolvedValue({
        data: null,
        error: { message: 'Profile not found' }
      });

      // Act
      await protect(req, res, next);

      // Assert
      expect(logger.error).toHaveBeenCalledWith('Error getting profile: Profile not found');
      expect(req.user).toEqual(mockUser);
      expect(req.user.profile).toBeUndefined();
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('restrictTo', () => {
    it('should call next if user has required role', () => {
      // Arrange
      req.user = {
        app_metadata: { role: 'admin' }
      };
      const middleware = restrictTo('admin', 'editor');

      // Act
      middleware(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith();
    });

    it('should call next with error if user does not have required role', () => {
      // Arrange
      req.user = {
        app_metadata: { role: 'user' }
      };
      const middleware = restrictTo('admin', 'editor');

      // Act
      middleware(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0].statusCode).toBe(403);
      expect(next.mock.calls[0][0].message).toBe('You do not have permission to perform this action');
    });

    it('should default to user role if app_metadata is not present', () => {
      // Arrange
      req.user = {};
      const middleware = restrictTo('user');

      // Act
      middleware(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('checkOwnership', () => {
    it('should call next if user owns the resource', async () => {
      // Arrange
      req.user = { id: 'user-123' };
      req.params = { id: 'resource-123' };
      const getResourceOwner = jest.fn().mockResolvedValue('user-123');
      const middleware = checkOwnership(getResourceOwner);

      // Act
      await middleware(req, res, next);

      // Assert
      expect(getResourceOwner).toHaveBeenCalledWith('resource-123');
      expect(next).toHaveBeenCalledWith();
    });

    it('should call next with error if user does not own the resource', async () => {
      // Arrange
      req.user = { id: 'user-123' };
      req.params = { id: 'resource-123' };
      const getResourceOwner = jest.fn().mockResolvedValue('other-user');
      const middleware = checkOwnership(getResourceOwner);

      // Act
      await middleware(req, res, next);

      // Assert
      expect(getResourceOwner).toHaveBeenCalledWith('resource-123');
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0].statusCode).toBe(403);
      expect(next.mock.calls[0][0].message).toBe('You do not have permission to access this resource');
    });

    it('should call next with error if resource ID is not provided', async () => {
      // Arrange
      req.user = { id: 'user-123' };
      req.params = {};
      const getResourceOwner = jest.fn();
      const middleware = checkOwnership(getResourceOwner);

      // Act
      await middleware(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0].statusCode).toBe(400);
      expect(next.mock.calls[0][0].message).toBe("Resource ID parameter 'id' is required");
    });

    it('should use custom parameter name if provided', async () => {
      // Arrange
      req.user = { id: 'user-123' };
      req.params = { profileId: 'resource-123' };
      const getResourceOwner = jest.fn().mockResolvedValue('user-123');
      const middleware = checkOwnership(getResourceOwner, 'profileId');

      // Act
      await middleware(req, res, next);

      // Assert
      expect(getResourceOwner).toHaveBeenCalledWith('resource-123');
      expect(next).toHaveBeenCalledWith();
    });
  });
});

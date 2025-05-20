const logger = require('../utils/logger');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`${err.name}: ${err.message}`, { 
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  // Determine status code
  const statusCode = err.statusCode || 500;
  
  // Create error response
  const errorResponse = {
    status: 'error',
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production' && statusCode === 500
        ? 'An unexpected error occurred'
        : err.message
    }
  };
  
  // Include stack trace in development
  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    errorResponse.error.stack = err.stack;
  }
  
  // Send response
  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;

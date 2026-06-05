/**
 * Express Middleware for Request/Response Logging
 * Integrates with the Logger service to track all HTTP traffic
 */

const { Log } = require('./logger');

/**
 * Express middleware for logging HTTP requests and responses
 * @param {Object} logger - Logger instance (optional for simple logging)
 * @returns {Function} Express middleware function
 */
function createLoggingMiddleware(logger = null) {
  return (req, res, next) => {
    const startTime = Date.now();
    const requestID = generateRequestID();

    // Store request ID in response headers
    res.setHeader('X-Request-ID', requestID);

    // Log incoming request
    const logFn = logger ? logger.log.bind(logger) : Log;
    logFn('backend', 'info', 'middleware', `Incoming ${req.method} ${req.path}`, {
      requestID,
      method: req.method,
      path: req.path,
      query: req.query,
      ip: req.ip,
    });

    // Capture response data
    const originalSend = res.send;
    let responseBody = null;

    res.send = function (data) {
      responseBody = data;
      return originalSend.call(this, data);
    };

    // Log response on finish
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const isError = res.statusCode >= 400;

      logFn(
        'backend',
        isError ? 'error' : 'info',
        'middleware',
        `Response ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`,
        {
          requestID,
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          duration,
        }
      );
    });

    next();
  };
}

/**
 * Error handling middleware
 * @param {Object} logger - Logger instance (optional)
 * @returns {Function} Express error middleware function
 */
function createErrorLoggingMiddleware(logger = null) {
  return (err, req, res, next) => {
    const requestID = req.headers['x-request-id'] || generateRequestID();
    const logFn = logger ? logger.log.bind(logger) : Log;

    logFn('backend', 'fatal', 'middleware', `Unhandled error: ${err.message}`, {
      requestID,
      method: req.method,
      path: req.path,
      error: err.stack,
    });

    res.status(500).json({
      error: 'Internal Server Error',
      requestID,
      message: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message,
    });
  };
}

/**
 * Generate unique request ID
 * @returns {string} Unique request ID
 */
function generateRequestID() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

module.exports = {
  createLoggingMiddleware,
  createErrorLoggingMiddleware,
  generateRequestID,
};

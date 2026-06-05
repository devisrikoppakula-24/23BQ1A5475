/**
 * Express Middleware for Request/Response Logging
 * Integrates with the Logger service to track all HTTP traffic
 */

import { Request, Response, NextFunction } from 'express';
import { Logger, LogStack } from './logger';

/**
 * Express middleware for logging HTTP requests and responses
 * @param logger - Logger instance
 * @returns Express middleware function
 */
export function createLoggingMiddleware(logger: Logger) {
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const requestID = generateRequestID();

    // Store request ID in response headers
    res.setHeader('X-Request-ID', requestID);

    // Log incoming request
    logger.log('backend', 'info', 'middleware', `Incoming ${req.method} ${req.path}`, {
      requestID,
      method: req.method,
      path: req.path,
      query: req.query,
      ip: req.ip,
    });

    // Capture response data
    const originalSend = res.send;
    let responseBody: any = null;

    res.send = function (data: any) {
      responseBody = data;
      return originalSend.call(this, data);
    };

    // Log response on finish
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const isError = res.statusCode >= 400;

      logger.log(
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
 * @param logger - Logger instance
 * @returns Express error middleware function
 */
export function createErrorLoggingMiddleware(logger: Logger) {
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    const requestID = req.headers['x-request-id'] as string || generateRequestID();

    logger.log('backend', 'fatal', 'middleware', `Unhandled error: ${err.message}`, {
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
 */
function generateRequestID(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default createLoggingMiddleware;

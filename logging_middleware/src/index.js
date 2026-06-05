/**
 * Logging Middleware Package (JavaScript)
 * Comprehensive logging solution for frontend and backend applications
 * 
 * Usage:
 * - Frontend: import { Log } from 'logging_middleware'
 * - Backend: const { Log, createLoggingMiddleware } = require('logging_middleware')
 */

const { Log, LogHelpers, shouldLog } = require('./logger');
const { createLoggingMiddleware, createErrorLoggingMiddleware } = require('./middleware');

module.exports = {
  Log,
  LogHelpers,
  shouldLog,
  createLoggingMiddleware,
  createErrorLoggingMiddleware,
};

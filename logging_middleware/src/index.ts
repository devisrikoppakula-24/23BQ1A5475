/**
 * Logging Middleware Package
 * Comprehensive logging solution for frontend and backend applications
 * 
 * Usage:
 * - Frontend: import { Log } from 'logging_middleware'
 * - Backend: import { Logger, createLoggingMiddleware } from 'logging_middleware'
 */

export { Logger, Log, initializeLogger, getLogger, createLogHelpers } from './logger';
export type { LogEntry, LogLevel, LogStack, LoggerConfig } from './logger';

export { createLoggingMiddleware, createErrorLoggingMiddleware } from './middleware';

// Re-export for convenience
import { Log } from './logger';

export default Log;

/**
 * Comprehensive Logging Middleware
 * Reusable logging package for tracking application lifecycle events
 * Supports both frontend and backend logging with centralized log management
 */

import axios, { AxiosInstance } from 'axios';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type LogStack = 'frontend' | 'backend' | 'middleware';

/**
 * Log Entry Interface
 */
export interface LogEntry {
  stack: LogStack;
  level: LogLevel;
  package: string;
  message: string;
  timestamp: string;
  clientID?: string;
  userAgent?: string;
  requestID?: string;
  metadata?: Record<string, any>;
}

/**
 * Logger Configuration
 */
export interface LoggerConfig {
  apiBaseUrl: string;
  maxQueueSize?: number;
  batchSize?: number;
  flushInterval?: number;
  enableConsole?: boolean;
}

/**
 * Log Level Severity Map
 */
const LOG_LEVEL_SEVERITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4,
};

/**
 * Logging Service Class
 * Manages centralized logging with queue and batch sending capabilities
 */
export class Logger {
  private config: LoggerConfig;
  private logQueue: LogEntry[] = [];
  private apiClient: AxiosInstance;
  private flushTimer?: NodeJS.Timeout;

  constructor(config: LoggerConfig) {
    this.config = {
      maxQueueSize: 100,
      batchSize: 10,
      flushInterval: 5000,
      enableConsole: true,
      ...config,
    };

    // Initialize axios client for log delivery
    this.apiClient = axios.create({
      baseURL: this.config.apiBaseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Start periodic flush
    this.startFlushTimer();
  }

  /**
   * Main logging function matching the required signature
   * Log(stack, level, package, message)
   */
  async log(
    stack: LogStack,
    level: LogLevel,
    packageName: string,
    message: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      const timestamp = new Date().toISOString();
      const clientID =
        typeof localStorage !== 'undefined' ? localStorage.getItem('clientID') : undefined;

      const logEntry: LogEntry = {
        stack,
        level,
        package: packageName,
        message,
        timestamp,
        ...(clientID && { clientID }),
        ...(typeof navigator !== 'undefined' && { userAgent: navigator.userAgent }),
        ...(metadata && { metadata }),
      };

      // Console output if enabled
      if (this.config.enableConsole) {
        this.logToConsole(logEntry);
      }

      // Add to queue
      this.addToQueue(logEntry);

      // Flush if queue is getting full
      if (this.logQueue.length >= this.config.maxQueueSize!) {
        await this.flush();
      }
    } catch (err) {
      console.error('[Logger Error]', err);
    }
  }

  /**
   * Log to console with appropriate styling
   */
  private logToConsole(logEntry: LogEntry): void {
    const style = this.getLogStyle(logEntry.level);
    const prefix = `[${logEntry.timestamp}] [${logEntry.stack.toUpperCase()}] [${logEntry.level.toUpperCase()}] ${logEntry.package}`;

    if (typeof console !== 'undefined') {
      console.log(`%c${prefix}: ${logEntry.message}`, style);
    }
  }

  /**
   * Get console styling based on log level
   */
  private getLogStyle(level: LogLevel): string {
    const styles: Record<LogLevel, string> = {
      debug: 'color: #666; font-weight: normal;',
      info: 'color: #0066cc; font-weight: normal;',
      warn: 'color: #ff9900; font-weight: bold;',
      error: 'color: #cc0000; font-weight: bold;',
      fatal: 'color: #990000; font-weight: bold; background: #ffcccc; padding: 2px 5px;',
    };

    return styles[level] || styles.info;
  }

  /**
   * Add log entry to queue
   */
  private addToQueue(logEntry: LogEntry): void {
    this.logQueue.push(logEntry);
  }

  /**
   * Flush queued logs to server
   */
  async flush(): Promise<void> {
    if (this.logQueue.length === 0) {
      return;
    }

    try {
      const logsToSend = this.logQueue.splice(0, this.config.batchSize);

      await this.apiClient.post('/logs/batch', {
        logs: logsToSend,
      });

      // If there are still logs queued, continue flushing
      if (this.logQueue.length > 0) {
        await this.flush();
      }
    } catch (err) {
      console.error('[Logger] Failed to flush logs:', err);
      // Re-add logs to queue if send failed
      // (they were already removed from queue in splice)
    }
  }

  /**
   * Start periodic flush timer
   */
  private startFlushTimer(): void {
    if (this.config.flushInterval && this.config.flushInterval > 0) {
      this.flushTimer = setInterval(() => {
        this.flush().catch((err) => console.error('[Logger] Flush error:', err));
      }, this.config.flushInterval);
    }
  }

  /**
   * Gracefully shutdown the logger
   */
  async shutdown(): Promise<void> {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    await this.flush();
  }

  /**
   * Check if log should be processed based on level
   */
  shouldLog(minLevel: LogLevel, currentLevel: LogLevel): boolean {
    return LOG_LEVEL_SEVERITY[currentLevel] >= LOG_LEVEL_SEVERITY[minLevel];
  }
}

/**
 * Helper functions for common logging patterns
 */
export const createLogHelpers = (logger: Logger) => ({
  apiSuccess: (endpoint: string, data?: any) =>
    logger.log('frontend', 'info', 'api', `${endpoint} request successful`, { data }),

  apiError: (endpoint: string, error: any) =>
    logger.log('frontend', 'error', 'api', `${endpoint} failed: ${error?.message || error}`),

  componentRender: (componentName: string) =>
    logger.log('frontend', 'debug', 'component', `${componentName} rendered`),

  userAction: (action: string, details?: string) =>
    logger.log('frontend', 'info', 'component', `User action: ${action}`, { details }),

  validationError: (field: string, error: string) =>
    logger.log('frontend', 'warn', 'validation', `${field}: ${error}`),

  criticalError: (source: string, error: any) =>
    logger.log('frontend', 'fatal', source, `${error?.message || JSON.stringify(error)}`),

  authEvent: (event: string, status: string) =>
    logger.log('frontend', 'info', 'auth', `${event} - ${status}`),

  databaseError: (query: string, error: any) =>
    logger.log('backend', 'error', 'db', `Query failed: ${error?.message || error}`, { query }),

  handlerError: (handler: string, error: any) =>
    logger.log('backend', 'error', 'handler', `${handler} handler failed: ${error?.message || error}`),
});

/**
 * Singleton instance
 */
let loggerInstance: Logger | null = null;

/**
 * Initialize and get logger instance
 */
export function initializeLogger(config: LoggerConfig): Logger {
  if (!loggerInstance) {
    loggerInstance = new Logger(config);
  }
  return loggerInstance;
}

/**
 * Get logger instance
 */
export function getLogger(): Logger {
  if (!loggerInstance) {
    throw new Error('Logger not initialized. Call initializeLogger first.');
  }
  return loggerInstance;
}

/**
 * Reusable Log function matching required signature
 * Log(stack, level, package, message)
 */
export async function Log(
  stack: LogStack,
  level: LogLevel,
  packageName: string,
  message: string,
  metadata?: Record<string, any>
): Promise<void> {
  const logger = getLogger();
  await logger.log(stack, level, packageName, message, metadata);
}

export default Logger;

/**
 * Comprehensive Logging Service
 * Reusable logging function that tracks the entire application lifecycle
 * Logs are sent to the evaluation service for centralized monitoring
 */

const axios = require('axios');

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://20.244.56.144/evaluation-service';

/**
 * Log Level Severity Map
 */
const LOG_LEVEL_SEVERITY = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4,
};

/**
 * Reusable logging function that creates API call to Test Server each time it's invoked
 * @param {string} stack - Application layer (frontend, backend, middleware)
 * @param {string} level - Log severity level (debug, info, warn, error, fatal)
 * @param {string} packageName - Package/module name (api, handler, db, component, etc.)
 * @param {string} message - Descriptive log message
 * @returns {Promise<void>}
 *
 * @example
 * Log("frontend", "error", "api", "Failed to fetch notifications: timeout")
 * Log("backend", "fatal", "db", "Critical database connection failure")
 * Log("frontend", "info", "component", "NotificationList rendered successfully")
 */
async function Log(stack, level, packageName, message) {
  try {
    const timestamp = new Date().toISOString();
    const clientID = typeof window !== 'undefined' ? localStorage.getItem('clientID') : undefined;

    const logEntry = {
      stack,
      level,
      package: packageName,
      message,
      timestamp,
      ...(clientID && { clientID }),
    };

    // Console output for development
    const logStyle = getLogStyle(level);
    console.log(
      `%c[${timestamp}] [${stack.toUpperCase()}] [${level.toUpperCase()}] ${packageName}: ${message}`,
      logStyle
    );

    // Send log to server
    await sendLogToServer(logEntry);
  } catch (err) {
    // Fallback logging if server communication fails
    console.error(`[Logger Error] Failed to send log:`, err);
  }
}

/**
 * Send log entry to the evaluation service
 * @param {Object} logEntry - The log entry to send
 */
async function sendLogToServer(logEntry) {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    const config = token
      ? {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      : {
          headers: {
            'Content-Type': 'application/json',
          },
        };

    await axios.post(`${API_BASE_URL}/logs`, logEntry, config);
  } catch (err) {
    // Silently fail to avoid infinite logging loops
    // Only log to console as fallback
    console.debug('[Logger] Could not send log to server:', err);
  }
}

/**
 * Get console styling based on log level
 * @param {string} level - Log level
 * @returns {string} CSS styling string for console
 */
function getLogStyle(level) {
  const styles = {
    debug: 'color: #666; font-weight: normal;',
    info: 'color: #0066cc; font-weight: normal;',
    warn: 'color: #ff9900; font-weight: bold;',
    error: 'color: #cc0000; font-weight: bold;',
    fatal: 'color: #990000; font-weight: bold; background: #ffcccc; padding: 2px 5px;',
  };

  return styles[level] || styles.info;
}

/**
 * Get logs by level (useful for filtering)
 * @param {string} minLevel - Minimum log level to retrieve
 * @param {string} currentLevel - Current log level
 * @returns {boolean} Boolean indicating if log should be processed
 */
function shouldLog(minLevel, currentLevel) {
  return LOG_LEVEL_SEVERITY[currentLevel] >= LOG_LEVEL_SEVERITY[minLevel];
}

/**
 * Helper functions for common logging scenarios
 */
const LogHelpers = {
  /**
   * Log successful API operation
   */
  apiSuccess: (endpoint, data) =>
    Log('frontend', 'info', 'api', `${endpoint} request successful${data ? ` - ${JSON.stringify(data).substring(0, 50)}...` : ''}`),

  /**
   * Log API error
   */
  apiError: (endpoint, error) =>
    Log('frontend', 'error', 'api', `${endpoint} failed: ${error?.message || error}`),

  /**
   * Log component lifecycle
   */
  componentRender: (componentName) =>
    Log('frontend', 'debug', 'component', `${componentName} rendered`),

  /**
   * Log user action
   */
  userAction: (action, details) =>
    Log('frontend', 'info', 'component', `User action: ${action}${details ? ` - ${details}` : ''}`),

  /**
   * Log validation error
   */
  validationError: (field, error) =>
    Log('frontend', 'warn', 'validation', `${field}: ${error}`),

  /**
   * Log critical error
   */
  criticalError: (source, error) =>
    Log('frontend', 'fatal', source, `${error?.message || JSON.stringify(error)}`),

  /**
   * Log authentication events
   */
  authEvent: (event, status) =>
    Log('frontend', 'info', 'auth', `${event} - ${status}`),
};

module.exports = {
  Log,
  LogHelpers,
  shouldLog,
};

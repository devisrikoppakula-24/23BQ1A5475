import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://4.224.186.213/evaluation-service';

const LOG_LEVEL_SEVERITY = { debug: 0, info: 1, warn: 2, error: 3, fatal: 4 };

export async function Log(stack, level, packageName, message) {
  try {
    const timestamp = new Date().toISOString();
    const clientID = typeof window !== 'undefined' ? localStorage.getItem('clientID') : undefined;

    const logEntry = {
      stack, level,
      package: packageName,
      message, timestamp,
      ...(clientID && { clientID }),
    };

    const styles = {
      debug: 'color: #666;',
      info: 'color: #0066cc;',
      warn: 'color: #ff9900; font-weight: bold;',
      error: 'color: #cc0000; font-weight: bold;',
      fatal: 'color: #990000; font-weight: bold; background: #ffcccc;',
    };
    console.log(`%c[${timestamp}] [${stack.toUpperCase()}] [${level.toUpperCase()}] ${packageName}: ${message}`, styles[level] || styles.info);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      await axios.post(`${API_BASE_URL}/logs`, logEntry, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
    } catch {
      console.debug('[Logger] Could not send log to server');
    }
  } catch (err) {
    console.error('[Logger Error]', err);
  }
}

export function shouldLog(minLevel, currentLevel) {
  return LOG_LEVEL_SEVERITY[currentLevel] >= LOG_LEVEL_SEVERITY[minLevel];
}

export const LogHelpers = {
  apiSuccess: (endpoint, data) => Log('frontend', 'info', 'api', `${endpoint} request successful${data ? ` - ${JSON.stringify(data).substring(0, 50)}...` : ''}`),
  apiError: (endpoint, error) => Log('frontend', 'error', 'api', `${endpoint} failed: ${error?.message || error}`),
  componentRender: (componentName) => Log('frontend', 'debug', 'component', `${componentName} rendered`),
  userAction: (action, details) => Log('frontend', 'info', 'component', `User action: ${action}${details ? ` - ${details}` : ''}`),
  validationError: (field, error) => Log('frontend', 'warn', 'validation', `${field}: ${error}`),
  criticalError: (source, error) => Log('frontend', 'fatal', source, `${error?.message || JSON.stringify(error)}`),
  authEvent: (event, status) => Log('frontend', 'info', 'auth', `${event} - ${status}`),
};

export default Log;

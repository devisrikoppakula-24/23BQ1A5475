# Logging Middleware Package

A comprehensive, reusable logging middleware for JavaScript applications supporting both frontend and backend environments.

## Features

- **Unified Logging Interface**: Single `Log(stack, level, package, message)` function for all logging
- **JavaScript Support**: Pure JavaScript, no TypeScript compilation needed
- **Express Integration**: Ready-to-use middleware for Express.js applications
- **Console Styling**: Color-coded console output for different log levels
- **Centralized Logging**: Send logs to evaluation service for monitoring
- **Production Ready**: Error handling, timeouts, and graceful degradation

## Installation

```bash
npm install logging-middleware
```

## Usage

### Frontend (Next.js/React)

```javascript
import { Log } from '@/services/logger';

// Simple logging
await Log('frontend', 'info', 'api', 'Successfully fetched notifications');
await Log('frontend', 'error', 'api', 'Failed to fetch notifications: timeout');

// With metadata
await Log('frontend', 'warn', 'component', 'Component re-rendered unexpectedly', {
  componentName: 'NotificationList',
  renderCount: 5
});
```

### Backend (Express.js)

```javascript
const express = require('express');
const { Log, createLoggingMiddleware } = require('logging-middleware');

const app = express();

// Use logging middleware
app.use(createLoggingMiddleware());

// Log events
app.get('/api/data', async (req, res) => {
  try {
    await Log('backend', 'info', 'handler', 'Processing request');
    res.json({ success: true });
  } catch (error) {
    await Log('backend', 'error', 'handler', `Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});
```

## API Reference

### Log Function

```javascript
Log(
  stack,      // 'frontend' | 'backend' | 'middleware'
  level,      // 'debug' | 'info' | 'warn' | 'error' | 'fatal'
  package,    // string: component/module name
  message     // string: descriptive message
): Promise<void>
```

## Log Levels

| Level | Severity | Use Case |
|-------|----------|----------|
| debug | 0 | Development debugging information |
| info | 1 | General informational messages |
| warn | 2 | Warning conditions that should be investigated |
| error | 3 | Error conditions requiring attention |
| fatal | 4 | Critical errors that may cause shutdown |

## Log Stacks

- **frontend**: Client-side application code
- **backend**: Server-side application code
- **middleware**: Middleware and infrastructure code

## Examples

### API Call Logging

```javascript
Log('frontend', 'info', 'api', 'Fetching notifications with limit=10, page=1');
Log('frontend', 'info', 'api', 'Successfully fetched 10 notifications');
```

### Error Handling

```javascript
try {
  await fetchData();
} catch (error) {
  await Log('backend', 'error', 'db', `Database query failed: ${error.message}`);
}
```

### User Actions

```javascript
Log('frontend', 'info', 'component', 'User changed notification filter', {
  selectedTypes: ['Event', 'Result'],
  timestamp: new Date().toISOString()
});
```

### Database Operations

```javascript
Log('backend', 'error', 'db', 'Critical database connection failure', {
  host: 'db.example.com',
  port: 5432,
  error: 'Connection timeout'
});
```

## Architecture

The logging system works as follows:

1. **Log Creation**: Application calls `Log()` function
2. **Console Output**: If enabled, message is logged to console with styling
3. **Server Delivery**: Log sent to evaluation service via HTTP POST
4. **Graceful Degradation**: If server unavailable, logs continue locally

## Performance Considerations

- Console logging can be disabled in production
- Non-blocking log delivery
- Failed sends don't block application execution
- Automatic error handling and recovery

## Security

- Never log sensitive data (passwords, tokens, API keys)
- Use metadata field cautiously with PII
- Ensure API endpoint is HTTPS in production
- Implement proper authentication for log delivery

## Troubleshooting

### Logs not appearing on server
1. Check API endpoint configuration
2. Verify network connectivity
3. Check authentication headers if required
4. Review server logs for errors

### Console logs not showing
1. Check browser console (F12)
2. Ensure logger is properly initialized
3. Verify log level is appropriate

## License

MIT

## Support

For issues or questions, refer to the main project documentation.


## Features

- **Unified Logging Interface**: Single `Log(stack, level, package, message)` function for all logging
- **TypeScript Support**: Full type safety with TypeScript definitions
- **Queue Management**: Efficient batching and flushing of logs
- **Express Integration**: Ready-to-use middleware for Express.js applications
- **Console Styling**: Color-coded console output for different log levels
- **Centralized Logging**: Send logs to evaluation service for monitoring
- **Production Ready**: Error handling, timeouts, and graceful degradation

## Installation

```bash
npm install logging-middleware
```

## Usage

### Frontend (Next.js/React)

```typescript
import { Log } from 'logging-middleware';

// Simple logging
await Log('frontend', 'info', 'api', 'Successfully fetched notifications');
await Log('frontend', 'error', 'api', 'Failed to fetch notifications: timeout');

// With metadata
await Log('frontend', 'warn', 'component', 'Component re-rendered unexpectedly', {
  componentName: 'NotificationList',
  renderCount: 5
});
```

### Backend (Express.js)

```typescript
import express from 'express';
import { initializeLogger, createLoggingMiddleware, Log } from 'logging-middleware';

const app = express();
const logger = initializeLogger({
  apiBaseUrl: 'http://20.244.56.144/evaluation-service',
  enableConsole: true,
  batchSize: 10,
  flushInterval: 5000,
});

// Use logging middleware
app.use(createLoggingMiddleware(logger));

// Log events
app.get('/api/data', async (req, res) => {
  try {
    await Log('backend', 'info', 'handler', 'Processing request');
    res.json({ success: true });
  } catch (error) {
    await Log('backend', 'error', 'handler', `Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await logger.shutdown();
  process.exit(0);
});
```

## API Reference

### Log Function

```typescript
Log(
  stack: 'frontend' | 'backend' | 'middleware',
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal',
  package: string,
  message: string,
  metadata?: Record<string, any>
): Promise<void>
```

### Logger Class

#### Methods

- `log(stack, level, package, message, metadata?)` - Log an entry
- `flush()` - Flush queued logs to server
- `shutdown()` - Gracefully shutdown logger
- `shouldLog(minLevel, currentLevel)` - Check if log should be processed

#### Configuration

```typescript
interface LoggerConfig {
  apiBaseUrl: string;        // API endpoint for log delivery
  maxQueueSize?: number;      // Default: 100
  batchSize?: number;         // Default: 10
  flushInterval?: number;     // Default: 5000ms
  enableConsole?: boolean;    // Default: true
}
```

## Log Levels

| Level | Severity | Use Case |
|-------|----------|----------|
| debug | 0 | Development debugging information |
| info | 1 | General informational messages |
| warn | 2 | Warning conditions that should be investigated |
| error | 3 | Error conditions requiring attention |
| fatal | 4 | Critical errors that may cause shutdown |

## Log Stacks

- **frontend**: Client-side application code
- **backend**: Server-side application code
- **middleware**: Middleware and infrastructure code

## Examples

### API Call Logging

```typescript
Log('frontend', 'info', 'api', 'Fetching notifications with limit=10, page=1');
Log('frontend', 'info', 'api', 'Successfully fetched 10 notifications');
```

### Error Handling

```typescript
try {
  await fetchData();
} catch (error) {
  await Log('backend', 'error', 'db', `Database query failed: ${error.message}`);
}
```

### User Actions

```typescript
Log('frontend', 'info', 'component', 'User changed notification filter', {
  selectedTypes: ['Event', 'Result'],
  timestamp: new Date().toISOString()
});
```

### Database Operations

```typescript
Log('backend', 'error', 'db', 'Critical database connection failure', {
  host: 'db.example.com',
  port: 5432,
  error: 'Connection timeout'
});
```

## Architecture

The logging system works as follows:

1. **Log Creation**: Application calls `Log()` function
2. **Console Output**: If enabled, message is logged to console with styling
3. **Queue Management**: Log entry added to in-memory queue
4. **Batching**: When queue reaches batch size or flush interval elapses, logs are sent
5. **Server Delivery**: Logs sent to evaluation service via HTTP POST
6. **Graceful Shutdown**: On exit, remaining queued logs are flushed

## Performance Considerations

- Logs are queued and sent in batches to reduce network overhead
- Console logging can be disabled in production
- Automatic flush ensures logs aren't lost on application exit
- Failed sends don't block application execution
- Maximum queue size prevents memory issues

## Security

- Never log sensitive data (passwords, tokens, API keys)
- Use metadata field cautiously with PII
- Ensure API endpoint is HTTPS in production
- Implement proper authentication for log delivery

## Troubleshooting

### Logs not appearing on server
1. Check API endpoint configuration
2. Verify network connectivity
3. Check authentication headers if required
4. Review server logs for errors

### Console logs not showing
1. Verify `enableConsole` is true in config
2. Check browser console for errors
3. Ensure logger is properly initialized

### Memory issues
1. Reduce `maxQueueSize`
2. Increase `flushInterval` if network latency is high
3. Reduce batch size if needed

## License

MIT

## Support

For issues or questions, refer to the main project documentation.

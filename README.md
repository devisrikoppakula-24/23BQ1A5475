# Notification Management System

A comprehensive notification management application with frontend, backend, and logging middleware components. Built with Next.js, React, Material UI, and a production-grade logging system.

## Project Structure

```
├── logging_middleware/          # Logging and monitoring middleware (reusable package)
├── notification_app_be/         # Backend API server
├── notification_app_fe/         # Frontend React/Next.js application
├── notification_system_design.md # System architecture documentation
└── README.md
```

## Key Features

- **Unified Logging System**: Comprehensive `Log(stack, level, package, message)` function for tracking application lifecycle
- **Frontend Notifications**: Beautiful Material UI notification display with real-time filtering
- **Error Tracking**: Full error handling and reporting across frontend and backend
- **Performance Monitoring**: Request/response timing and monitoring
- **User Actions**: Tracking all user interactions and navigation
- **Audit Trail**: Complete audit log of system events

## Prerequisites

- Node.js 16+ and npm/yarn
- A modern web browser for frontend
- Access to the evaluation service API

## Installation & Setup

### 1. Frontend Setup

The frontend is built with Next.js and Material UI with integrated logging.

```bash
cd notification_app_fe
npm install
```

### 2. Logging Middleware Setup

The logging middleware is a reusable TypeScript/JavaScript package.

```bash
cd logging_middleware
npm install
```

### 3. Backend Setup

The backend provides API endpoints for notifications.

```bash
cd notification_app_be
npm install
```

## Configuration

### Frontend Configuration

Create a `.env.local` file in `notification_app_fe`:

```
NEXT_PUBLIC_API_URL=http://20.244.56.144/evaluation-service
```

## Running the Application

### 1. Start the Frontend Development Server

```bash
cd notification_app_fe
npm run dev
```

The application will be available at `http://localhost:3000`

### 2. (Optional) Start Logging Service

```bash
cd logging_middleware
npm install
npm start
```

### 3. (Optional) Start Backend

```bash
cd notification_app_be
npm start
```

## Logging System Overview

### Frontend Logging

The frontend integrates comprehensive logging at multiple levels:

```typescript
import { Log } from '@/services/logger';

// Log API call
Log('frontend', 'info', 'api', 'Fetching notifications');

// Log user action
Log('frontend', 'info', 'component', 'User applied notification filter');

// Log error
Log('frontend', 'error', 'component', 'Failed to load notifications');

// Log critical issue
Log('frontend', 'fatal', 'api', 'API authentication failed');
```

### Logged Events

#### API Layer
- ✅ Successful API calls (endpoint, data count)
- ❌ Failed API requests (error message)
- ⏱️ Response timing
- 🔐 Authentication events (login, logout, token refresh)

#### Component Layer
- 🎨 Component rendering
- 👤 User interactions (filter changes, pagination, deletions)
- ⚠️ Validation errors
- 📊 State changes

#### System Layer
- 🚀 Application startup
- 🛑 Application shutdown
- 💾 Data persistence
- 🔄 Cache operations

### Log Levels

| Level | Severity | Color | Use Case |
|-------|----------|-------|----------|
| **debug** | 0 | Gray | Development debugging |
| **info** | 1 | Blue | General information |
| **warn** | 2 | Orange | Warnings |
| **error** | 3 | Red | Errors |
| **fatal** | 4 | Dark Red | Critical issues |

### Log Stacks

- **frontend**: Client-side application
- **backend**: Server-side application
- **middleware**: Infrastructure and logging

## Features

### Frontend Features
- **Notification Display**: View all notifications in a clean, organized list
- **Filtering**: Filter notifications by type (Event, Result, Placement)
- **Pagination**: Navigate through large notification sets efficiently
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Material UI**: Professional, accessible UI components
- **Real-time Updates**: Live notification management
- **Delete Notifications**: Remove notifications as needed
- **Comprehensive Logging**: Track every user action and system event

### API Features
- **Authentication**: JWT-based authentication
- **Notification Management**: Full CRUD operations
- **Filtering & Pagination**: Advanced query parameters
- **Error Handling**: Comprehensive error responses
- **Logging**: Request/response logging with performance metrics
- **Audit Trail**: Complete event tracking

## API Endpoints

### Authentication
- `POST /auth/login` - Authenticate user and get JWT token

### Notifications
- `GET /notifications?limit=10&page=1&notification_type=Event` - Fetch notifications with filters
- `PUT /notifications/{id}/view` - Mark notification as viewed
- `DELETE /notifications/{id}` - Delete a notification
- `GET /notifications/stats` - Get notification statistics

### Logging
- `POST /logs` - Send single log entry (frontend)
- `POST /logs/batch` - Send batch of log entries (backend)

## Notification Types

- **Event**: General events (tech-fest, induction, farewell, etc.)
- **Result**: Academic or assessment results
- **Placement**: Job placement opportunities

## Technologies Used

### Frontend
- **Next.js 14**: React framework for production
- **React 18**: UI library
- **Material-UI 5**: Component library and styling
- **Axios**: HTTP client
- **TypeScript**: Type-safe development

### Backend
- **Express.js**: Web framework
- **Node.js**: Runtime environment
- **Axios**: HTTP client for API calls

### Logging Middleware
- **JavaScript**: Pure JavaScript implementation
- **Express.js**: Optional Express integration
- **Morgan**: HTTP request logger
- **Winston**: Structured logging (optional)

## Project Standards

This project adheres to production-grade coding standards:

### Code Quality
- ✅ Clean, readable, and maintainable code
- ✅ Consistent naming conventions
- ✅ Well-organized folder structure
- ✅ Clear inline documentation
- ✅ Comprehensive error handling
- ✅ Type safety with TypeScript

### Logging Standards
- ✅ All API calls are logged
- ✅ All user actions are tracked
- ✅ All errors are captured with context
- ✅ Performance metrics are recorded
- ✅ Audit trail of system events
- ✅ Security events are logged

### Logging Best Practices
- Descriptive log messages
- Appropriate log levels for different scenarios
- Context-rich metadata in logs
- No sensitive data in logs (passwords, tokens)
- Efficient log batching and delivery

## Development Workflow

1. Clone the repository
2. Install dependencies for each module
3. Configure environment variables
4. Run development servers
5. Make changes and test thoroughly
6. Check console logs and browser logs
7. Commit changes with descriptive messages
8. Push to remote repository

## Build and Deployment

### Frontend Build
```bash
cd notification_app_fe
npm run build
npm start
```

### Logging Middleware Build
```bash
cd logging_middleware
npm run build
```

### Production Deployment

Ensure all environment variables are properly configured before deployment.

## Monitoring & Debugging

### Browser Console
The application logs all events to the browser console with color coding:

```
[timestamp] [FRONTEND] [INFO] api: Fetching notifications
[timestamp] [FRONTEND] [ERROR] api: Failed to fetch notifications: timeout
[timestamp] [FRONTEND] [WARN] component: Component re-rendered unexpectedly
```

### Server Logs
All events are also sent to the evaluation service for centralized monitoring.

## Error Handling

The application includes comprehensive error handling:

- ✅ Network error recovery
- ✅ Validation error messages
- ✅ User-friendly error notifications
- ✅ Detailed error logging for debugging
- ✅ Graceful degradation

## Security Considerations

- 🔐 JWT token-based authentication
- 🔐 Environment variables for sensitive data
- 🔐 CORS configuration
- 🔐 Input validation
- 🔐 Secure HTTP headers
- 🔐 No sensitive data in logs

## Troubleshooting

### Frontend Issues

**Symptoms**: Blank page or loading spinner stuck
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for errors (F12)
- Verify API endpoint is correct in `.env.local`
- Check network connectivity to API server

**Symptoms**: API timeout errors
- Verify API server is running
- Check firewall settings
- Increase timeout in `src/services/api.ts` if needed
- Set access token in localStorage

**Symptoms**: Notifications not loading
- Check browser DevTools Network tab
- Verify access token is present
- Check API server logs
- Review browser console for errors

### Logging Issues

**Logs not appearing in console**
- Enable console output in logger config
- Check browser console (F12)
- Verify logger is initialized properly

**Logs not reaching server**
- Check API endpoint configuration
- Verify network connectivity
- Review server logs for errors
- Check for CORS issues

## Support

For issues or questions, please refer to:
- `notification_system_design.md` - System architecture
- `logging_middleware/README.md` - Logging system details
- Browser console for debugging

## License

MIT License

## Notes

- Ensure your firewall allows connections to the evaluation service
- Token expires after a set duration; refresh tokens are handled automatically
- Always use HTTPS in production environments
- Keep API keys and secrets secure
- Review logs regularly for security events and errors


## Prerequisites

- Node.js 16+ and npm/yarn
- A modern web browser for frontend
- Access to the evaluation service API

## Frontend Setup

The frontend is built with Next.js and Material UI.

### Installation

```bash
cd notification_app_fe
npm install
```

### Configuration

Create a `.env.local` file in the `notification_app_fe` directory:

```
NEXT_PUBLIC_API_URL=http://20.244.56.144/evaluation-service
```

### Running the Frontend

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Backend Setup

The backend provides API endpoints for notifications.

### Installation

```bash
cd notification_app_be
npm install
```

### Running the Backend

```bash
npm start
```

## Logging Middleware Setup

Logging and monitoring middleware for request/response tracking.

### Installation

```bash
cd logging_middleware
npm install
```

### Running Middleware

```bash
npm start
```

## Features

### Frontend Features
- **Notification Display**: View all notifications in a clean, organized list
- **Filtering**: Filter notifications by type (Event, Result, Placement)
- **Pagination**: Navigate through large notification sets efficiently
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Material UI**: Professional, accessible UI components
- **Real-time Updates**: Live notification management
- **Delete Notifications**: Remove notifications as needed

### API Features
- **Authentication**: JWT-based authentication
- **Notification Management**: Full CRUD operations
- **Filtering & Pagination**: Advanced query parameters
- **Error Handling**: Comprehensive error responses
- **Logging**: Request/response logging

## API Endpoints

### Authentication
- `POST /auth/login` - Authenticate user and get JWT token

### Notifications
- `GET /notifications?limit=10&page=1&notification_type=Event` - Fetch notifications with filters
- `PUT /notifications/{id}/view` - Mark notification as viewed
- `DELETE /notifications/{id}` - Delete a notification
- `GET /notifications/stats` - Get notification statistics

## Notification Types

- **Event**: General events (tech-fest, induction, etc.)
- **Result**: Academic or assessment results
- **Placement**: Job placement opportunities

## Technologies Used

### Frontend
- **Next.js**: React framework for production
- **React**: UI library
- **Material-UI**: Component library and styling
- **Axios**: HTTP client
- **TypeScript**: Type-safe development

### Backend
- **Express.js**: Web framework
- **Node.js**: Runtime environment
- **Axios**: HTTP client for API calls

### Middleware
- **Express.js**: Web framework
- **Morgan**: HTTP request logger
- **Winston**: Logging library

## Project Standards

This project follows production-grade coding standards:

- **Code Quality**: Clean, readable, and maintainable code
- **Naming Conventions**: Consistent naming for files, functions, and variables
- **Folder Structure**: Well-organized directory structure
- **Comments**: Clear documentation within code
- **Error Handling**: Comprehensive error handling and validation
- **Security**: Best practices for security and data protection

## Development Workflow

1. Clone the repository
2. Install dependencies for each module
3. Configure environment variables
4. Run development servers
5. Make changes and test thoroughly
6. Commit changes with descriptive messages
7. Push to remote repository

## Build and Deployment

### Frontend Build
```bash
cd notification_app_fe
npm run build
npm start
```

### Production Deployment

Ensure all environment variables are properly configured before deployment.

## Error Handling

The application includes comprehensive error handling:
- Network error recovery
- Validation error messages
- User-friendly error notifications
- Logging of errors for debugging

## Security Considerations

- JWT token-based authentication
- Environment variables for sensitive data
- CORS configuration
- Input validation
- Secure HTTP headers

## Support

For issues or questions, please refer to the `notification_system_design.md` file for detailed architecture documentation.

## License

MIT License

## Notes

- Ensure your firewall allows connections to the evaluation service
- Token expires after a set duration; refresh tokens are handled automatically
- Always use HTTPS in production environments
- Keep API keys and secrets secure

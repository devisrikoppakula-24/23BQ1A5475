# Notification Management System

A comprehensive notification management application with frontend, backend, and logging middleware components.

## Project Structure

```
├── logging_middleware/          # Logging and monitoring middleware
├── notification_app_be/         # Backend API server
├── notification_app_fe/         # Frontend React/Next.js application
├── notification_system_design.md # System architecture documentation
└── README.md
```

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

# Client-Side

This client-side application is built using React and provides a user interface for the FitBot application. It includes features for user authentication, chat functionality, and a machine learning-powered deadlift analysis tool.

## Features

- **User Authentication**: Supports user registration and login.
- **Chat Functionality**: Users can interact with an AI-powered chatbot for fitness advice.
- **Deadlift Analysis**: Real-time analysis of deadlift form using machine learning.
- **Admin Dashboard**: Allows administrators to manage users.

## Installation

1. Ensure you have Node.js installed on your machine.
2. Clone the whole app repository to your local machine.
3. Navigate to the client directory:
   ```bash
   cd client
   ```
4. Install the required packages:
   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the client directory with the following required environment variables:

Example format:
- `REACT_APP_API_URL=<backend_api_url>`: The URL of the backend API.
- `REACT_APP_ML_API_URL=<ml_api_url>`: The URL of the machine learning API.

Actual variables for testing:
- REACT_APP_API_URL=http://localhost:5000/api
- REACT_APP_ML_API_URL=http://localhost:5001

## Running the Client

To start the client in development mode, run:
```bash
npm start
```

This will start the development server, typically on `http://localhost:3000`.

## Building for Production

To create a production build, run:
```bash
npm run build
```

This will create a `build` directory with optimized production-ready files.

## Main Components

- **LandingPage**: The initial page users see when visiting the site.
- **AuthPage**: Handles user registration and login.
- **ChatPage**: Provides the chat interface for interacting with the AI.
- **MLDeadliftPage**: Implements the deadlift analysis feature.
- **AdminPage**: Dashboard for user management (admin access only).

## Key Files

- **App.js**: Main component that sets up routing and authentication context.
- **index.js**: Entry point of the React application.
- **api.js**: Contains functions for making API calls to the backend.

## Styling

The application uses Tailwind CSS for styling. The main configuration file is:

```typescript:client/tailwind.config.js
startLine: 1
endLine: 99
```

## Dependencies

Major dependencies include:
- React: Core library for building the user interface.
- React Router: For handling routing within the application.
- Axios: For making HTTP requests to the backend.
- TensorFlow.js: For client-side machine learning capabilities.
- Tailwind CSS: For styling the application.

For a full list of dependencies, refer to the `package.json` file:

```typescript:client/package.json
startLine: 1
endLine: 59
```

## Development

- The application uses React's context API for state management, particularly for authentication.
- Custom hooks and components are used to encapsulate and reuse logic across the application.
- The project structure separates concerns into components, pages, and utility functions.


## Deployment

After building the project, the contents of the `build` directory can be deployed to any static hosting service.

## Additional Information

- The client interacts with both the main backend server and a separate machine learning server for deadlift analysis.
- Ensure that the backend servers are running and accessible at the URLs specified in the `.env` file.

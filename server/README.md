# Server-Side

This server-side is built using Node.js and Express. It provides a RESTful API for user authentication, user management, and chat functionalities, integrating MongoDB for data persistence and Google Cloud's Vertex AI for chat responses.

## Features

- **User Authentication**: Supports user registration and login.
- **User Management**: Admins can view, update, and delete user profiles.
- **Chat Functionality**: Users can send messages which are processed by Vertex AI to generate responses.

## Installation

1. Ensure you have Node.js installed on your machine.
2. Clone the whole app repository to your local machine.
3. Navigate to the server directory:
   ```bash
   cd server
   ```
4. Install the required packages:
   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the server directory with the following required environment variables:

Example format:
- `PORT=<port_number>`: The port number on which the server will run, ensuring it matches with `REACT_APP_API_URL` in the client/src/.env file.
- `MONGODB_URI=<mongodb_connection_string>`: The URI for connecting to the MongoDB database.
- `JWT_SECRET=<your_jwt_secret_key>`: The secret key for signing JSON Web Tokens.
- `GOOGLE_CLOUD_PROJECT=<google_cloud_project_id>`: The Google Cloud project ID for Vertex AI.
- `GOOGLE_CLOUD_LOCATION=<google_cloud_location>`: The location for the Vertex AI service.

Actual variables for testing:

- PORT=5000
- MONGODB_URI=mongodb+srv://tinnd1506:1234@fitbot.galyt.mongodb.net/?retryWrites=true&w=majority&appName=FitBot
- JWT_SECRET=your_jwt_secret_key
- GOOGLE_CLOUD_PROJECT=flash-ward-434114-s0
- GOOGLE_CLOUD_LOCATION=us-central1

## Running the Server

To start the server, run:
```bash
npm start
```

## API Endpoints

### Authentication Routes

- **POST /api/register**: Register a new user.
- **POST /api/login**: Authenticate a user and return a JWT.

### User Management Routes (Admin only)

- **GET /api/users**: Fetch all users.
- **PUT /api/users/:userId**: Update a specific user's details.
- **DELETE /api/users/:userId**: Delete a specific user.

### Chat Routes

- **POST /api/chat**: Send a chat message and receive a response from the AI.

## Dependencies

- Express: Framework for building the API.
- Mongoose: MongoDB object modeling tool.
- bcryptjs: Library for hashing and comparing passwords.
- jsonwebtoken: Implementation of JSON Web Tokens.
- cors: Middleware to enable CORS.
- dotenv: Loads environment variables from `.env` file.
- @google-cloud/vertexai: Client library for accessing Google Cloud Vertex AI.

## Code Structure

- **Entry Point**: The main entry point of the application is `server.js`.
- **Routes**: Defined in `routes` directory.
- **Controllers**: Business logic is handled in `controllers`.
- **Models**: Database models are defined in `models`.
- **Middleware**: Authentication and authorization middleware are in `middleware`.
- **Config**: Configuration files and setup are located in `config`.


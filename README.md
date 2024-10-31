# FitBot: AI-Powered Fitness Application

FitBot is an innovative fitness application integrating a React frontend, Node.js backend, and Flask machine learning server. It offers role-based user authentication, an AI fitness chatbot, an admin dashboard, and real-time deadlift analysis.

## Components

1. **Client**: React-based frontend
2. **Server**: Node.js and Express backend
3. **MLApp**: Flask-based machine learning server

For detailed information on each component, refer to their respective README files:
- [Client README](client/README.md)
- [Server README](server/README.md)
- [MLApp README](mlapp/README.md)

## Quick Start

1. Clone the repository and navigate to the project directory.

2. Set up each component:
   ```bash
   # Client
   cd client && npm install

   # Server
   cd ../server && npm install

   # MLApp
   cd ../mlapp && pip3 install -r requirements.txt
   ```

3. Configure environment variables as specified in each component's README.

4. Start the applications:
   ```bash
   # Server
   cd server && npm start

   # Client
   cd client && npm start

   # MLApp
   cd mlapp && python3 app.py
   ```

## Key Features

- User authentication
- AI-powered fitness chatbot
- Real-time deadlift analysis
- Admin dashboard for user management

## Development and Deployment

Refer to individual component READMEs for specific development and deployment instructions.

## API Endpoints

For a list of available API endpoints, see the Server and MLApp README files.

## Data Collection and Model Training

Instructions for data collection and model training can be found in the MLApp README.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import React Router components
import { AuthProvider } from './components/context/AuthContext'; // Updated import path
import LandingPage from './pages/LandingPage'; // Import landing page component
import AuthPage from './pages/AuthPage'; // Import authentication page component
import ChatPage from './pages/UserPage'; // Import chat page component
import AdminPage from './pages/AdminPage'; // Import admin page component
import DeadliftPage from './pages/MLDeadliftPage'; // Import deadlift page component
import FitnessChatPage from './pages/ChatPage'; // Import fitness chat page component
import ProtectedRoute from './components/auth/ProtectedRoute'; // Import ProtectedRoute component to handle route protection

function App() {
  return (
    <AuthProvider> {/* Provide authentication context to the entire app */}
      <Router> {/* Set up routing for the application */}
        <Routes>
          {/* Public route for the landing page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Public route for the authentication page */}
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Protected route for the chat page, accessible only to users */}
          <Route path="/chat" element={
            <ProtectedRoute allowedRole="user">
              <ChatPage />
            </ProtectedRoute>
          } />
          
          {/* Protected route for the admin page, accessible only to admins */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRole="admin">
              <AdminPage />
            </ProtectedRoute>
          } />
          
          {/* Protected route for the deadlift page, accessible only to users */}
          <Route path="/deadlift" element={
            <ProtectedRoute allowedRole="user">
              <DeadliftPage />
            </ProtectedRoute>
          } />
          
          {/* Protected route for the fitness chat page, accessible only to users */}
          <Route path="/fitness-chat" element={
            <ProtectedRoute allowedRole="user">
              <FitnessChatPage />
            </ProtectedRoute>
          } /> 
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; // Export the App component as default

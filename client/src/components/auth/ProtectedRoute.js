import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// ProtectedRoute component: Ensures that only authenticated users with the correct role can access certain routes
const ProtectedRoute = ({ children, allowedRole }) => {
  // Get authentication status and user role from the useAuth hook
  const { isAuthenticated, userRole } = useAuth();

  // If the user is not authenticated, redirect to the auth page
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // If an allowed role is specified and the user's role doesn't match, redirect to the appropriate page
  if (allowedRole && userRole !== allowedRole) {
    // Redirect admins to the admin page, and other users to the chat page
    return <Navigate to={userRole === 'admin' ? '/admin' : '/chat'} replace />;
  }

  // If the user is authenticated and has the correct role (or no role is required), render the children
  return children;
};

export default ProtectedRoute;

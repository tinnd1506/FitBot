import React, { createContext, useState, useEffect } from 'react';

// Create a context for authentication
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // State to track authentication status and user role
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Effect to check for existing authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    setIsAuthenticated(!!token); // Convert token to boolean
    setUserRole(role);
  }, []);

  // Function to handle user login
  const login = (token, role) => {
    // Store authentication data in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    // Update state
    setIsAuthenticated(true);
    setUserRole(role);
  };

  // Function to handle user logout
  const logout = () => {
    // Remove authentication data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    // Reset state
    setIsAuthenticated(false);
    setUserRole(null);
  };

  // Provide authentication context to child components
  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

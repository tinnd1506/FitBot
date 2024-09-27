import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook to access the authentication context
 * 
 * @returns {Object} The authentication context object
 * @throws {Error} If used outside of an AuthProvider
 */
export const useAuth = () => {
  // Retrieve the auth context
  const context = useContext(AuthContext);

  // Ensure the hook is used within an AuthProvider
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  // Return the auth context
  return context;
};

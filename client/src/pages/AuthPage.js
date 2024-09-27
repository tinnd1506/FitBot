// src/pages/AuthPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../api';
import { useAuth } from '../components/hooks/useAuth';
import SharedBackground from '../components/backgrounds/SharedBackground';
import AuthForm from '../components/auth/AuthForm';

const AuthPage = () => {
  // State management for form inputs and UI control
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  // Hooks for navigation and authentication
  const navigate = useNavigate();
  const { login } = useAuth();

  // Handle form submission for both registration and login
  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        // Handle user registration
        await registerUser(username, password);
        alert('Registration successful! Please log in.');
        setIsRegistering(false);
      } else {
        // Handle user login
        const { token, role } = await loginUser(username, password);
        login(token, role);
        // Redirect based on user role
        navigate(role === 'admin' ? '/admin' : '/chat');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Render the authentication page
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white relative overflow-hidden px-4">
      <SharedBackground />
      <AuthForm
        isRegistering={isRegistering}
        setIsRegistering={setIsRegistering}
        handleAuth={handleAuth}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        error={error}
      />
    </div>
  );
};

export default AuthPage;

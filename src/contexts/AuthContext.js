import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import api from '../services/api';
import config from '../config/environment';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [googleInitialized, setGoogleInitialized] = useState(false);

  // Initialize Google Identity Services
  useEffect(() => {
    // Check if script is already loaded
    if (window.google && window.google.accounts) {
      initializeGoogle();
      return;
    }

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('Google Identity Services script loaded');
      initializeGoogle();
    };
    script.onerror = () => {
      console.error('Failed to load Google Identity Services script');
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const initializeGoogle = useCallback(() => {
    if (window.google && window.google.accounts) {
      try {
        window.google.accounts.id.initialize({
          client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your actual client ID
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        setGoogleInitialized(true);
        console.log('Google Identity Services initialized successfully');
      } catch (error) {
        console.error('Error initializing Google Identity Services:', error);
        setGoogleInitialized(false);
      }
    } else {
      console.error('Google Identity Services not available');
      setGoogleInitialized(false);
    }
  }, []);

  // Handle Google OAuth response
  const handleCredentialResponse = async (response) => {
    try {
      console.log('Google OAuth response received');
      // Decode the JWT token from Google
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      // Create user object from Google response
      const userInfo = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      };

      console.log('User info extracted:', userInfo);

      // Set user and create a simple access token
      setUser(userInfo);
      setAccessToken(response.credential);
      setLoading(false);

      // Store in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(userInfo));
      localStorage.setItem('accessToken', response.credential);
    } catch (error) {
      console.error('Error handling Google OAuth response:', error);
      setUser(null);
      setAccessToken(null);
      setLoading(false);
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('accessToken');
    
    if (savedUser && savedToken) {
      try {
        const userInfo = JSON.parse(savedUser);
        setUser(userInfo);
        setAccessToken(savedToken);
        console.log('Restored user session from localStorage');
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
      }
    }
    setLoading(false);
  }, []);

  // Login with Google (direct OAuth)
  const loginWithGoogle = (e, rememberMe) => {
    if (e) e.preventDefault();
    
    if (window.google && window.google.accounts && googleInitialized) {
      console.log('Prompting Google Sign-In');
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          console.error('Google Sign-In prompt not displayed:', notification);
        } else if (notification.isSkippedMoment()) {
          console.error('Google Sign-In prompt skipped:', notification);
        } else if (notification.isDismissedMoment()) {
          console.log('Google Sign-In prompt dismissed');
        }
      });
    } else {
      console.error('Google Identity Services not loaded or initialized');
      alert('Google Sign-In is not available. Please refresh the page and try again.');
    }
  };

  // Logout
  const logout = () => {
    console.log('Logging out user');
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    
    // Sign out from Google
    if (window.google && window.google.accounts) {
      window.google.accounts.id.disableAutoSelect();
    }
    
    window.location.href = '/login';
  };

  // Provide context
  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      accessToken, 
      setAccessToken, 
      loginWithGoogle, 
      logout,
      googleInitialized 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  return useContext(AuthContext);
} 
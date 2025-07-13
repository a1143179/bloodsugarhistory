import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import api from '../services/api';
import config from '../config/environment';
import logger from '../services/logger';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [googleInitialized, setGoogleInitialized] = useState(false);

  // Initialize Google Identity Services
  useEffect(() => {
    logger.info('Initializing Google Identity Services');
    
    // Check if script is already loaded
    if (window.google && window.google.accounts) {
      logger.debug('Google script already loaded, initializing directly');
      initializeGoogle();
      return;
    }

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      logger.info('Google Identity Services script loaded successfully');
      initializeGoogle();
    };
    script.onerror = () => {
      logger.error('Failed to load Google Identity Services script');
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript) {
        existingScript.remove();
        logger.debug('Google script cleanup completed');
      }
    };
  }, []);

  const initializeGoogle = useCallback(() => {
    if (window.google && window.google.accounts) {
      try {
        logger.debug('Initializing Google Identity Services with client ID', { 
          clientId: config.googleClientId?.substring(0, 20) + '...' 
        });
        
        window.google.accounts.id.initialize({
          client_id: config.googleClientId, // Load from environment config
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        setGoogleInitialized(true);
        logger.info('Google Identity Services initialized successfully');
      } catch (error) {
        logger.logError(error, { context: 'google_initialization' });
        setGoogleInitialized(false);
      }
    } else {
      logger.error('Google Identity Services not available');
      setGoogleInitialized(false);
    }
  }, []);

  // Handle Google OAuth response
  const handleCredentialResponse = async (response) => {
    try {
      logger.info('Google OAuth response received');
      // Decode the JWT token from Google
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      // Create user object from Google response
      const userInfo = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      };

      logger.info('User info extracted from Google OAuth', { 
        userId: userInfo.id, 
        email: userInfo.email,
        name: userInfo.name 
      });

      // Set user and create a simple access token
      setUser(userInfo);
      setAccessToken(response.credential);
      setLoading(false);

      // Store in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(userInfo));
      localStorage.setItem('accessToken', response.credential);
      
      logger.logAuthEvent('login_success', { userId: userInfo.id, email: userInfo.email });
    } catch (error) {
      logger.logError(error, { context: 'google_oauth_response' });
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
        logger.info('Restored user session from localStorage', { userId: userInfo.id });
      } catch (error) {
        logger.logError(error, { context: 'restore_session' });
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
      }
    } else {
      logger.debug('No saved session found in localStorage');
    }
    setLoading(false);
  }, []);

  // Login with Google (direct OAuth)
  const loginWithGoogle = (e, rememberMe) => {
    if (e) e.preventDefault();
    
    logger.logAuthEvent('login_attempt', { rememberMe });
    
    if (window.google && window.google.accounts && googleInitialized) {
      logger.debug('Prompting Google Sign-In');
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          logger.error('Google Sign-In prompt not displayed', { notification });
        } else if (notification.isSkippedMoment()) {
          logger.error('Google Sign-In prompt skipped', { notification });
        } else if (notification.isDismissedMoment()) {
          logger.info('Google Sign-In prompt dismissed by user');
        }
      });
    } else {
      logger.error('Google Identity Services not loaded or initialized');
      alert('Google Sign-In is not available. Please refresh the page and try again.');
    }
  };

  // Logout
  const logout = () => {
    logger.logAuthEvent('logout_attempt', { userId: user?.id });
    
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    
    // Sign out from Google
    if (window.google && window.google.accounts) {
      window.google.accounts.id.disableAutoSelect();
    }
    
    logger.logAuthEvent('logout_success');
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
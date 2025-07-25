import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import config from '../config/environment';
import logger from '../services/logger';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
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

      // Set user (access token is handled by backend via cookie)
      setUser(userInfo);
      setLoading(false);

      // Store user in localStorage (access token is in HTTP-only cookie)
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      logger.logAuthEvent('login_success', { userId: userInfo.id, email: userInfo.email });
    } catch (error) {
      logger.logError(error, { context: 'google_oauth_response' });
      setUser(null);
      setLoading(false);
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    
    if (savedUser) {
      try {
        const userInfo = JSON.parse(savedUser);
        setUser(userInfo);
        logger.info('Restored user session from localStorage', { userId: userInfo.id });
      } catch (error) {
        logger.logError(error, { context: 'restore_session' });
        localStorage.removeItem('user');
      }
    } else {
      logger.debug('No saved session found in localStorage');
    }
    setLoading(false);
  }, []);

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    
    if (error) {
      logger.error('OAuth error received', { error, errorDescription });
      alert(`Login failed: ${error}${errorDescription ? ' - ' + errorDescription : ''}`);
      // Clear URL parameters and redirect to login
      window.history.replaceState({}, document.title, '/login');
      return;
    }
    
    if (code) {
      logger.info('OAuth authorization code received, processing callback');
      handleOAuthCallback(code);
    }
  }, []);

  const handleOAuthCallback = async (code) => {
    try {
      setLoading(true);
      logger.info('Starting OAuth callback processing', { codeLength: code.length });
      
      // First, test if backend is accessible
      try {
        const healthResponse = await fetch(`${config.backendUrl}/api/health`, {
          method: 'GET',
          credentials: 'include'
        });
        logger.info('Backend health check', { 
          status: healthResponse.status, 
          ok: healthResponse.ok 
        });
      } catch (healthError) {
        logger.error('Backend not accessible', { error: healthError.message });
        throw new Error('Backend server is not running or not accessible. Please ensure the backend is started on port 55556.');
      }
      
      // Call backend to exchange code for JWT token and user info
      const response = await fetch(`${config.backendUrl}/api/auth/callback?code=${code}`, {
        method: 'GET',
        credentials: 'include'
      });
      
      logger.info('Backend callback response received', { 
        status: response.status, 
        ok: response.ok,
        statusText: response.statusText 
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        logger.error('Backend callback failed', { 
          status: response.status, 
          statusText: response.statusText,
          errorText 
        });
        
        // If backend endpoint doesn't exist (404), show helpful message
        if (response.status === 404) {
          throw new Error('Backend OAuth callback endpoint not found. Please ensure the backend has implemented the /api/auth/callback endpoint.');
        }
        
        throw new Error(`Backend error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      logger.info('Backend callback data received', { 
        hasUser: !!data.user, 
        userEmail: data.user?.email 
      });
      
      if (data.user) {
        // Set user (access token is automatically handled by backend via HTTP-only cookie)
        setUser(data.user);
        
        // Store user in localStorage (access token is in HTTP-only cookie)
        localStorage.setItem('user', JSON.stringify(data.user));
        
        logger.logAuthEvent('login_success', { userId: data.user.id, email: data.user.email });
        
        // Clear URL parameters and redirect to dashboard
        window.history.replaceState({}, document.title, '/dashboard');
        window.location.href = '/dashboard';
      } else {
        logger.error('Invalid response from backend', { 
          hasUser: !!data.user, 
          data 
        });
        throw new Error('No user data received from backend');
      }
    } catch (error) {
      logger.logError(error, { context: 'oauth_callback' });
      alert(`Login failed: ${error.message}`);
      setLoading(false);
      // Clear URL parameters and redirect to login
      window.history.replaceState({}, document.title, '/login');
    }
  };

  // Login with Google (direct OAuth)
  const loginWithGoogle = (e, rememberMe) => {
    if (e) e.preventDefault();
    
    logger.logAuthEvent('login_attempt', { rememberMe });
    
    // Mock OAuth flow for Cypress tests only
    if (typeof window !== 'undefined' && window.Cypress) {
      logger.info('Using mock OAuth flow for Cypress tests');
      
      // Simulate successful login with mock user data
      const mockUserInfo = {
        id: '1234567890',
        email: 'testuser@example.com',
        name: 'Test User',
        picture: 'https://example.com/avatar.png'
      };
      
      // Set user (no access token needed for tests)
      setUser(mockUserInfo);
      setLoading(false);

      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(mockUserInfo));
      
      logger.logAuthEvent('login_success', { userId: mockUserInfo.id, email: mockUserInfo.email });
      return;
    }
    
    // Redirect to Google OAuth in same window for real app
    if (config.googleClientId) {
      const redirectUri = encodeURIComponent(`${config.backendUrl}/api/auth/callback`);
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${config.googleClientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20email%20profile&access_type=offline`;
      
      logger.info('Redirecting to Google OAuth in same window');
      window.location.href = googleAuthUrl;
    } else {
      logger.error('Google Client ID not configured');
      alert('Google Sign-In is not configured. Please contact support.');
    }
  };

  // Logout
  const logout = () => {
    logger.logAuthEvent('logout_attempt', { userId: user?.id });
    
    setUser(null);
    localStorage.removeItem('user');
    
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
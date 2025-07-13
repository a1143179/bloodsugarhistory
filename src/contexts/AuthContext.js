import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user info using the access token
  const fetchUser = useCallback(async (token) => {
    try {
      const res = await api.getCurrentUser(token);
      setUser(res);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount, try to refresh token (if refresh token cookie exists)
  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const res = await api.refreshToken();
        if (res && res.accessToken) {
          setAccessToken(res.accessToken);
          fetchUser(res.accessToken);
        } else {
          setUser(null);
          setAccessToken(null);
          setLoading(false);
        }
      } catch {
        setUser(null);
        setAccessToken(null);
        setLoading(false);
      }
    };
    tryRefresh();
  }, [fetchUser]);

  // Login with Google (redirects to backend)
  const loginWithGoogle = (e, rememberMe) => {
    if (e) e.preventDefault();
    const loginUrl = `/api/auth/login?returnUrl=${encodeURIComponent(window.location.pathname)}&rememberMe=${rememberMe ? 'true' : 'false'}`;
    window.location.href = loginUrl;
  };

  // Set access token after login (called after redirect from backend)
  const setAuthFromBackend = (token) => {
    setAccessToken(token);
    fetchUser(token);
  };

  // Logout
  const logout = async () => {
    await api.logout();
    setUser(null);
    setAccessToken(null);
    window.location.href = '/login';
  };

  // Provide context
  return (
    <AuthContext.Provider value={{ user, loading, accessToken, setAccessToken, loginWithGoogle, setAuthFromBackend, logout }}>
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
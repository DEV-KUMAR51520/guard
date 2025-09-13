import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Auth Service URL from environment variables or default to API Gateway
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
const AUTH_SERVICE_ENDPOINT = `${API_URL}/api/auth`;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Set axios default headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  }, [token]);
  
  // Helper function to set auth header
  const setAuthHeader = (token) => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  };

  // Check if user is authenticated on initial load
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${AUTH_SERVICE_ENDPOINT}/verify`, {
          headers: { 'x-auth-token': token }
        });
        setIsAuthenticated(true);
        setUser(res.data);
        
        // Check admin status
        const roleRes = await axios.get(`${AUTH_SERVICE_ENDPOINT}/role`, {
          headers: { 'x-auth-token': token }
        });
        setIsAdmin(roleRes.data.isAdmin);
      } catch (err) {
        localStorage.removeItem('token');
        setToken(null);
        setError('Authentication failed. Please login again.');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  // Register user
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${AUTH_SERVICE_ENDPOINT}/register`, userData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setIsAuthenticated(true);
      setUser(res.data.user);
      setIsAdmin(res.data.user.isAdmin);
      return res.data;
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Registration failed. Please try again.'
      );
      return { error: error };
    } finally {
      setLoading(false);
    }
  };
  
  // Admin status is now determined by the auth service response

  // Login user
  const login = async (phone, password) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${AUTH_SERVICE_ENDPOINT}/login`, { phone, password });

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        setIsAuthenticated(true);
        setIsAdmin(res.data.user.isAdmin);
        setAuthHeader(res.data.token);
      }

      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Login as admin
  const loginAsAdmin = async (phone, password) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${AUTH_SERVICE_ENDPOINT}/admin/login`, { phone, password });

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        setIsAuthenticated(true);
        setIsAdmin(true);
        setAuthHeader(res.data.token);
      }

      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Admin login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      if (token) {
        // Notify auth service about logout
        await axios.post(`${AUTH_SERVICE_ENDPOINT}/logout`, {}, {
          headers: { 'x-auth-token': token }
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      setAuthHeader(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        user,
        loading,
        error,
        isAdmin,
        register,
        login,
        loginAsAdmin,
        logout,
        setAuthHeader
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

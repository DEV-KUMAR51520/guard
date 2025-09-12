import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import apiService from '../services/api';

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
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await apiService.auth.verify();
        setIsAuthenticated(true);
        setUser(res.data.user);
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
      // Hash password client-side before sending
      const hashedPassword = await window.bcrypt.hash(userData.password, 10);
      
      const secureUserData = {
        ...userData,
        password: hashedPassword
      };
      
      const response = await apiService.auth.register(secureUserData);
      
      localStorage.setItem('token', response.token);
      setToken(response.token);
      setIsAuthenticated(true);
      setUser(response.tourist);
      
      // Check if user is admin
      const adminStatus = checkAdminStatus(response.tourist);
      setIsAdmin(adminStatus);
      
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Function to check if user is admin
  const checkAdminStatus = (userData) => {
    // In a real app, this would be determined by the user data from the API
    // For now, we'll consider users with email containing 'admin' as admins
    return userData?.email?.includes('admin') || false;
  };

  // Login user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.auth.login(credentials);
      const { token } = response;
      localStorage.setItem('token', token);
      setToken(token);
      setIsAuthenticated(true);
      setUser(response.tourist);
      
      // Check if user is admin
      const adminStatus = checkAdminStatus(response.tourist);
      setIsAdmin(adminStatus);
      
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Mock login as admin for testing
  const loginAsAdmin = async (credentials) => {
    try {
      // In a real app, this would call a different endpoint or pass a role parameter
      const response = await login(credentials);
      
      // Force admin role for testing
      if (user) {
        const adminUser = { ...user, role: 'admin' };
        setUser(adminUser);
        setIsAdmin(true);
      }
      
      return response;
    } catch (err) {
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        error,
        isAdmin,
        register,
        login,
        loginAsAdmin,
        logout,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
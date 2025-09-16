"use client";

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// This URL should point to your API Gateway
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const AUTH_SERVICE_ENDPOINT = `${API_URL}/api/auth`;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Safely get the token from localStorage on the client-side
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      setLoading(false); // No token, so we're done loading
    }
  }, []);

  // This effect automatically handles setting headers and verifying the token
  useEffect(() => {
    const verifyToken = async (tokenToVerify) => {
      try {
        axios.defaults.headers.common['x-auth-token'] = tokenToVerify;
        const res = await axios.get(`${AUTH_SERVICE_ENDPOINT}/verify`);
        
        setIsAuthenticated(true);
        setUser(res.data.user); // Assumes backend sends { user: {...} }
        setIsAdmin(res.data.user.isAdmin || false);
      } catch (err) {
        localStorage.removeItem('token');
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyToken(token);
    }
  }, [token]);
  
  const login = async (phone, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${AUTH_SERVICE_ENDPOINT}/login`, { phone, password });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token); // This will trigger the useEffect to verify
      }
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };
  
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${AUTH_SERVICE_ENDPOINT}/register`, userData);
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
      }
      return res.data;
    } catch (err) {
        setError(err.response?.data?.message || 'Registration failed');
        throw err;
    } finally {
        setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    delete axios.defaults.headers.common['x-auth-token'];
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, user, loading, error, isAdmin, register, login, logout, setError }}>
      {children}
    </AuthContext.Provider>
  );
};
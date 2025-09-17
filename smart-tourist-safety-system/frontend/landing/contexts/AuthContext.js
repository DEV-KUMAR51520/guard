'use client';
import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const AUTH_SERVICE_ENDPOINT = `${API_URL}/api/auth`;

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('token') : null
  );

  useEffect(() => {
    const verifyToken = async (tokenToVerify) => {
      try {
        axios.defaults.headers.common['x-auth-token'] = tokenToVerify;
        const res = await axios.get(`${AUTH_SERVICE_ENDPOINT}/verify`);

        setIsAuthenticated(true);
        setUser(res.data.user);
      } catch (err) {
        localStorage.removeItem('token');
        setToken(null);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyToken(token);
    } else {
      // ✅ FIX: If there is no token, we are done loading.
      setLoading(false);
    }
  }, [token]);

  const login = async (phone, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${AUTH_SERVICE_ENDPOINT}/login`, { phone, password });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setIsAuthenticated(true);
        setUser(res.data.user);
      }
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
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
        setIsAuthenticated(true);
        setUser(res.data.user);
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
    delete axios.defaults.headers.common['x-auth-token'];
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, user, loading, error, register, login, logout, setError }}>
      {children}
    </AuthContext.Provider>
  );
};
"use client";

import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // 1. Initialize state to a default value (e.g., false)
  const [darkMode, setDarkMode] = useState(false);

  // 2. Use useEffect to safely access localStorage on the client
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    // Only set state if a value was found in localStorage
    if (savedMode !== null) {
      setDarkMode(JSON.parse(savedMode));
    }
  }, []); // Empty array ensures this runs only once on mount

  // 3. Update localStorage whenever darkMode changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
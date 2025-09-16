import React, { useContext, useEffect } from 'react';
import { AuthContext } from './contexts/AuthContext';
import { ThemeContext } from './contexts/ThemeContext';
import AuthView from './components/auth/AuthView';
import Dashboard from './components/dashboard/Dashboard';

function App() {
  const { isAuthenticated } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);

  // Redirect to landing page if needed
  useEffect(() => {
    // Check if user came directly to dashboard without going through landing
    const fromLanding = sessionStorage.getItem('fromLanding');
    if (!fromLanding && !isAuthenticated) {
      // Redirect to landing page
      window.location.href = './landing';
    }
  }, [isAuthenticated]);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : 'bg-gray-100'}`}>
      <div className="container mx-auto px-4 py-8">
        {isAuthenticated ? <Dashboard /> : <AuthView />}
      </div>
    </div>
  );
}

export default App;
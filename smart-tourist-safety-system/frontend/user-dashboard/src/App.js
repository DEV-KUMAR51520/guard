import React, { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';
import { ThemeContext } from './contexts/ThemeContext';
import AuthView from './components/auth/AuthView';
import Dashboard from './components/dashboard/Dashboard';

function App() {
  const { isAuthenticated } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : 'bg-gray-100'}`}>
      <div className="container mx-auto px-4 py-8">
        {isAuthenticated ? <Dashboard /> : <AuthView />}
      </div>
    </div>
  );
}

export default App;
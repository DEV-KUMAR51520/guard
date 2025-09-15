import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import MapComponent from '../dashboard/MapComponent';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [panicAlerts, setPanicAlerts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Fetch all users
  useEffect(() => {
    // Check if user is admin, if not redirect
    if (!isAdmin) {
      navigate('/');
      return;
    }
    
    fetchUsers();
    fetchPanicAlerts();

    // Set up polling for panic alerts every 30 seconds
    const intervalId = setInterval(() => {
      fetchPanicAlerts();
      
      // Also check localStorage for new panic alerts
      const storedAlerts = localStorage.getItem('panicAlerts');
      if (storedAlerts) {
        const alerts = JSON.parse(storedAlerts);
        // Compare with current state and update if needed
        if (JSON.stringify(alerts) !== JSON.stringify(panicAlerts)) {
          setPanicAlerts(alerts);
        }
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [isAdmin, navigate]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // This would be replaced with an actual API call
      // const response = await axios.get('/api/admin/users');
      // setUsers(response.data);
      
      // Mock data for now
      setTimeout(() => {
        setUsers([
          { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1234567890', entry_point: 'Airport', trip_duration: '7', location: { latitude: 28.6139, longitude: 77.2090 } },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+0987654321', entry_point: 'Train Station', trip_duration: '14', location: { latitude: 28.6229, longitude: 77.2100 } },
          { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '+1122334455', entry_point: 'Bus Terminal', trip_duration: '5', location: { latitude: 28.6339, longitude: 77.2110 } },
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to load users');
      setIsLoading(false);
    }
  };

  const fetchPanicAlerts = async () => {
    try {
      // This would be replaced with an actual API call
      // const response = await axios.get('/api/admin/panic-alerts');
      // setPanicAlerts(response.data);
      
      // Mock data for now
      setPanicAlerts([
        { id: 1, user_id: 2, user_name: 'Jane Smith', timestamp: '2023-05-15T14:30:00Z', location: { latitude: 28.6229, longitude: 77.2100 }, status: 'active' },
      ]);
    } catch (err) {
      console.error('Failed to load panic alerts:', err);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleResolvePanic = async (alertId) => {
    setIsLoading(true);
    try {
      // This would be replaced with an actual API call
      // await axios.put(`/api/admin/panic-alerts/${alertId}/resolve`);
      
      // Update local state
      setPanicAlerts(panicAlerts.map(alert => 
        alert.id === alertId ? { ...alert, status: 'resolved' } : alert
      ));
      
      // Update localStorage if it exists
      const storedAlerts = localStorage.getItem('panicAlerts');
      if (storedAlerts) {
        const alerts = JSON.parse(storedAlerts);
        const updatedAlerts = alerts.map(alert => {
          if (alert.id === alertId) {
            return { ...alert, status: 'resolved' };
          }
          return alert;
        });
        localStorage.setItem('panicAlerts', JSON.stringify(updatedAlerts));
      }
      
      showToastNotification('Panic alert marked as resolved', 'success');
      setIsLoading(false);
    } catch (err) {
      showToastNotification('Failed to resolve panic alert', 'error');
      setIsLoading(false);
    }
  };

  const showToastNotification = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  const handleLogout = () => {
    logout();
    showToastNotification('You have been logged out successfully');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <div className="relative">
              <button
                className="flex items-center space-x-2 focus:outline-none"
                aria-label="Admin menu"
              >
                <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <span className="hidden md:block">{user?.name || 'Admin'}</span>
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Users List */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 lg:col-span-1"
          >
            <h2 className="text-lg font-medium mb-4">Registered Users</h2>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center py-4">{error}</div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {users.map(user => (
                  <div 
                    key={user.id} 
                    className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${selectedUser?.id === user.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    onClick={() => handleUserSelect(user)}
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* User Details and Map */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 lg:col-span-2"
          >
            <h2 className="text-lg font-medium mb-4">
              {selectedUser ? `${selectedUser.name}'s Details` : 'Select a User'}
            </h2>
            
            {selectedUser ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</p>
                      <p>{selectedUser.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                      <p>{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                      <p>{selectedUser.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Entry Point</p>
                      <p>{selectedUser.entry_point}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Trip Duration</p>
                      <p>{selectedUser.trip_duration} days</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Current Location</p>
                  <MapComponent location={selectedUser.location} userName={selectedUser.name} />
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-64 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">Select a user to view details</p>
              </div>
            )}
          </motion.div>

          {/* Panic Alerts */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 lg:col-span-3"
          >
            <h2 className="text-lg font-medium mb-4">Panic Alerts</h2>
            
            {panicAlerts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Location</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {panicAlerts.map(alert => {
                      const alertDate = new Date(alert.timestamp);
                      const formattedDate = alertDate.toLocaleString();
                      
                      return (
                        <tr key={alert.id} className={alert.status === 'active' ? 'bg-red-50 dark:bg-red-900/10' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center text-red-600 dark:text-red-300 font-medium">
                                {alert.user_name.charAt(0).toUpperCase()}
                              </div>
                              <div className="ml-3">
                                <p className="font-medium">{alert.user_name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">ID: {alert.user_id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{formattedDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            Lat: {alert.location.latitude.toFixed(6)}, Long: {alert.location.longitude.toFixed(6)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${alert.status === 'active' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}>
                              {alert.status === 'active' ? 'Active' : 'Resolved'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {alert.status === 'active' ? (
                              <button
                                onClick={() => handleResolvePanic(alert.id)}
                                disabled={isLoading}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Mark as Resolved
                              </button>
                            ) : (
                              <span className="text-gray-500 dark:text-gray-400">No action needed</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-2 text-gray-600 dark:text-gray-300">No active panic alerts</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">All tourists are safe at the moment</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </main>

      {/* Toast Notification */}
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed bottom-4 right-4 max-w-md px-4 py-3 rounded-lg shadow-lg ${toastType === 'success' ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200' : toastType === 'error' ? 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200' : 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'}`}
          role="alert"
        >
          <div className="flex items-center">
            {toastType === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : toastType === 'error' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            <span>{toastMessage}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminDashboard;
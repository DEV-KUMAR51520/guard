import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import MapComponent from './MapComponent';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  
  const [safetyScore, setSafetyScore] = useState(85);
  const [location, setLocation] = useState(null);
  const [tripDetails, setTripDetails] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: null,
    entryPoint: user?.entry_point || 'Not specified',
    duration: user?.trip_duration || 'Not specified'
  });
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success'); // success, error, warning

  // Calculate end date based on start date and duration
  useEffect(() => {
    if (tripDetails.startDate && user?.trip_duration) {
      try {
        const durationDays = parseInt(user.trip_duration);
        if (!isNaN(durationDays)) {
          const endDate = new Date(tripDetails.startDate);
          endDate.setDate(endDate.getDate() + durationDays);
          setTripDetails(prev => ({
            ...prev,
            endDate: endDate.toISOString().split('T')[0]
          }));
        }
      } catch (error) {
        console.error('Error calculating end date:', error);
      }
    }
  }, [tripDetails.startDate, user]);

  // Get user's current location and set up watch position
  useEffect(() => {
    let watchId;
    
    if (navigator.geolocation) {
      // Get initial position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          showToastNotification('Unable to access your location. Some features may be limited.', 'warning');
        }
      );
      
      // Set up watch position to update location when user moves
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error watching location:', error);
        },
        { enableHighAccuracy: true }
      );
    } else {
      showToastNotification('Geolocation is not supported by your browser. Some features may be limited.', 'warning');
    }
    
    // Clean up watch position on component unmount
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  // Fetch emergency contacts
  useEffect(() => {
    if (user?.id) {
      fetchEmergencyContacts();
    }
  }, [user]);

  const fetchEmergencyContacts = async () => {
    setIsLoading(true);
    try {
      // This would be replaced with an actual API call
      // const response = await axios.get(`/api/users/${user.id}/emergency-contacts`);
      // setEmergencyContacts(response.data);
      
      // Mock data for now
      setTimeout(() => {
        if (user?.emergency_contact) {
          setEmergencyContacts([{ name: user.emergency_contact, phone: 'Not provided' }]);
        } else {
          setEmergencyContacts([]);
        }
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to load emergency contacts');
      setIsLoading(false);
    }
  };

  const handlePanicButton = async () => {
    setIsLoading(true);
    try {
      // Check if we have location data
      if (!location) {
        showToastNotification('Unable to determine your location. Please enable location services.', 'error');
        setIsLoading(false);
        return;
      }

      // In a real application, this would be an API call to your backend
      // For demo purposes, we'll simulate a successful API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for panic alert
      const panicData = {
        userId: user?.id || 'user123',
        userName: user?.name || 'Tourist',
        location: location,
        timestamp: new Date().toISOString(),
        message: 'User in distress, requesting immediate assistance!',
        status: 'active'
      };
      
      // In a real app, you would send this data to your backend
      console.log('Panic alert sent:', panicData);
      
      // Store panic alert in localStorage for demo purposes
      // This allows the admin dashboard to retrieve it
      const existingAlerts = JSON.parse(localStorage.getItem('panicAlerts') || '[]');
      existingAlerts.push(panicData);
      localStorage.setItem('panicAlerts', JSON.stringify(existingAlerts));
      
      showToastNotification('Emergency alert sent! Help is on the way.', 'success');
      setIsLoading(false);
    } catch (err) {
      console.error('Panic button error:', err);
      showToastNotification('Failed to send emergency alert. Please try again or call emergency services directly.', 'error');
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
          <h1 className="text-xl font-bold">Tourist Safety Dashboard</h1>
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
                aria-label="User menu"
              >
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden md:block">{user?.name || 'User'}</span>
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Safety Score Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
          >
            <h2 className="text-lg font-medium mb-4">Safety Score</h2>
            <div className="flex items-center justify-center">
              <div className="relative h-32 w-32">
                <svg className="h-full w-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                    strokeDasharray="100, 100"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={safetyScore > 70 ? '#10B981' : safetyScore > 40 ? '#F59E0B' : '#EF4444'}
                    strokeWidth="3"
                    strokeDasharray={`${safetyScore}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{safetyScore}</span>
                </div>
              </div>
            </div>
            <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
              Your current safety score is {safetyScore > 70 ? 'excellent' : safetyScore > 40 ? 'moderate' : 'concerning'}.
            </p>
          </motion.div>

          {/* Emergency Button Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
          >
            <h2 className="text-lg font-medium mb-4">Emergency Help</h2>
            <button
              onClick={handlePanicButton}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  PANIC BUTTON
                </span>
              )}
            </button>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Press this button in case of emergency. Your location and details will be sent to local authorities and your emergency contacts.
            </p>
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Emergency Contacts:</h3>
              {isLoading ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading contacts...</p>
              ) : emergencyContacts.length > 0 ? (
                <ul className="text-sm space-y-1">
                  {emergencyContacts.map((contact, index) => (
                    <li key={index} className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {contact.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No emergency contacts added.</p>
              )}
            </div>
          </motion.div>

          {/* Trip Details Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
          >
            <h2 className="text-lg font-medium mb-4">Trip Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Entry Point</p>
                <p>{tripDetails.entryPoint}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</p>
                <p>{tripDetails.startDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">End Date</p>
                <p>{tripDetails.endDate || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</p>
                <p>{tripDetails.duration}</p>
              </div>
              {location && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Location</p>
                  <p className="text-sm">
                    Lat: {location.latitude.toFixed(6)}, Long: {location.longitude.toFixed(6)}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Map Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 md:col-span-2"
          >
            <h2 className="text-lg font-medium mb-4">Your Location</h2>
            <MapComponent location={location} userName={user?.name} />
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              This map shows your current location. It updates automatically when you move.
            </p>
          </motion.div>

          {/* Safety Tips Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 md:col-span-2 lg:col-span-3"
          >
            <h2 className="text-lg font-medium mb-4">Safety Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Stay Connected
                </h3>
                <p className="text-sm">Always keep your phone charged and share your itinerary with someone you trust.</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Local Customs
                </h3>
                <p className="text-sm">Respect local customs and dress codes. Research the area before visiting.</p>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Valuables
                </h3>
                <p className="text-sm">Keep valuables secure and out of sight. Use hotel safes when available.</p>
              </div>
            </div>
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

export default Dashboard;
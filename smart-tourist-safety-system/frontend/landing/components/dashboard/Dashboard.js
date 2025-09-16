"use client";

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import MapComponent from './MapComponent';
import axios from 'axios';

const Dashboard = () => {
  // --- CONTEXT & STATE MANAGEMENT ---
  const { user, token, logout } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  
  // State for dashboard data
  const [safetyScore, setSafetyScore] = useState(85); // This can be fetched from the backend
  const [location, setLocation] = useState(null);
  const [tripDetails, setTripDetails] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: null,
    entryPoint: user?.entry_point || 'Not specified',
    duration: user?.trip_duration || 'Not specified'
  });
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  
  // State for UI feedback
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // --- HELPER FUNCTIONS ---
  const showToastNotification = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  // --- API & DATA FETCHING LOGIC ---

  // Calculate trip end date
  useEffect(() => {
    if (tripDetails.startDate && user?.trip_duration) {
      try {
        const durationDays = parseInt(user.trip_duration, 10);
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

  // Send user's location data to the backend
  const sendLocationToServer = useCallback(async (locationData) => {
    if (!user?.id || !token) return;

    try {
      const response = await axios.post('/api/tracking/location', {
        ...locationData,
        tourist_id: user.id,
        battery_level: 100,
        network_type: 'wifi'
      }, {
        headers: { 'x-auth-token': token }
      });
      
      if (response.data.geofence_violations?.length > 0) {
        response.data.geofence_violations.forEach(violation => {
          showToastNotification(violation.alert_message, 'warning');
        });
      }
    } catch (error) {
      console.error('Failed to send location to server:', error);
    }
  }, [user, token]);

  // Fetch and watch user's geolocation
  useEffect(() => {
    let watchId;
    if (!navigator.geolocation) {
      showToastNotification('Geolocation is not supported by your browser.', 'warning');
      return;
    }

    const handlePosition = (position) => {
      const currentLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        speed: position.coords.speed,
        timestamp: new Date().toISOString()
      };
      setLocation(currentLocation);
      sendLocationToServer(currentLocation);
    };

    const handleError = (error) => {
      console.error('Geolocation error:', error);
      showToastNotification('Could not access your location. Please enable location services.', 'error');
    };

    navigator.geolocation.getCurrentPosition(handlePosition, handleError);
    watchId = navigator.geolocation.watchPosition(handlePosition, handleError, { enableHighAccuracy: true });

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [sendLocationToServer]);

  // Fetch emergency contacts
  const fetchEmergencyContacts = useCallback(async () => {
    setIsLoading(true);
    // This is mock data; replace with a real API call when ready
    setTimeout(() => {
      if (user?.emergency_contact) {
        setEmergencyContacts([{ name: user.emergency_contact, phone: 'Not provided' }]);
      } else {
        setEmergencyContacts([]);
      }
      setIsLoading(false);
    }, 1000);
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      fetchEmergencyContacts();
    }
  }, [user, fetchEmergencyContacts]);

  // --- EVENT HANDLERS ---
  const handlePanicButton = async () => {
    if (!location) {
      showToastNotification('Cannot determine your location. Please enable location services.', 'error');
      return;
    }
    setIsLoading(true);
    console.log('Panic alert sent from:', location);
    // In a real app, this would be a WebSocket emit or an urgent API call
    showToastNotification('Emergency alert sent! Help is on the way.', 'success');
    setIsLoading(false);
  };

  const handleLogout = () => {
    logout();
    showToastNotification('You have been logged out successfully.');
  };

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  // --- RENDER ---
  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Tourist Safety Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle dark mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <button onClick={handleLogout} className="text-sm font-medium">
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
          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Safety Score</h2>
            <div className="flex items-center justify-center">
              <span className="text-5xl font-bold text-green-500">{safetyScore}</span>
            </div>
            <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">Your safety score is excellent.</p>
          </motion.div>

          {/* Emergency Button Card */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Emergency Help</h2>
            <button
              onClick={handlePanicButton}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'PANIC BUTTON'}
            </button>
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Emergency Contacts:</h3>
              {emergencyContacts.length > 0 ? (
                <ul>{emergencyContacts.map((c, i) => <li key={i}>{c.name}</li>)}</ul>
              ) : (
                <p className="text-sm text-gray-500">No contacts added.</p>
              )}
            </div>
          </motion.div>

          {/* Trip Details Card */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Trip Details</h2>
            <div className="space-y-3">
              <p><strong>Entry Point:</strong> {tripDetails.entryPoint}</p>
              <p><strong>Start Date:</strong> {tripDetails.startDate}</p>
              <p><strong>End Date:</strong> {tripDetails.endDate || 'N/A'}</p>
              {location && <p><strong>Location:</strong> {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</p>}
            </div>
          </motion.div>
          
          {/* Map Card */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 md:col-span-2">
            <h2 className="text-lg font-medium mb-4">Your Location</h2>
            <div style={{ height: '400px', width: '100%' }}>
              <MapComponent location={location} userName={user?.name} />
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
          className={`fixed bottom-4 right-4 max-w-md px-4 py-3 rounded-lg shadow-lg ${
            toastType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          <span>{toastMessage}</span>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
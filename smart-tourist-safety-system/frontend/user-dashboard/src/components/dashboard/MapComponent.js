import React from 'react';

const MapComponent = ({ location, userName }) => {
  // This is a placeholder component for a map
  // In a real application, you would integrate with a mapping library like Google Maps, Mapbox, or Leaflet
  
  return (
    <div className="relative w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
      {location ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="font-medium mb-1">{userName || 'You'} are here</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Latitude: {location.latitude.toFixed(6)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Longitude: {location.longitude.toFixed(6)}
            </div>
          </div>
          <div className="absolute w-6 h-6 bg-blue-500 rounded-full animate-pulse mt-16"></div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-600 dark:text-gray-400">Waiting for location...</div>
          </div>
        </div>
      )}
      <div className="absolute bottom-2 right-2 text-xs text-gray-500 dark:text-gray-400">
        Map placeholder - would integrate with real mapping service
      </div>
    </div>
  );
};

export default MapComponent;
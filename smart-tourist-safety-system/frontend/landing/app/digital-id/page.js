"use client";

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext'; // Adjust path if you moved it

export default function DigitalIdPage() {
  const { user } = useContext(AuthContext);

  // Use state to manage user details, providing fallbacks
  const [userInfo, setUserInfo] = useState({
    name: 'Loading...',
    phone: 'Loading...',
    nationality: 'Loading...',
    blockchainId: 'Loading...',
    safetyScore: 0,
  });

  // When the user object from context is available, update the state
  useEffect(() => {
    if (user) {
      setUserInfo({
        name: user.name || 'N/A',
        phone: user.phone || 'N/A',
        nationality: user.nationality || 'N/A',
        blockchainId: user.blockchain_id || 'No Digital ID Found',
        safetyScore: user.safetyScore || 85, // Default score
      });
    }
  }, [user]);

  // Determine safety score color
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4 text-gray-800 dark:text-gray-200">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6">
        {/* Card Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">Digital Tourist ID</h1>
          <p className="text-gray-500 dark:text-gray-400">Your Secure Blockchain-Verified Identity</p>
        </div>

        {/* Digital ID Display */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 mb-6">
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Blockchain ID:</p>
          <p className="text-lg font-mono break-words text-gray-900 dark:text-white">{userInfo.blockchainId}</p>
        </div>

        {/* User Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <span className="font-semibold">Name:</span> {userInfo.name}
          </div>
          <div>
            <span className="font-semibold">Phone:</span> {userInfo.phone}
          </div>
          <div>
            <span className="font-semibold">Nationality:</span> {userInfo.nationality}
          </div>
          <div>
            <span className="font-semibold">Safety Score:</span>
            <span className={`ml-2 font-bold ${getScoreColor(userInfo.safetyScore)}`}>
              {userInfo.safetyScore}
            </span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
            <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                Download ID
            </button>
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-600 font-semibold rounded-lg hover:bg-gray-300">
                Share ID
            </button>
        </div>
      </div>
    </div>
  );
}
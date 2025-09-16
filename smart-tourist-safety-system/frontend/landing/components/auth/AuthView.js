"use client";

import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import { motion, AnimatePresence } from 'framer-motion';

const AuthView = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRegistrationSuccess = () => {
    setShowSuccess(true);
  };

  const handleGotoLogin = () => {
    setShowSuccess(false);
    setActiveTab('login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-12 px-4">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
        {/* Header Section */}
        <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Welcome to TrailShield
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
                Your personal safety dashboard.
            </p>
        </div>

        {!showSuccess ? (
          <>
            {/* Login/Register Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2 font-medium focus:outline-none ${
                  activeTab === 'login'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-2 font-medium focus:outline-none ${
                  activeTab === 'register'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Register
              </button>
            </div>

            {/* Form Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'login' ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <LoginForm />
                  <div className="mt-6 text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account?{' '}
                        <button
                          onClick={() => setActiveTab('register')}
                          className="font-medium text-blue-600 hover:text-blue-500"
                        >
                          Register now
                        </button>
                      </p>
                    </div>
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <RegistrationForm onSuccess={handleRegistrationSuccess} />
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Already have an account?{' '}
                      <button
                        onClick={() => setActiveTab('login')}
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        Sign in
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          // Registration Success Message
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Registration Successful!
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Your account has been created. You can now log in.
            </p>
            <button
              onClick={handleGotoLogin}
              className="mt-4 px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Proceed to Login
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AuthView;
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
    <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
            Welcome to TrailShield
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
            Your personal safety dashboard.
          </p>
        </div>

        {!showSuccess ? (
          <>
            {/* Auth Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2 px-4 text-center font-medium focus:outline-none ${
                  activeTab === 'login'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                aria-selected={activeTab === 'login'}
                role="tab"
                aria-controls="login-panel"
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-2 px-4 text-center font-medium focus:outline-none ${
                  activeTab === 'register'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                aria-selected={activeTab === 'register'}
                role="tab"
                aria-controls="register-panel"
              >
                Register
              </button>
            </div>

            {/* Form Panels */}
            <AnimatePresence mode="wait">
              {activeTab === 'login' ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  id="login-panel"
                  role="tabpanel"
                  aria-labelledby="login-tab"
                >
                  <LoginForm />
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  id="register-panel"
                  role="tabpanel"
                  aria-labelledby="register-tab"
                >
                  <RegistrationForm onSuccess={handleRegistrationSuccess} />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <motion.svg
              className="mx-auto h-12 w-12 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </motion.svg>
            <h3 className="mt-2 text-xl font-medium text-gray-900 dark:text-white">
              Registration Successful!
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Your account has been created successfully. A verification email has been sent to your email address.
            </p>
            <button
              onClick={handleGotoLogin}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
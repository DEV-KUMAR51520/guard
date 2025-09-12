import React, { useState, useContext, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

const RegistrationForm = ({ onSuccess }) => {
  const { register, error, setError } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState(null);
  const fileInputRef = useRef(null);

  // Get CSRF token from meta tag
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

  const initialValues = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    profilePicture: null,
    emergency_contact: '',
    entry_point: '',
    trip_duration: '',
    terms: false,
    csrf_token: csrfToken
  };

  const phoneRegExp = /^\+?[0-9]{10,15}$/;

  const validationSchema = Yup.object({
    name: Yup.string().required('Full name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email address is required'),
    phone: Yup.string()
      .matches(phoneRegExp, 'Please enter a valid phone number')
      .required('Phone number is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      )
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
    emergency_contact: Yup.string(),
    entry_point: Yup.string(),
    trip_duration: Yup.string(),
    terms: Yup.boolean().oneOf([true], 'You must accept the terms and conditions')
  });

  const handleFileChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    setFieldValue('profilePicture', file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setProfilePreview(null);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1;
    
    // Contains number
    if (/[0-9]/.test(password)) strength += 1;
    
    // Contains special character
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
    return strength;
  };

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    // Rate limiting check
    const now = new Date();
    if (lastAttemptTime && attemptCount >= 5) {
      const timeDiff = now - lastAttemptTime;
      if (timeDiff < 60000) { // 1 minute in milliseconds
        setError(`Too many attempts. Please try again in ${Math.ceil((60000 - timeDiff) / 1000)} seconds.`);
        setSubmitting(false);
        return;
      } else {
        // Reset counter after 1 minute
        setAttemptCount(0);
      }
    }

    setAttemptCount(prev => prev + 1);
    setLastAttemptTime(now);
    setError(null);
    
    try {
      // Create FormData object for multipart/form-data (for file upload)
      const formData = new FormData();
      
      // Add all form fields to FormData
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('phone', values.phone);
      formData.append('password', values.password); // Send plain password, server will hash it
      
      // Add optional fields if they exist
      if (values.emergency_contact) formData.append('emergency_contact', values.emergency_contact);
      if (values.entry_point) formData.append('entry_point', values.entry_point);
      if (values.trip_duration) formData.append('trip_duration', values.trip_duration);
      
      // Add profile picture if selected
      if (values.profilePicture) {
        formData.append('profile_picture', values.profilePicture);
      }
      
      // Send the form data to the server
      await register(formData);
      setStatus({ success: true });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Registration error:', err);
      setStatus({ success: false });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, setFieldValue, values, errors, touched }) => (
        <Form className="space-y-4">
          {/* CSRF Protection */}
          <Field type="hidden" name="csrf_token" />
          
          {/* Mandatory Fields */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name <span className="text-red-500">*</span>
            </label>
            <Field
              type="text"
              id="name"
              name="name"
              className={`mt-1 block w-full px-3 py-2 border ${errors.name && touched.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white`}
              placeholder="John Doe"
              aria-required="true"
              aria-describedby="name-error"
            />
            <ErrorMessage
              name="name"
              component="p"
              className="mt-1 text-xs text-red-600 dark:text-red-400"
              id="name-error"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address <span className="text-red-500">*</span>
            </label>
            <Field
              type="email"
              id="email"
              name="email"
              className={`mt-1 block w-full px-3 py-2 border ${errors.email && touched.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white`}
              placeholder="john@example.com"
              aria-required="true"
              aria-describedby="email-error"
            />
            <ErrorMessage
              name="email"
              component="p"
              className="mt-1 text-xs text-red-600 dark:text-red-400"
              id="email-error"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 sm:text-sm">
                +91
              </span>
              <Field
                type="tel"
                id="phone"
                name="phone"
                className={`flex-1 block w-full px-3 py-2 border ${errors.phone && touched.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-none rounded-r-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white`}
                placeholder="9876543210"
                aria-required="true"
                aria-describedby="phone-error"
              />
            </div>
            <ErrorMessage
              name="phone"
              component="p"
              className="mt-1 text-xs text-red-600 dark:text-red-400"
              id="phone-error"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <Field
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className={`mt-1 block w-full px-3 py-2 border ${errors.password && touched.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white`}
                placeholder="••••••••"
                aria-required="true"
                aria-describedby="password-error password-strength"
                onChange={(e) => {
                  const { value } = e.target;
                  checkPasswordStrength(value);
                  setFieldValue('password', value);
                }}
              />
              <button
                type="button"
                className="absolute right-3 top-8 text-gray-500 dark:text-gray-400 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            
            {/* Password Strength Meter */}
            <div id="password-strength" className="mt-1">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div 
                    key={level}
                    className={`h-1 w-1/5 rounded ${passwordStrength >= level ? 
                      passwordStrength <= 2 ? 'bg-red-500' : 
                      passwordStrength <= 4 ? 'bg-yellow-500' : 'bg-green-500'
                      : 'bg-gray-200 dark:bg-gray-700'}`}
                  />
                ))}
              </div>
              <p className={`mt-1 text-xs ${passwordStrength <= 2 ? 'text-red-500' : 
                passwordStrength <= 4 ? 'text-yellow-500' : 'text-green-500'}`}>
                {passwordStrength === 0 && 'Password must be at least 8 characters with letters, numbers and special characters'}
                {passwordStrength === 1 && 'Very weak password'}
                {passwordStrength === 2 && 'Weak password - add more variety'}
                {passwordStrength === 3 && 'Medium strength password'}
                {passwordStrength === 4 && 'Strong password'}
                {passwordStrength === 5 && 'Very strong password!'}
              </p>
            </div>
            
            <ErrorMessage
              name="password"
              component="p"
              className="mt-1 text-xs text-red-600 dark:text-red-400"
              id="password-error"
            />
          </div>

          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <Field
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                className={`mt-1 block w-full px-3 py-2 border ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white`}
                placeholder="••••••••"
                aria-required="true"
                aria-describedby="confirmPassword-error"
              />
              <button
                type="button"
                className="absolute right-3 top-8 text-gray-500 dark:text-gray-400 focus:outline-none"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            <ErrorMessage
              name="confirmPassword"
              component="p"
              className="mt-1 text-xs text-red-600 dark:text-red-400"
              id="confirmPassword-error"
            />
          </div>
          
          {/* Optional Fields */}
          <div>
            <label htmlFor="emergency_contact" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Emergency Contact
            </label>
            <Field
              type="text"
              id="emergency_contact"
              name="emergency_contact"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              placeholder="Contact Name and Phone"
              aria-describedby="emergency_contact-desc"
            />
            <p id="emergency_contact-desc" className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Optional: Provide an emergency contact for safety purposes
            </p>
          </div>

          <div>
            <label htmlFor="entry_point" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Entry Point
            </label>
            <Field
              type="text"
              id="entry_point"
              name="entry_point"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              placeholder="e.g. Guwahati Airport"
              aria-describedby="entry_point-desc"
            />
            <p id="entry_point-desc" className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Optional: Where will you enter the region?
            </p>
          </div>

          <div>
            <label htmlFor="trip_duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Trip Duration
            </label>
            <Field
              type="text"
              id="trip_duration"
              name="trip_duration"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              placeholder="e.g. 7 days"
              aria-describedby="trip_duration-desc"
            />
            <p id="trip_duration-desc" className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Optional: How long will your trip last?
            </p>
          </div>

          <div>
            <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Profile Picture (Optional)
            </label>
            <div className="mt-1 flex items-center space-x-4">
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={(event) => handleFileChange(event, setFieldValue)}
                aria-describedby="profilePicture-desc"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Choose File
              </button>
              {profilePreview ? (
                <div className="relative">
                  <img
                    src={profilePreview}
                    alt="Profile preview"
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setProfilePreview(null);
                      setFieldValue('profilePicture', null);
                      fileInputRef.current.value = '';
                    }}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center focus:outline-none"
                    aria-label="Remove profile picture"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  No file chosen
                </span>
              )}
            </div>
            <p id="profilePicture-desc" className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Optional: Upload a profile picture (JPEG, PNG, max 5MB)
            </p>
          </div>

          <div className="flex items-center">
            <Field
              type="checkbox"
              id="terms"
              name="terms"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              aria-required="true"
              aria-describedby="terms-error"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              I agree to the <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">Terms and Conditions</a> <span className="text-red-500">*</span>
            </label>
          </div>
          <ErrorMessage
            name="terms"
            component="p"
            className="mt-1 text-xs text-red-600 dark:text-red-400"
            id="terms-error"
          />

          {/* Error Summary */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md text-sm text-red-600 dark:text-red-400"
              role="alert"
            >
              <strong>Error:</strong> {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </>
            ) : (
              'Register'
            )}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default RegistrationForm;
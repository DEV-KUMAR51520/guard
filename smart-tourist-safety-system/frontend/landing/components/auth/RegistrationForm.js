"use client";

import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../../contexts/AuthContext';

const RegistrationForm = ({ onSuccess }) => {
  const { register, error, setError } = useContext(AuthContext);

  const initialValues = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    emergency_contact: '',
    entry_point: '',
    trip_duration: '',
    terms: false,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string().matches(/^\+?[0-9]{10,15}$/, 'Valid phone number is required').required('Phone is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Please confirm your password'),
    emergency_contact: Yup.string(),
    entry_point: Yup.string(),
    trip_duration: Yup.string(),
    terms: Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setError(null);
    try {
      const userData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        emergency_contact: values.emergency_contact || `Default Contact: ${values.phone}`,
        entry_point: values.entry_point || 'Not Specified',
        trip_duration: values.trip_duration || '7', // Default to 7 if empty
      };
      
      await register(userData);
      if (onSuccess) onSuccess();

    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ isSubmitting, errors, touched }) => (
        <Form className="space-y-4">
          {/* Mandatory Fields */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium">Full Name <span className="text-red-500">*</span></label>
            <Field type="text" name="name" className={`mt-1 block w-full p-2 border rounded-md ${errors.name && touched.name ? 'border-red-500' : 'border-gray-300'}`} />
            <ErrorMessage name="name" component="p" className="text-xs text-red-500 mt-1" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email <span className="text-red-500">*</span></label>
            <Field type="email" name="email" className={`mt-1 block w-full p-2 border rounded-md ${errors.email && touched.email ? 'border-red-500' : 'border-gray-300'}`} />
            <ErrorMessage name="email" component="p" className="text-xs text-red-500 mt-1" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium">Phone <span className="text-red-500">*</span></label>
            <Field type="tel" name="phone" className={`mt-1 block w-full p-2 border rounded-md ${errors.phone && touched.phone ? 'border-red-500' : 'border-gray-300'}`} />
            <ErrorMessage name="phone" component="p" className="text-xs text-red-500 mt-1" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">Password <span className="text-red-500">*</span></label>
            <Field type="password" name="password" className={`mt-1 block w-full p-2 border rounded-md ${errors.password && touched.password ? 'border-red-500' : 'border-gray-300'}`} />
            <ErrorMessage name="password" component="p" className="text-xs text-red-500 mt-1" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirm Password <span className="text-red-500">*</span></label>
            <Field type="password" name="confirmPassword" className={`mt-1 block w-full p-2 border rounded-md ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-300'}`} />
            <ErrorMessage name="confirmPassword" component="p" className="text-xs text-red-500 mt-1" />
          </div>

          {/* Optional Fields */}
          <div>
            <label htmlFor="emergency_contact" className="block text-sm font-medium">Emergency Contact</label>
            <Field type="text" name="emergency_contact" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label htmlFor="entry_point" className="block text-sm font-medium">Entry Point</label>
            <Field type="text" name="entry_point" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label htmlFor="trip_duration" className="block text-sm font-medium">Trip Duration (days)</label>
            <Field type="text" name="trip_duration" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
          </div>
          
          <div className="flex items-center">
            <Field type="checkbox" name="terms" className="h-4 w-4" />
            <label htmlFor="terms" className="ml-2 block text-sm">I agree to the Terms and Conditions <span className="text-red-500">*</span></label>
          </div>
          <ErrorMessage name="terms" component="p" className="text-xs text-red-500" />

          {error && <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

          <button type="submit" disabled={isSubmitting} className="w-full py-2 px-4 border rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default RegistrationForm;
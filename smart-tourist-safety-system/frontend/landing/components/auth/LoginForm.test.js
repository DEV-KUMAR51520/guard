import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';
import { AuthContext } from '../../contexts/AuthContext';

// Mock the bcryptjs module
jest.mock('bcryptjs', () => ({
  hash: jest.fn(() => Promise.resolve('hashed_password')),
}));

// Mock context values
const mockLogin = jest.fn();
const mockSetError = jest.fn();
const mockContextValue = {
  login: mockLogin,
  error: null,
  setError: mockSetError,
};

// Setup before each test
beforeEach(() => {
  // Reset mocks
  mockLogin.mockReset();
  mockSetError.mockReset();
  
  // Mock document.querySelector for CSRF token
  document.querySelector = jest.fn().mockImplementation(() => ({
    getAttribute: jest.fn().mockReturnValue('mock-csrf-token'),
  }));
});

const renderLoginForm = () => {
  return render(
    <AuthContext.Provider value={mockContextValue}>
      <LoginForm />
    </AuthContext.Provider>
  );
};

describe('LoginForm Component', () => {
  test('renders all form fields correctly', () => {
    renderLoginForm();
    
    // Check for form fields
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    
    // Check for submit button
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test('shows validation errors for empty required fields', async () => {
    renderLoginForm();
    
    // Submit the form without filling any fields
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    // Check for validation error messages
    await waitFor(() => {
      expect(screen.getByText(/Phone number is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    });
  });

  test('validates phone number format', async () => {
    renderLoginForm();
    
    // Enter invalid phone number
    await userEvent.type(screen.getByLabelText(/Phone Number/i), 'invalid');
    fireEvent.blur(screen.getByLabelText(/Phone Number/i));
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid phone number/i)).toBeInTheDocument();
    });
    
    // Enter valid phone number
    await userEvent.clear(screen.getByLabelText(/Phone Number/i));
    await userEvent.type(screen.getByLabelText(/Phone Number/i), '9876543210');
    fireEvent.blur(screen.getByLabelText(/Phone Number/i));
    
    // Check that error is gone
    await waitFor(() => {
      expect(screen.queryByText(/Please enter a valid phone number/i)).not.toBeInTheDocument();
    });
  });

  test('toggles password visibility', async () => {
    renderLoginForm();
    
    // Password field should be masked by default
    expect(screen.getByLabelText(/Password/i)).toHaveAttribute('type', 'password');
    
    // Click the toggle button
    fireEvent.click(screen.getByLabelText(/Show password/i));
    
    // Password field should now be visible
    expect(screen.getByLabelText(/Password/i)).toHaveAttribute('type', 'text');
    
    // Click the toggle button again
    fireEvent.click(screen.getByLabelText(/Hide password/i));
    
    // Password field should be masked again
    expect(screen.getByLabelText(/Password/i)).toHaveAttribute('type', 'password');
  });

  test('submits the form with valid data', async () => {
    renderLoginForm();
    
    // Fill in all required fields
    await userEvent.type(screen.getByLabelText(/Phone Number/i), '9876543210');
    await userEvent.type(screen.getByLabelText(/Password/i), 'Password123');
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    // Wait for form submission
    await waitFor(() => {
      // Check that login function was called with correct arguments
      expect(mockLogin).toHaveBeenCalledWith({
        phone: '9876543210',
        password: 'Password123',
        csrf_token: 'mock-csrf-token'
      });
    });
  });

  test('handles login error', async () => {
    // Set up error in context
    mockContextValue.error = 'Invalid credentials';
    
    renderLoginForm();
    
    // Fill in all required fields
    await userEvent.type(screen.getByLabelText(/Phone Number/i), '9876543210');
    await userEvent.type(screen.getByLabelText(/Password/i), 'Password123');
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    // Check that error is displayed
    expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    
    // Reset error for other tests
    mockContextValue.error = null;
  });

  test('disables submit button during submission', async () => {
    renderLoginForm();
    
    // Fill in all required fields
    await userEvent.type(screen.getByLabelText(/Phone Number/i), '9876543210');
    await userEvent.type(screen.getByLabelText(/Password/i), 'Password123');
    
    // Mock login to be a slow promise
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    
    // Check that button is disabled during submission
    expect(screen.getByRole('button', { name: /Logging in/i })).toBeDisabled();
    
    // Wait for submission to complete
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });
  });
});
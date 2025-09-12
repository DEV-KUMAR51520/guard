import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegistrationForm from './RegistrationForm';
import { AuthContext } from '../../contexts/AuthContext';

// Mock the bcryptjs module
jest.mock('bcryptjs', () => ({
  hash: jest.fn(() => Promise.resolve('hashed_password')),
}));

// Mock context values
const mockRegister = jest.fn();
const mockSetError = jest.fn();
const mockContextValue = {
  register: mockRegister,
  error: null,
  setError: mockSetError,
};

// Mock for FileReader
class MockFileReader {
  readAsDataURL() {
    this.onloadend();
  }
}

// Setup before each test
beforeEach(() => {
  // Reset mocks
  mockRegister.mockReset();
  mockSetError.mockReset();
  
  // Mock document.querySelector for CSRF token
  document.querySelector = jest.fn().mockImplementation(() => ({
    getAttribute: jest.fn().mockReturnValue('mock-csrf-token'),
  }));
  
  // Mock FileReader
  global.FileReader = MockFileReader;
});

const renderRegistrationForm = (onSuccess = jest.fn()) => {
  return render(
    <AuthContext.Provider value={mockContextValue}>
      <RegistrationForm onSuccess={onSuccess} />
    </AuthContext.Provider>
  );
};

describe('RegistrationForm Component', () => {
  test('renders all form fields correctly', () => {
    renderRegistrationForm();
    
    // Check for mandatory fields
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    
    // Check for optional fields
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByText(/Profile Picture/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Emergency Contact/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Entry Point/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Trip Duration/i)).toBeInTheDocument();
    
    // Check for terms checkbox
    expect(screen.getByLabelText(/I agree to the Terms and Conditions/i)).toBeInTheDocument();
    
    // Check for submit button
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
  });

  test('shows validation errors for empty required fields', async () => {
    renderRegistrationForm();
    
    // Submit the form without filling any fields
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));
    
    // Check for validation error messages
    await waitFor(() => {
      expect(screen.getByText(/Full name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Email address is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Phone number is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Please confirm your password/i)).toBeInTheDocument();
      expect(screen.getByText(/You must accept the terms and conditions/i)).toBeInTheDocument();
    });
  });

  test('validates email format', async () => {
    renderRegistrationForm();
    
    // Enter invalid email
    await userEvent.type(screen.getByLabelText(/Email Address/i), 'invalid-email');
    fireEvent.blur(screen.getByLabelText(/Email Address/i));
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
    });
    
    // Enter valid email
    await userEvent.clear(screen.getByLabelText(/Email Address/i));
    await userEvent.type(screen.getByLabelText(/Email Address/i), 'valid@example.com');
    fireEvent.blur(screen.getByLabelText(/Email Address/i));
    
    // Check that error is gone
    await waitFor(() => {
      expect(screen.queryByText(/Invalid email address/i)).not.toBeInTheDocument();
    });
  });

  test('validates password strength', async () => {
    renderRegistrationForm();
    
    // Enter weak password
    await userEvent.type(screen.getByLabelText(/^Password/i), 'weak');
    fireEvent.blur(screen.getByLabelText(/^Password/i));
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
    });
    
    // Enter stronger password but still missing requirements
    await userEvent.clear(screen.getByLabelText(/^Password/i));
    await userEvent.type(screen.getByLabelText(/^Password/i), 'strongpassword');
    fireEvent.blur(screen.getByLabelText(/^Password/i));
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText(/Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character/i)).toBeInTheDocument();
    });
    
    // Enter valid password
    await userEvent.clear(screen.getByLabelText(/^Password/i));
    await userEvent.type(screen.getByLabelText(/^Password/i), 'StrongP@ss123');
    fireEvent.blur(screen.getByLabelText(/^Password/i));
    
    // Check that error is gone
    await waitFor(() => {
      expect(screen.queryByText(/Password must be at least 8 characters/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character/i)).not.toBeInTheDocument();
    });
  });

  test('validates password confirmation match', async () => {
    renderRegistrationForm();
    
    // Enter password
    await userEvent.type(screen.getByLabelText(/^Password/i), 'StrongP@ss123');
    
    // Enter different confirmation password
    await userEvent.type(screen.getByLabelText(/Confirm Password/i), 'DifferentP@ss123');
    fireEvent.blur(screen.getByLabelText(/Confirm Password/i));
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText(/Passwords must match/i)).toBeInTheDocument();
    });
    
    // Enter matching confirmation password
    await userEvent.clear(screen.getByLabelText(/Confirm Password/i));
    await userEvent.type(screen.getByLabelText(/Confirm Password/i), 'StrongP@ss123');
    fireEvent.blur(screen.getByLabelText(/Confirm Password/i));
    
    // Check that error is gone
    await waitFor(() => {
      expect(screen.queryByText(/Passwords must match/i)).not.toBeInTheDocument();
    });
  });

  test('toggles password visibility', async () => {
    renderRegistrationForm();
    
    // Password field should be masked by default
    expect(screen.getByLabelText(/^Password/i)).toHaveAttribute('type', 'password');
    
    // Click the toggle button
    fireEvent.click(screen.getAllByLabelText(/Show password/i)[0]);
    
    // Password field should now be visible
    expect(screen.getByLabelText(/^Password/i)).toHaveAttribute('type', 'text');
    
    // Click the toggle button again
    fireEvent.click(screen.getAllByLabelText(/Hide password/i)[0]);
    
    // Password field should be masked again
    expect(screen.getByLabelText(/^Password/i)).toHaveAttribute('type', 'password');
  });

  test('submits the form with valid data', async () => {
    const onSuccessMock = jest.fn();
    renderRegistrationForm(onSuccessMock);
    
    // Fill in all required fields
    await userEvent.type(screen.getByLabelText(/Full Name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/Email Address/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/Phone Number/i), '9876543210');
    await userEvent.type(screen.getByLabelText(/^Password/i), 'StrongP@ss123');
    await userEvent.type(screen.getByLabelText(/Confirm Password/i), 'StrongP@ss123');
    
    // Check terms checkbox
    fireEvent.click(screen.getByLabelText(/I agree to the Terms and Conditions/i));
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));
    
    // Wait for form submission
    await waitFor(() => {
      // Check that register function was called
      expect(mockRegister).toHaveBeenCalled();
      
      // FormData is complex to test, so we'll just verify it was called
      expect(mockRegister.mock.calls[0][0] instanceof FormData).toBeTruthy();
      
      // Check that onSuccess callback was called
      expect(onSuccessMock).toHaveBeenCalled();
    });
  });

  test('handles rate limiting', async () => {
    renderRegistrationForm();
    
    // Mock Date.now for consistent testing
    const originalDate = global.Date;
    const mockDate = jest.fn(() => ({ toISOString: () => '2023-01-01T00:00:00.000Z' }));
    mockDate.now = jest.fn(() => 1672531200000); // 2023-01-01 00:00:00
    global.Date = mockDate;
    
    // Fill in all required fields
    await userEvent.type(screen.getByLabelText(/Full Name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/Email Address/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/Phone Number/i), '9876543210');
    await userEvent.type(screen.getByLabelText(/^Password/i), 'StrongP@ss123');
    await userEvent.type(screen.getByLabelText(/Confirm Password/i), 'StrongP@ss123');
    fireEvent.click(screen.getByLabelText(/I agree to the Terms and Conditions/i));
    
    // Submit the form 6 times (exceeding the rate limit of 5)
    for (let i = 0; i < 6; i++) {
      fireEvent.click(screen.getByRole('button', { name: /Register/i }));
      await waitFor(() => {});
    }
    
    // Check that rate limiting error is shown
    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalledWith(expect.stringMatching(/Too many attempts/i));
    });
    
    // Restore original Date
    global.Date = originalDate;
  });
});
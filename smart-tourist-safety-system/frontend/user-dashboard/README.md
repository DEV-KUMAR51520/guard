# Tourist Safety Dashboard - User Registration System

A comprehensive and secure user registration system for the Tourist Safety Dashboard application. This system provides a robust registration process with real-time validation, security features, and an intuitive user experience.

## Features

### Registration Form
- **Mandatory Fields**: Full Name, Email Address, Password (with strength meter), Password Confirmation
- **Optional Fields**: Phone Number, Profile Picture, Emergency Contact, Entry Point, Trip Duration
- **Accessibility**: Clear labels, placeholders, and ARIA attributes

### Validation System
- Real-time validation for email format, password complexity, and field completeness
- Immediate visual feedback for invalid inputs
- Contextual error messages and summary error display

### Security Implementation
- Password protection with masked input and toggle visibility
- Client-side hash before transmission
- CSRF token integration
- Rate limiting (5 attempts/minute)

### User Experience
- Loading spinner during API calls
- Disabled submit button during processing
- Success confirmation
- Responsive design with mobile-first approach
- Dark/light mode support

### React Implementation
- Functional components with React hooks
- Context API for shared state
- Formik for form management
- Yup for schema validation
- Framer Motion for animations

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd smart-tourist-safety-system/frontend/user-dashboard
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the development server
   ```
   npm start
   ```

## Testing Authentication

### Registration
1. Navigate to the registration page
2. Fill in the form with the following test data:
   - Name: Test User
   - Email: testuser@example.com
   - Phone: 1234567890
   - Password: Test@123
   - Confirm Password: Test@123
   - Emergency Contact: 9876543210
   - Entry Point: Delhi Airport
   - Trip Duration: 7 days
3. Submit the form

### Login
1. Navigate to the login page
2. Enter the following credentials:
   - Phone: 1234567890
   - Password: Test@123
3. Submit the form

### Troubleshooting

If you encounter authentication issues:

1. Check that the API server is running at http://localhost:5000
2. Verify that the `.env` file has the correct API URL
3. Check browser console for any error messages
4. Clear browser localStorage and try again

2. Start the development server
   ```
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── AuthView.js       # Container for login/registration tabs
│   │   ├── LoginForm.js      # Login form component
│   │   └── RegistrationForm.js # Registration form component
│   └── dashboard/
│       └── Dashboard.js      # Main dashboard after login
├── contexts/
│   ├── AuthContext.js        # Authentication state management
│   └── ThemeContext.js       # Theme (dark/light) state management
├── App.js                    # Main application component
├── index.js                  # Entry point
└── index.css                 # Global styles with Tailwind
```

## Technologies Used

- React.js
- Formik & Yup
- Tailwind CSS
- Framer Motion
- Axios
- bcryptjs (for client-side hashing)

## Accessibility

This application is designed to meet WCAG 2.1 AA compliance standards:
- Proper semantic HTML
- ARIA attributes
- Keyboard navigation support
- Color contrast compliance
- Screen reader compatibility

## Security Considerations

- Passwords are hashed client-side before transmission
- CSRF protection is implemented
- Rate limiting prevents brute force attacks
- Form validation prevents malicious input

## License

This project is licensed under the MIT License - see the LICENSE file for details.
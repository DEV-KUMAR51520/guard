# Testing Flow for Smart Tourist Safety System

## Overview
This document outlines the testing flow for the Smart Tourist Safety System, including user registration, login, dashboard functionality, and admin features.

## Prerequisites
- Node.js and npm installed
- Run `npm install` to install all dependencies
- Start the development server with `npm start` or use the HTTP server

## 1. User Registration Testing

### Test Steps:
1. Navigate to the application's homepage
2. Click on the "Register" tab
3. Fill in the registration form with the following test data:
   - Name: Test User
   - Email: testuser@example.com
   - Phone: 1234567890
   - Password: Test@123 (meets complexity requirements)
   - Confirm Password: Test@123
   - Emergency Contact: 9876543210
   - Entry Point: Delhi Airport
   - Trip Duration: 7 days
   - Check the Terms and Conditions checkbox
4. Click the "Register" button
5. Verify that registration is successful and you're redirected to the login page

### Expected Results:
- Form validation should work correctly (try submitting with missing fields)
- Password strength indicator should update as you type
- Success message should appear after registration
- User data should be stored (check localStorage for demo purposes)

## 2. User Login Testing

### Test Steps:
1. Navigate to the login page
2. Enter the credentials created during registration:
   - Email: testuser@example.com
   - Password: Test@123
3. Click the "Login" button

### Expected Results:
- Login should be successful
- You should be redirected to the user dashboard
- User session should be created (token stored in localStorage)

## 3. User Dashboard Testing

### Test Steps:
1. After successful login, verify the dashboard components:
   - Safety score card
   - Emergency button
   - Trip details
   - Map showing current location
   - Safety tips
2. Test the map functionality:
   - Verify that your current location is displayed on the map
   - Check that the location marker is accurate
   - If possible, move to a different location and verify the map updates
3. Test the emergency button:
   - Click the emergency button
   - Confirm the alert dialog
   - Verify that a success message appears indicating the alert was sent

### Expected Results:
- All dashboard components should be visible and properly styled
- Map should display your current location with a marker
- Emergency button should trigger an alert that's stored for admin viewing
- Dark mode toggle should change the theme

## 4. Admin Login Testing

### Test Steps:
1. Log out from the user account
2. On the login page, click the "Admin" tab
3. Enter admin credentials:
   - Email: admin@example.com
   - Password: Admin@123
4. Click the "Login" button

### Expected Results:
- Admin login should be successful
- You should be redirected to the admin dashboard
- Admin session should be created with elevated privileges

## 5. Admin Dashboard Testing

### Test Steps:
1. After successful admin login, verify the admin dashboard components:
   - List of registered users
   - Panic alerts/messages section
   - Map showing user locations
2. Test user management:
   - Click on a user to view their details
   - Verify that the selected user's location appears on the map
3. Test panic alert management:
   - Verify that the panic alert sent earlier appears in the list
   - Click "Mark as Resolved" on the panic alert
   - Verify that the alert status changes to "Resolved"

### Expected Results:
- Admin dashboard should display all registered users
- Panic alerts should be visible with user information and timestamps
- Map should show all user locations or selected user location
- Resolving panic alerts should update their status

## 6. End-to-End Flow Testing

### Test Steps:
1. Open two browser windows/tabs
2. In the first window, register and login as a regular user
3. In the second window, login as an admin
4. As the user, trigger a panic alert
5. As the admin, verify that the panic alert appears and can be resolved

### Expected Results:
- The entire flow should work seamlessly
- Panic alerts should appear on the admin dashboard shortly after being triggered
- All features should function as expected in both user and admin views

## 7. Security Testing

### Test Steps:
1. Try accessing the admin dashboard with a regular user account
2. Try accessing protected routes directly without authentication
3. Test form validation by attempting to inject malicious input

### Expected Results:
- Regular users should be redirected away from admin routes
- Unauthenticated access attempts should redirect to the login page
- Form validation should prevent malicious input

## Notes for Developers

- This is a demo application with simulated backend functionality
- User data and panic alerts are stored in localStorage for demonstration purposes
- In a production environment, these would be handled by secure API calls to a backend server
- The geolocation functionality requires permission from the browser and works best on devices with GPS
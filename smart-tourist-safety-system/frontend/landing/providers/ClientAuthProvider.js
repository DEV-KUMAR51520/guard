"use client";

import React, { useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthContext } from '../contexts/AuthContext';

export default function ClientAuthProvider({ children }) {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const pathname = usePathname();
  const router = useRouter();

  // 1. While loading, show a loading screen to prevent redirects
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // 2. If finished loading and user is NOT authenticated,
  // and they are trying to access a protected page...
  if (!isAuthenticated && pathname.startsWith('/dashboard')) {
    // Redirect them to the authentication page
    router.push('/auth');
    return null; // Render nothing while redirecting
  }

  // 3. If finished loading and user IS authenticated,
  // and they are on the auth page...
  if (isAuthenticated && pathname.startsWith('/auth')) {
    // Redirect them to their dashboard
    router.push('/dashboard');
    return null; // Render nothing while redirecting
  }

  // 4. If none of the above, render the page
  return children;
}
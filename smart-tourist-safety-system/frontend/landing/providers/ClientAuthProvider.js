"use client";

import React, { useContext, useEffect } from 'react'; // Import useEffect
import { usePathname, useRouter } from 'next/navigation';
import { AuthContext } from '../contexts/AuthContext';

export default function ClientAuthProvider({ children }) {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const pathname = usePathname();
  const router = useRouter();

  // ✅ FIX: The redirection logic is moved inside a useEffect hook
  useEffect(() => {
    // If we are still checking for authentication, don't do anything yet.
    if (loading) {
      return;
    }

    // If the user is NOT authenticated and tries to access a protected dashboard page...
    if (!isAuthenticated && pathname.startsWith('/dashboard')) {
      //...redirect them to the authentication page.
      router.push('/auth');
    }

    // If the user IS authenticated and they land on the auth page...
    if (isAuthenticated && pathname.startsWith('/auth')) {
      //...redirect them to their dashboard.
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, pathname, router]);

  // While loading, show the loading screen.
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // To prevent a flicker of the old page while redirecting, we can return null.
  if ((!isAuthenticated && pathname.startsWith('/dashboard')) || (isAuthenticated && pathname.startsWith('/auth'))) {
    return null;
  }

  // If none of the redirect conditions are met, render the page's content.
  return children;
}
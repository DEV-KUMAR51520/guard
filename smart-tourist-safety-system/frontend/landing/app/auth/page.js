// This line is important to tell Next.js this is a client-side component
"use client";

import React from 'react';
import AuthView from '../../components/auth/AuthView'; // Adjust path if needed

export default function AuthPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <AuthView />
    </div>
  );
}
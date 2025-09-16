import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// --- Step 1: Import the Providers ---
import { ThemeProvider } from "../contexts/ThemeContext";
import { AuthProvider } from "../contexts/AuthContext";
import ClientAuthProvider from "../providers/ClientAuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TrailShield - Smart Tourist Safety & Monitoring",
  description: "A comprehensive digital ecosystem that leverages AI, Blockchain, and IoT technologies to ensure tourist safety in remote and high-risk areas.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/icon.png" type="image/x-icon" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* --- Step 2: Wrap your children with the providers --- */}
        <ThemeProvider>
          <AuthProvider>
            <ClientAuthProvider>
              {children}
            </ClientAuthProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
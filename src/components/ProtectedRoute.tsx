import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { useUser as useCustomUser } from '../lib/hooks/useUser';
import { Button } from './ui/button';
import { SignInButton } from '@clerk/clerk-react';
import { UserOnboarding } from './UserOnboarding';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: 'student' | 'organizer';
  fallback?: React.ReactNode;
}

export const ProtectedRoute = ({ 
  children, 
  requiredUserType,
  fallback 
}: ProtectedRouteProps) => {
  const { isSignedIn, isLoaded } = useUser();
  const { user, loading } = useCustomUser();

  // Show loading state
  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Not signed in
  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900">
        <div className="text-center max-w-md mx-auto p-8">
          <h2 className="text-2xl font-bold text-white mb-4 font-['Merriweather',serif]">
            Sign in required
          </h2>
          <p className="text-gray-300 mb-6 font-['Figtree',sans-serif]">
            You need to sign in to access this page.
          </p>
          <SignInButton mode="modal">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Sign In
            </Button>
          </SignInButton>
        </div>
      </div>
    );
  }

  // Signed in but no profile - show onboarding, pass requiredUserType as defaultUserType
  if (isSignedIn && !user) {
    return <UserOnboarding defaultUserType={requiredUserType} />;
  }

  // User type check
  if (requiredUserType && user?.user_type !== requiredUserType) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900">
        <div className="text-center max-w-md mx-auto p-8">
          <h2 className="text-2xl font-bold text-white mb-4 font-['Merriweather',serif]">
            Access Denied
          </h2>
          <p className="text-gray-300 mb-6 font-['Figtree',sans-serif]">
            This page is only available for {requiredUserType}s.
          </p>
          <Button 
            onClick={() => window.history.back()}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}; 
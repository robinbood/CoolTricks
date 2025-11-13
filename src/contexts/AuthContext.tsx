import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { UserWithSubscription, SignInRequest } from '@/types';
import { buildApiUrl, API_ENDPOINTS } from '@/config/api';

// Define the shape of the authentication context
interface AuthContextType {
  isAuthenticated: boolean;
  user: UserWithSubscription | null;
  loading: boolean;
  error: string | null;
  signIn: (credentials: SignInRequest) => Promise<boolean>;
  signOut: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// Create the AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserWithSubscription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status on initial load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Function to check authentication status
  const checkAuthStatus = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(buildApiUrl(API_ENDPOINTS.GET_USER_INFO), {
        method: 'GET',
        credentials: 'include', // Important for including HTTP-only cookies
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser({
          ...data.user,
          isPremium: data.isPremium
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to sign in
  const signIn = useCallback(async (credentials: SignInRequest): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(buildApiUrl(API_ENDPOINTS.SIGN_IN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include', // Important for including HTTP-only cookies
      });
      
      if (response.ok) {
        // After successful sign in, check auth status to get user info
        await checkAuthStatus();
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Sign in failed');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, [checkAuthStatus]);

  // Function to sign out
  const signOut = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the signout endpoint
      await fetch(buildApiUrl(API_ENDPOINTS.SIGN_OUT), {
        method: 'POST',
        credentials: 'include', // Important for including HTTP-only cookies
      });
      
      // Update state regardless of response
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      // Still update state even if the request fails
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Value object to be provided by the context - memoized to prevent unnecessary re-renders
  const value: AuthContextType = useMemo(() => ({
    isAuthenticated,
    user,
    loading,
    error,
    signIn,
    signOut,
    checkAuthStatus,
  }), [isAuthenticated, user, loading, error, signIn, signOut, checkAuthStatus]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export the context for direct access if needed
export { AuthContext };
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Custom hook for authentication-based navigation
 * Provides utilities to handle navigation based on authentication status
 */
export const useAuthNavigation = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  /**
   * Navigate to a specific route if authenticated, otherwise redirect to sign-in
   */
  const navigateIfAuthenticated = useCallback((path: string, signInPath = '/Signin') => {
    if (loading) return;
    
    if (isAuthenticated) {
      navigate(path);
    } else {
      navigate(signInPath);
    }
  }, [isAuthenticated, loading, navigate]);

  /**
   * Navigate to a specific route if not authenticated, otherwise redirect to home
   */
  const navigateIfNotAuthenticated = useCallback((path: string, homePath = '/home') => {
    if (loading) return;
    
    if (!isAuthenticated) {
      navigate(path);
    } else {
      navigate(homePath);
    }
  }, [isAuthenticated, loading, navigate]);

  /**
   * Redirect to home if authenticated, or to sign-in if not authenticated
   */
  const redirectToAppropriatePage = useCallback(() => {
    if (loading) return;
    
    if (isAuthenticated) {
      navigate('/home');
    } else {
      navigate('/Signin');
    }
  }, [isAuthenticated, loading, navigate]);

  /**
   * Check if the current route requires authentication and handle accordingly
   */
  const checkRouteAccess = useCallback((isProtectedRoute: boolean, isPublicRoute: boolean) => {
    if (loading) return;
    
    if (isProtectedRoute && !isAuthenticated) {
      navigate('/Signin');
    } else if (isPublicRoute && isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, loading, navigate]);

  return {
    navigateIfAuthenticated,
    navigateIfNotAuthenticated,
    redirectToAppropriatePage,
    checkRouteAccess,
    isAuthenticated,
    loading
  };
};

export default useAuthNavigation;
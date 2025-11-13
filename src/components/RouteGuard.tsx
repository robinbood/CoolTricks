import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { ReactNode } from 'react';

interface RouteGuardProps {
  children: ReactNode;
  isPublic?: boolean;
  isProtected?: boolean;
  redirectTo?: string;
  requiredRole?: string;
  fallback?: ReactNode;
}

/**
 * Advanced route guard component with role-based access control
 * 
 * This component:
 * - Handles authentication-based routing
 * - Supports role-based access control (for future implementation)
 * - Provides customizable fallbacks for loading and error states
 * - Uses the optimized AuthContext to reduce unnecessary re-renders
 */
export const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  isPublic = false,
  isProtected = false,
  redirectTo,
  requiredRole,
  fallback
}) => {
  const { isAuthenticated, loading, error, user } = useAuth();

  // Show loading spinner while authentication is being verified
  if (loading) {
    return fallback || <LoadingSpinner message="Verifying access..." />;
  }

  // Handle error state
  if (error) {
    return fallback || (
      <div className="error-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div className="error-message" style={{
          color: '#e74c3c',
          textAlign: 'center',
          padding: '20px',
          border: '1px solid #e74c3c',
          borderRadius: '4px',
          backgroundColor: '#fadbd8'
        }}>
          <h3>Authentication Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Handle public routes - redirect authenticated users
  if (isPublic && isAuthenticated) {
    const redirectPath = redirectTo || '/home';
    return <Navigate to={redirectPath} replace />;
  }

  // Handle protected routes - check authentication
  if (isProtected) {
    if (!isAuthenticated) {
      const redirectPath = redirectTo || '/Signin';
      return <Navigate to={redirectPath} replace />;
    }

    // Check role-based access (for future implementation)
    if (requiredRole && user?.role !== requiredRole) {
      return (
        <div className="access-denied" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#e74c3c', marginBottom: '16px' }}>
            Access Denied
          </h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => window.history.back()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Go Back
          </button>
        </div>
      );
    }
  }

  // Render children if all checks pass
  return <>{children}</>;
};

export default RouteGuard;
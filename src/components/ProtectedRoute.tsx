import React from 'react';
import { RouteGuard } from './RouteGuard';
import type { ReactNode } from 'react';

// Props for the ProtectedRoute component
interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

/**
 * ProtectedRoute component that checks authentication status before rendering its children.
 *
 * This component is now a wrapper around the more advanced RouteGuard component.
 * It maintains backward compatibility while leveraging the new architecture.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole
}) => {
  return (
    <RouteGuard
      isProtected={true}
      requiredRole={requiredRole}
    >
      {children}
    </RouteGuard>
  );
};

export default ProtectedRoute;
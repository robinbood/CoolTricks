import React from 'react';
import { RouteGuard } from './RouteGuard';
import type { ReactNode } from 'react';

// Props for the PublicRoute component
interface PublicRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

/**
 * PublicRoute component that redirects authenticated users to a specified route.
 *
 * This component is now a wrapper around the more advanced RouteGuard component.
 * It maintains backward compatibility while leveraging the new architecture.
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectTo = '/home'
}) => {
  return (
    <RouteGuard
      isPublic={true}
      redirectTo={redirectTo}
    >
      {children}
    </RouteGuard>
  );
};

export default PublicRoute;
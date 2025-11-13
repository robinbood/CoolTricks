import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { RouteGuard } from '@/components/RouteGuard';
import { routeConfig } from '@/config/routes';
import type { Route as RouteType } from '@/types/routes';

/**
 * Component to render a single route based on its type
 */
const SingleRouteRenderer: React.FC<{ route: RouteType }> = ({ route }) => {
  switch (route.type) {
    case 'public':
      return (
        <Route
          key={route.path}
          path={route.path}
          element={
            <RouteGuard
              isPublic={true}
              redirectTo={(route as any).redirectTo}
            >
              {route.element}
            </RouteGuard>
          }
        />
      );
    
    case 'protected':
      return (
        <Route
          key={route.path}
          path={route.path}
          element={
            <RouteGuard
              isProtected={true}
              requiredRole={(route as any).requiredRole}
            >
              {route.element}
            </RouteGuard>
          }
        />
      );
    
    case 'nested':
      const nestedRoute = route as any;
      return (
        <Route
          key={route.path}
          path={route.path}
          element={
            <RouteGuard isProtected={true}>
              {route.element}
            </RouteGuard>
          }
        >
          {nestedRoute.children?.map((childRoute: RouteType) => (
            <SingleRouteRenderer key={childRoute.path} route={childRoute} />
          ))}
        </Route>
      );
    
    default:
      return null;
  }
};

/**
 * Main route renderer component that handles all routing logic
 * 
 * This component:
 * - Renders all routes from the centralized configuration
 * - Wraps routes in error boundaries for better error handling
 * - Provides loading states for lazy-loaded components
 * - Uses the optimized RouteGuard for authentication checks
 */
export const RouteRenderer: React.FC = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
        <Routes>
          {routeConfig.routes.map((route) => (
            <SingleRouteRenderer key={route.path} route={route} />
          ))}
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default RouteRenderer;
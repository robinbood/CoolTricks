import type { ReactNode } from 'react';

// Base route interface
export interface BaseRoute {
  path: string;
  element: ReactNode;
}

// Public route interface
export interface PublicRoute extends BaseRoute {
  type: 'public';
  redirectTo?: string;
}

// Protected route interface
export interface ProtectedRoute extends BaseRoute {
  type: 'protected';
  requiredRole?: string; // For future role-based access control
}

// Nested route interface
export interface NestedRoute extends BaseRoute {
  type: 'nested';
  children: Route[];
  layout?: ReactNode;
}

// Union type for all routes
export type Route = PublicRoute | ProtectedRoute | NestedRoute;

// Route configuration object
export interface RouteConfig {
  routes: Route[];
  fallback?: ReactNode;
}
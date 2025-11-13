import type { RouteConfig, Route } from '@/types/routes';
import React, { lazy } from 'react';

// Lazy load components for better performance
const Main = lazy(() => import('@/Pages/Main'));
const SignIn = lazy(() => import('@/Pages/Signin'));
const SignUp = lazy(() => import('@/Pages/Signup'));
const Navbar = lazy(() => import('@/Pages/Navbar'));
const Home = lazy(() => import('@/Pages/Home'));
const PassReset = lazy(() => import('@/Pages/PassReset'));
const TokenLook = lazy(() => import('@/Pages/TokenLookup'));
const Payment = lazy(() => import('@/Pages/Payment'));
const Completion = lazy(() => import('@/Pages/Completion'));

// Function to create route elements
const createElement = (Component: React.LazyExoticComponent<React.ComponentType<any>>) => {
  return React.createElement(Component);
};

// Centralized route configuration
export const routeConfig: RouteConfig = {
  routes: [
    // Public routes - redirect authenticated users to home
    {
      type: 'public',
      path: '/Signin',
      element: createElement(SignIn),
      redirectTo: '/home'
    },
    {
      type: 'public',
      path: '/Signup',
      element: createElement(SignUp),
      redirectTo: '/home'
    },
    {
      type: 'public',
      path: '/forgot-pass',
      element: createElement(PassReset),
      redirectTo: '/home'
    },
    
    // Landing pages - redirect authenticated users to home
    {
      type: 'public',
      path: '/',
      element: createElement(Main),
      redirectTo: '/home'
    },
    {
      type: 'public',
      path: '/main',
      element: createElement(Main),
      redirectTo: '/home'
    },
    
    // Protected routes - authentication required
    {
      type: 'protected',
      path: '/subscribe',
      element: createElement(Payment)
    },
    {
      type: 'protected',
      path: '/completion',
      element: createElement(Completion)
    },
    {
      type: 'protected',
      path: '/token-lookup',
      element: createElement(TokenLook)
    },
    
    // Nested protected route with layout
    {
      type: 'nested',
      path: '/home',
      element: createElement(Navbar),
      layout: createElement(Navbar),
      children: [
        {
          type: 'protected',
          path: '',
          element: createElement(Home)
        }
      ]
    }
  ]
};

// Helper function to get routes by type
export const getRoutesByType = (type: Route['type']): Route[] => {
  return routeConfig.routes.filter(route => route.type === type);
};

// Helper function to get route by path
export const getRouteByPath = (path: string): Route | undefined => {
  return routeConfig.routes.find(route => route.path === path);
};
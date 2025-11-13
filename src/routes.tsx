import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Pages/Navbar";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import RouteGuard from "./components/RouteGuard";

// Lazy load components
const LazyMain = lazy(() => import("./Pages/Main"));
const LazyHome = lazy(() => import("./Pages/Home"));
const LazySignIn = lazy(() => import("./Pages/Signin"));
const LazySignUp = lazy(() => import("./Pages/Signup"));
const LazyPassReset = lazy(() => import("./Pages/PassReset"));
const LazyCheckoutForm = lazy(() => import("./Pages/CheckoutForm"));
const LazyCompletion = lazy(() => import("./Pages/Completion"));
const LazyTokenLookup = lazy(() => import("./Pages/TokenLookup"));

// Define route paths
const ROUTES = {
  MAIN: '/',
  SIGNIN: '/Signin',
  SIGNUP: '/Signup',
  RESETPASS: '/forgot-pass',
  TOKENLOOKUP: '/token-lookup',
  HOME: '/home',
  PAYMENT: '/subscribe',
  COMPLETION: '/completion',
};

const publicRoutes = [
  { path: ROUTES.MAIN, element: <LazyMain /> },
  { path: ROUTES.SIGNIN, element: <LazySignIn /> },
  { path: ROUTES.SIGNUP, element: <LazySignUp /> },
  { path: ROUTES.RESETPASS, element: <LazyPassReset /> },
  { path: ROUTES.TOKENLOOKUP, element: <LazyTokenLookup /> },
];

const privateRoutes = [
  { path: ROUTES.HOME, element: <LazyHome /> },
  { path: ROUTES.PAYMENT, element: <LazyCheckoutForm /> },
  { path: ROUTES.COMPLETION, element: <LazyCompletion /> },
];

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {publicRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={
                <RouteGuard isPublic={true}>
                  {element}
                </RouteGuard>
              }
            />
          ))}
          {privateRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={
                <RouteGuard isProtected={true}>
                  {element}
                </RouteGuard>
              }
            />
          ))}
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export { ROUTES };
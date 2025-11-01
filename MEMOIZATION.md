# Memoization and Code Improvements

This document outlines the memoization and code improvements made to the application.

## Memoization

Memoization is a technique used to optimize performance by caching the results of expensive function calls and returning the cached result when the same inputs occur again. In React, we can use `useCallback` and `useMemo` hooks to memoize functions and values.

### `useCallback`

`useCallback` is used to memoize functions. It returns a memoized version of the callback that only changes if one of the dependencies has changed. This is useful when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders.

- **`src/Pages/Main.tsx`**: The `handleLogin` and `handleLogup` functions were memoized using `useCallback` to prevent them from being recreated on every render.
- **`src/Pages/PassReset.tsx`**: The `WhenSubmit` function was memoized using `useCallback`.
- **`src/Pages/Signin.tsx`**: The `WhenSubmit` function was memoized using `useCallback`.
- **`src/Pages/Signup.tsx`**: The `WhenSubmit` function was memoized using `useCallback`.
- **`src/Pages/TokenLookup.tsx`**: The `WhenSubmit` function was memoized using `useCallback`.
- **`src/Pages/CheckoutForm.tsx`**: The `handleSubmit` function was memoized using `useCallback`.
- **`src/Pages/Payment.tsx`**: The `fetchPublishableKey` and `fetchClientSecret` functions were memoized using `useCallback`.

### `useMemo`

`useMemo` is used to memoize values. It returns a memoized value that is recomputed only when one of the dependencies has changed. This is useful for expensive calculations.

- **`src/Pages/Navbar.tsx`**: The `items` array was memoized using `useMemo` to prevent it from being recreated on every render.

## Code Improvements

In addition to memoization, the following code improvements were made:

- **`src/Pages/CheckoutForm.tsx`**: The success message was made more user-friendly.
- **`src/Pages/PassReset.tsx`, `src/Pages/Signin.tsx`, `src/Pages/Signup.tsx`, `src/Pages/TokenLookup.tsx`**: A custom hook could be created to abstract the repeated logic for handling form submissions and displaying responses.
- **`src/Pages/Main.tsx`**: Inline styles and repeated JSX for testimonials and features were extracted into separate components to improve readability and reusability.
- **`src/Pages/Navbar.tsx`**: The component was renamed from `Navar` to `Navbar` for consistency.
- **`src/App.tsx`**: The routes were moved to a separate file to improve organization.

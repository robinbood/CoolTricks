// API Configuration
export const API_CONFIG = {
  // Base URL for API calls - will use relative URLs in production
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
  
  // Default timeout for API requests
  TIMEOUT: 10000,
  
  // Headers to include with all requests
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Helper function to build API URLs
export const buildApiUrl = (endpoint: string): string => {
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // If BASE_URL is empty (production), use relative URLs
  // Otherwise, use the full URL
  return API_CONFIG.BASE_URL 
    ? `${API_CONFIG.BASE_URL}/${cleanEndpoint}`
    : `/${cleanEndpoint}`;
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  SIGN_IN: '/Signin',
  SIGN_UP: '/Signup',
  SIGN_OUT: '/Signout',
  GET_USER_INFO: '/get-user-info',
  PASSWORD_RESET: '/forgot-pass',
  
  // User data
  GET_USER_POSTS: '/get-user-posts',
  CREATE_POST: '/create-post',
  
  // Payment
  CREATE_PAYMENT_INTENT: '/create-payment-intent',
  GET_PUBLISHABLE_KEY: '/get-publishable-key',
  
  // Tokens
  TOKEN_LOOKUP: '/token-lookup',
} as const;
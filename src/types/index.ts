// User related types
export interface User {
  id: number;
  email: string;
  name?: string;
  username: string;
  password?: string; // Only used for creation/update, not for responses
}

export interface UserInfo {
  id: number;
  email: string;
  name?: string;
  username: string;
}

export interface UserWithSubscription extends UserInfo {
  isPremium: boolean;
  role?: string; // For future role-based access control
}

// Authentication related types
export interface SignInRequest {
  username: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  name?: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  userId?: number;
}

export interface SessionData {
  userId: number;
  sessionId: string;
}

// Token related types
export interface Token {
  id: number;
  token: number;
  user: number;
}

// Subscription related types
export interface Subscription {
  id: number;
  premium: boolean;
  user: number;
}

// Post related types
export interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePostRequest {
  title: string;
  content: string;
}

export interface PostsResponse {
  posts: Post[];
  pagination: PaginationInfo;
}

// Pagination types
export interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Payment related types
export interface Product {
  name: string;
  price: number; // in cents
}

export interface PaymentIntentRequest {
  productId: string;
  idempotencyKey?: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
}

// API Response types
export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: string;
}

export interface ErrorResponse {
  message: string;
  error?: string;
}

// Request/Response types for middleware
export interface AuthenticatedRequest extends Request {
  userId?: number;
}

// Environment variable types
export interface EnvVariables {
  DATABASE_URL: string;
  STRIPE_SECRET?: string;
  REDIS_URL?: string;
}

// Log levels for structured logging
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

// Log entry structure for structured logging
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  userId?: number;
  requestId?: string;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

// Rate limiting types
export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum number of requests per window
  message?: string; // Custom message when limit is exceeded
  skipSuccessfulRequests?: boolean; // Whether to count successful requests
  skipFailedRequests?: boolean; // Whether to count failed requests
}

export interface RateLimitInfo {
  limit: number;
  current: number;
  remaining: number;
  resetTime: Date;
}

// Security headers configuration
export interface SecurityHeadersConfig {
  contentSecurityPolicy?: {
    directives?: Record<string, string[]>;
  };
  crossOriginEmbedderPolicy?: boolean;
  crossOriginOpenerPolicy?: boolean;
  crossOriginResourcePolicy?: boolean;
  dnsPrefetchControl?: boolean;
  frameOptions?: {
    action?: 'deny' | 'sameorigin' | 'allow-from';
    domain?: string;
  };
  hidePoweredBy?: boolean;
  hsts?: {
    maxAge?: number;
    includeSubDomains?: boolean;
    preload?: boolean;
  };
  ieNoOpen?: boolean;
  noSniff?: boolean;
  originAgentCluster?: boolean;
  permittedCrossDomainPolicies?: boolean;
  referrerPolicy?: {
    policy?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
  };
  xssProtection?: boolean;
}

// Validation error types
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ValidationResult {
  success: boolean;
  data?: any;
  errors?: ValidationError[];
}
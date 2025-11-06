import { RateLimitError } from '@/server/middleware/errorHandler';
import { logger } from '@/server/utils/logger';
import type { RateLimitConfig, RateLimitInfo, AuthenticatedRequest } from '@/types';

/**
 * In-memory store for rate limiting
 * In production, you would want to use Redis or another distributed store
 */
class MemoryStore {
  private store: Map<string, { count: number; resetTime: number }> = new Map();

  get(key: string): { count: number; resetTime: number } | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;

    // Check if the entry has expired
    if (Date.now() > entry.resetTime) {
      this.store.delete(key);
      return undefined;
    }

    return entry;
  }

  set(key: string, value: { count: number; resetTime: number }): void {
    this.store.set(key, value);
  }

  increment(key: string, windowMs: number): { count: number; resetTime: number } {
    const now = Date.now();
    const existing = this.get(key);

    if (existing) {
      existing.count += 1;
      return existing;
    } else {
      const newEntry = {
        count: 1,
        resetTime: now + windowMs,
      };
      this.set(key, newEntry);
      return newEntry;
    }
  }

  // Clean up expired entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }

  // Public method to delete entries (for admin functions)
  delete(key: string): boolean {
    return this.store.delete(key);
  }
}

// Create a global memory store instance
const memoryStore = new MemoryStore();

// Clean up expired entries every 5 minutes
setInterval(() => {
  memoryStore.cleanup();
}, 5 * 60 * 1000);

/**
 * Default rate limit configurations
 */
export const defaultRateLimits = {
  // General API rate limit
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    message: 'Too many requests from this IP, please try again later.',
  },

  // Strict rate limit for authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message: 'Too many authentication attempts, please try again later.',
  },

  // Rate limit for password reset
  passwordReset: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3,
    message: 'Too many password reset attempts, please try again later.',
  },

  // Rate limit for payment endpoints
  payment: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10,
    message: 'Too many payment attempts, please try again later.',
  },

  // Rate limit for content creation
  contentCreation: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5,
    message: 'Too many content creation attempts, please try again later.',
  },
};

/**
 * Extract client IP from request
 */
const getClientIP = (req: Request): string => {
  // Try to get IP from various headers
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  const realIP = req.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  const cfConnectingIP = req.headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // Fallback to a default IP (in a real app, you'd get this from the server)
  return 'unknown';
};

/**
 * Extract user identifier for rate limiting
 */
const getUserIdentifier = (req: AuthenticatedRequest): string => {
  // If user is authenticated, use user ID
  if (req.userId) {
    return `user:${req.userId}`;
  }

  // Otherwise, use IP address
  const ip = getClientIP(req);
  return `ip:${ip}`;
};

/**
 * Calculate rate limit headers
 */
const calculateRateLimitHeaders = (
  config: RateLimitConfig,
  current: number,
  resetTime: number
): Record<string, string> => {
  const remaining = Math.max(0, config.maxRequests - current);
  const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);

  return {
    'X-RateLimit-Limit': config.maxRequests.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': new Date(resetTime).toISOString(),
    ...(remaining === 0 && { 'Retry-After': retryAfter.toString() }),
  };
};

/**
 * Rate limiting middleware factory
 */
export const createRateLimiter = (config: RateLimitConfig) => {
  return async (req: AuthenticatedRequest): Promise<{ success: boolean; headers?: Record<string, string> }> => {
    const identifier = getUserIdentifier(req);
    const key = `rate_limit:${identifier}:${req.method}:${new URL(req.url).pathname}`;

    // Increment the counter
    const { count, resetTime } = memoryStore.increment(key, config.windowMs);

    // Calculate rate limit info
    const rateLimitInfo: RateLimitInfo = {
      limit: config.maxRequests,
      current: count,
      remaining: Math.max(0, config.maxRequests - count),
      resetTime: new Date(resetTime),
    };

    // Log rate limit info
    logger.debug('Rate limit check', {
      identifier,
      method: req.method,
      url: req.url,
      ...rateLimitInfo,
    });

    // Check if limit exceeded
    if (count > config.maxRequests) {
      const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
      
      logger.warn('Rate limit exceeded', {
        identifier,
        method: req.method,
        url: req.url,
        count,
        limit: config.maxRequests,
        retryAfter,
      });

      throw new RateLimitError(config.message || 'Rate limit exceeded', retryAfter);
    }

    // Return success with rate limit headers
    const headers = calculateRateLimitHeaders(config, count, resetTime);
    return { success: true, headers };
  };
};

/**
 * Pre-configured rate limiters
 */
export const rateLimiters = {
  general: createRateLimiter(defaultRateLimits.general),
  auth: createRateLimiter(defaultRateLimits.auth),
  passwordReset: createRateLimiter(defaultRateLimits.passwordReset),
  payment: createRateLimiter(defaultRateLimits.payment),
  contentCreation: createRateLimiter(defaultRateLimits.contentCreation),
};

/**
 * Rate limiting middleware wrapper
 * This wraps a request handler with rate limiting
 */
export const withRateLimit = (
  rateLimiter: ReturnType<typeof createRateLimiter>,
  handler: (req: AuthenticatedRequest) => Promise<Response>
) => {
  return async (req: AuthenticatedRequest): Promise<Response> => {
    try {
      // Check rate limit
      const rateLimitResult = await rateLimiter(req);
      
      // Execute the handler
      const response = await handler(req);
      
      // Add rate limit headers to the response
      if (rateLimitResult.headers) {
        Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
      }
      
      return response;
    } catch (error) {
      // If it's a rate limit error, add headers
      if (error instanceof RateLimitError) {
        const retryAfter = error.retryAfter || 60;
        const headers = {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': '0',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(Date.now() + retryAfter * 1000).toISOString(),
        };
        
        // Re-throw the error to be handled by the error handler
        throw error;
      }
      
      // Re-throw other errors
      throw error;
    }
  };
};

/**
 * Custom rate limiter for specific needs
 */
export const customRateLimiter = (
  keyGenerator: (req: AuthenticatedRequest) => string,
  config: RateLimitConfig
) => {
  return async (req: AuthenticatedRequest): Promise<{ success: boolean; headers?: Record<string, string> }> => {
    const key = keyGenerator(req);

    // Increment the counter
    const { count, resetTime } = memoryStore.increment(key, config.windowMs);

    // Check if limit exceeded
    if (count > config.maxRequests) {
      const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
      throw new RateLimitError(config.message || 'Rate limit exceeded', retryAfter);
    }

    // Return success with rate limit headers
    const headers = calculateRateLimitHeaders(config, count, resetTime);
    return { success: true, headers };
  };
};

/**
 * Rate limiting for specific routes based on HTTP method
 */
export const methodBasedRateLimiter = (
  configs: Partial<Record<string, RateLimitConfig>>,
  defaultConfig: RateLimitConfig = defaultRateLimits.general
) => {
  return async (req: AuthenticatedRequest): Promise<{ success: boolean; headers?: Record<string, string> }> => {
    const config = configs[req.method] || defaultConfig;
    const rateLimiter = createRateLimiter(config);
    return rateLimiter(req);
  };
};

/**
 * Adaptive rate limiting based on user status
 */
export const adaptiveRateLimiter = (
  authenticatedConfig: RateLimitConfig,
  anonymousConfig: RateLimitConfig = defaultRateLimits.general
) => {
  return async (req: AuthenticatedRequest): Promise<{ success: boolean; headers?: Record<string, string> }> => {
    const config = req.userId ? authenticatedConfig : anonymousConfig;
    const rateLimiter = createRateLimiter(config);
    return rateLimiter(req);
  };
};

/**
 * Get current rate limit status for a user/IP
 */
export const getRateLimitStatus = (
  req: AuthenticatedRequest,
  config: RateLimitConfig
): RateLimitInfo | null => {
  const identifier = getUserIdentifier(req);
  const key = `rate_limit:${identifier}:${req.method}:${new URL(req.url).pathname}`;
  const entry = memoryStore.get(key);

  if (!entry) {
    return null;
  }

  return {
    limit: config.maxRequests,
    current: entry.count,
    remaining: Math.max(0, config.maxRequests - entry.count),
    resetTime: new Date(entry.resetTime),
  };
};

/**
 * Reset rate limit for a user/IP (admin function)
 */
export const resetRateLimit = (req: AuthenticatedRequest): void => {
  const identifier = getUserIdentifier(req);
  const key = `rate_limit:${identifier}:${req.method}:${new URL(req.url).pathname}`;
  memoryStore.delete(key);
  
  logger.info('Rate limit reset', {
    identifier,
    method: req.method,
    url: req.url,
  });
};
import { logger } from '@/server/utils/logger';
import type { SecurityHeadersConfig, AuthenticatedRequest } from '@/types';

/**
 * Default security headers configuration
 */
export const defaultSecurityConfig: SecurityHeadersConfig = {
  contentSecurityPolicy: {
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", 'https://js.stripe.com'],
      'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      'font-src': ["'self'", 'https://fonts.gstatic.com'],
      'img-src': ["'self'", 'data:', 'https:'],
      'connect-src': ["'self'", 'https://api.stripe.com'],
      'frame-src': ["'self'", 'https://js.stripe.com'],
      'object-src': ["'none'"],
      'media-src': ["'self'"],
      'manifest-src': ["'self'"],
      'worker-src': ["'self'"],
      'child-src': ["'self'"],
      'form-action': ["'self'"],
      'frame-ancestors': ["'none'"],
      'base-uri': ["'self'"],
      'upgrade-insecure-requests': [],
    },
  },
  crossOriginEmbedderPolicy: false, // Disabled for compatibility with Stripe
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: true,
  dnsPrefetchControl: true,
  frameOptions: {
    action: 'deny',
  },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: false,
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin',
  },
  xssProtection: true,
};

/**
 * Generate Content Security Policy header value
 */
const generateCSPHeader = (config: SecurityHeadersConfig['contentSecurityPolicy']): string => {
  if (!config || !config.directives) {
    return '';
  }

  const directives = Object.entries(config.directives)
    .map(([directive, values]) => {
      const value = values.join(' ');
      return value ? `${directive} ${value}` : directive;
    })
    .join('; ');

  return directives;
};

/**
 * Generate Strict-Transport-Security header value
 */
const generateHSTSHeader = (config: SecurityHeadersConfig['hsts']): string => {
  if (!config) {
    return '';
  }

  const parts = [`max-age=${config.maxAge || 31536000}`];
  
  if (config.includeSubDomains) {
    parts.push('includeSubDomains');
  }
  
  if (config.preload) {
    parts.push('preload');
  }

  return parts.join('; ');
};

/**
 * Generate X-Frame-Options header value
 */
const generateFrameOptionsHeader = (config: SecurityHeadersConfig['frameOptions']): string => {
  if (!config) {
    return '';
  }

  const { action, domain } = config;
  
  switch (action) {
    case 'deny':
      return 'DENY';
    case 'sameorigin':
      return 'SAMEORIGIN';
    case 'allow-from':
      return domain ? `ALLOW-FROM ${domain}` : 'SAMEORIGIN';
    default:
      return 'DENY';
  }
};

/**
 * Generate Referrer-Policy header value
 */
const generateReferrerPolicyHeader = (config: SecurityHeadersConfig['referrerPolicy']): string => {
  if (!config || !config.policy) {
    return 'strict-origin-when-cross-origin';
  }

  return config.policy;
};

/**
 * Apply security headers to a response
 */
export const applySecurityHeaders = (
  response: Response,
  config: SecurityHeadersConfig = defaultSecurityConfig
): Response => {
  const headers = new Headers(response.headers);

  // Content Security Policy
  if (config.contentSecurityPolicy) {
    const cspValue = generateCSPHeader(config.contentSecurityPolicy);
    if (cspValue) {
      headers.set('Content-Security-Policy', cspValue);
    }
  }

  // Cross Origin Embedder Policy
  if (config.crossOriginEmbedderPolicy) {
    headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
  }

  // Cross Origin Opener Policy
  if (config.crossOriginOpenerPolicy) {
    headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  }

  // Cross Origin Resource Policy
  if (config.crossOriginResourcePolicy) {
    headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  }

  // DNS Prefetch Control
  if (config.dnsPrefetchControl) {
    headers.set('X-DNS-Prefetch-Control', 'off');
  }

  // Frame Options
  if (config.frameOptions) {
    const frameOptionsValue = generateFrameOptionsHeader(config.frameOptions);
    if (frameOptionsValue) {
      headers.set('X-Frame-Options', frameOptionsValue);
    }
  }

  // Hide Powered By
  if (config.hidePoweredBy) {
    headers.delete('X-Powered-By');
  }

  // HTTP Strict Transport Security (HSTS)
  if (config.hsts) {
    const hstsValue = generateHSTSHeader(config.hsts);
    if (hstsValue) {
      headers.set('Strict-Transport-Security', hstsValue);
    }
  }

  // IE No Open
  if (config.ieNoOpen) {
    headers.set('X-Download-Options', 'noopen');
  }

  // No Sniff
  if (config.noSniff) {
    headers.set('X-Content-Type-Options', 'nosniff');
  }

  // Origin Agent Cluster
  if (config.originAgentCluster) {
    headers.set('Origin-Agent-Cluster', '?1');
  }

  // Permitted Cross Domain Policies
  if (config.permittedCrossDomainPolicies) {
    headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  }

  // Referrer Policy
  if (config.referrerPolicy) {
    const referrerPolicyValue = generateReferrerPolicyHeader(config.referrerPolicy);
    headers.set('Referrer-Policy', referrerPolicyValue);
  }

  // XSS Protection
  if (config.xssProtection) {
    headers.set('X-XSS-Protection', '1; mode=block');
  }

  // Additional security headers
  headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  headers.set('X-Content-Type-Options', 'nosniff');

  // Create new response with updated headers
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

/**
 * Security middleware factory
 */
export const createSecurityMiddleware = (config: SecurityHeadersConfig = defaultSecurityConfig) => {
  return (handler: (req: AuthenticatedRequest) => Promise<Response>) => {
    return async (req: AuthenticatedRequest): Promise<Response> => {
      try {
        // Execute the handler
        const response = await handler(req);
        
        // Apply security headers
        return applySecurityHeaders(response, config);
      } catch (error) {
        // Log security-related errors
        logger.warn('Security middleware error', {
          error: error instanceof Error ? error.message : 'Unknown error',
          url: req.url,
          method: req.method,
        });
        
        // Re-throw error to be handled by the error handler
        throw error;
      }
    };
  };
};

/**
 * Pre-configured security middleware instances
 */
export const securityMiddleware = createSecurityMiddleware(defaultSecurityConfig);

/**
 * Development security configuration (less strict for development)
 */
export const developmentSecurityConfig: SecurityHeadersConfig = {
  ...defaultSecurityConfig,
  contentSecurityPolicy: {
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://js.stripe.com'],
      'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      'font-src': ["'self'", 'https://fonts.gstatic.com'],
      'img-src': ["'self'", 'data:', 'https:'],
      'connect-src': ["'self'", 'https://api.stripe.com', 'ws:', 'wss:'],
      'frame-src': ["'self'", 'https://js.stripe.com'],
      'object-src': ["'none'"],
      'media-src': ["'self'"],
      'manifest-src': ["'self'"],
      'worker-src': ["'self'", 'blob:'],
      'child-src': ["'self'"],
      'form-action': ["'self'"],
      'frame-ancestors': ["'none'"],
      'base-uri': ["'self'"],
    },
  },
  hsts: {
    maxAge: 3600, // 1 hour for development
    includeSubDomains: false,
    preload: false,
  },
};

/**
 * Production security configuration (more strict for production)
 */
export const productionSecurityConfig: SecurityHeadersConfig = {
  ...defaultSecurityConfig,
  contentSecurityPolicy: {
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'", 'https://js.stripe.com'],
      'style-src': ["'self'", 'https://fonts.googleapis.com'],
      'font-src': ["'self'", 'https://fonts.gstatic.com'],
      'img-src': ["'self'", 'data:', 'https:'],
      'connect-src': ["'self'", 'https://api.stripe.com'],
      'frame-src': ["'self'", 'https://js.stripe.com'],
      'object-src': ["'none'"],
      'media-src': ["'self'"],
      'manifest-src': ["'self'"],
      'worker-src': ["'self'"],
      'child-src': ["'self'"],
      'form-action': ["'self'"],
      'frame-ancestors': ["'none'"],
      'base-uri': ["'self'"],
      'upgrade-insecure-requests': [],
    },
  },
};

/**
 * Environment-based security middleware
 */
export const getSecurityMiddleware = () => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  switch (nodeEnv) {
    case 'production':
      return createSecurityMiddleware(productionSecurityConfig);
    case 'development':
      return createSecurityMiddleware(developmentSecurityConfig);
    default:
      return securityMiddleware;
  }
};

/**
 * CORS configuration helper
 */
export const configureCORS = (
  allowedOrigins: string[] = ['http://localhost:3000'],
  allowedMethods: string[] = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: string[] = ['Content-Type', 'Authorization'],
  credentials: boolean = true
) => {
  return (req: AuthenticatedRequest): Response => {
    const origin = req.headers.get('origin');
    const isAllowedOrigin = allowedOrigins.includes('*') || (origin && allowedOrigins.includes(origin));

    const headers = new Headers();
    
    if (isAllowedOrigin) {
      // Fix TypeScript error by ensuring origin is not undefined
      const originValue = origin || allowedOrigins[0] || '*';
      headers.set('Access-Control-Allow-Origin', originValue);
    }
    
    headers.set('Access-Control-Allow-Methods', allowedMethods.join(', '));
    headers.set('Access-Control-Allow-Headers', allowedHeaders.join(', '));
    
    if (credentials) {
      headers.set('Access-Control-Allow-Credentials', 'true');
    }

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers });
    }

    return new Response(null, { status: 200, headers });
  };
};

/**
 * Security headers validation middleware
 */
export const validateSecurityHeaders = (req: AuthenticatedRequest): void => {
  // Log suspicious requests
  const userAgent = req.headers.get('user-agent') || '';
  const suspiciousPatterns = [
    /sqlmap/i,
    /nmap/i,
    /nikto/i,
    /dirb/i,
    /gobuster/i,
  ];

  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(userAgent));
  
  if (isSuspicious) {
    logger.warn('Suspicious user agent detected', {
      userAgent,
      ip: req.headers.get('x-forwarded-for') || 'unknown',
      url: req.url,
      method: req.method,
    });
  }

  // Check for common attack patterns in URL
  const url = req.url;
  const attackPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /union\s+select/i,
    /drop\s+table/i,
  ];

  const isAttack = attackPatterns.some(pattern => pattern.test(url));
  
  if (isAttack) {
    logger.warn('Potential attack detected in URL', {
      url,
      ip: req.headers.get('x-forwarded-for') || 'unknown',
      method: req.method,
    });
  }
};

/**
 * Wrapper function to apply security middleware to a handler
 */
export const withSecurity = (
  handler: (req: AuthenticatedRequest) => Promise<Response>,
  config?: SecurityHeadersConfig
) => {
  const middleware = config ? createSecurityMiddleware(config) : getSecurityMiddleware();
  return middleware(handler);
};
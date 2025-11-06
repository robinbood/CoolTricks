import { logger } from '@/server/utils/logger';
import type { ErrorResponse, AuthenticatedRequest } from '@/types';

/**
 * Custom error classes for different types of application errors
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public code?: string;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

export class ValidationError extends AppError {
  public details: Record<string, string>;

  constructor(message: string, details: Record<string, string> = {}) {
    super(message, 400, true, 'VALIDATION_ERROR');
    this.details = details;
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, true, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, true, 'AUTHORIZATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, true, 'NOT_FOUND_ERROR');
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, true, 'CONFLICT_ERROR');
  }
}

export class RateLimitError extends AppError {
  public retryAfter?: number;

  constructor(message: string = 'Rate limit exceeded', retryAfter?: number) {
    super(message, 429, true, 'RATE_LIMIT_ERROR');
    this.retryAfter = retryAfter;
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500, true, 'DATABASE_ERROR');
  }
}

export class ExternalServiceError extends AppError {
  public service: string;

  constructor(service: string, message: string = 'External service error') {
    super(message, 502, true, 'EXTERNAL_SERVICE_ERROR');
    this.service = service;
  }
}

/**
 * Error handling middleware for Express/Bun-style request handlers
 * 
 * This middleware catches all errors and formats them into a consistent response format.
 * It also logs errors for debugging and monitoring purposes.
 */
export const errorHandler = (
  error: Error,
  req: AuthenticatedRequest,
  context?: { userId?: number; requestId?: string; [key: string]: any }
): Response => {
  // Set logger context if provided
  if (context) {
    if (context.userId) logger.setUserId(context.userId);
    if (context.requestId) logger.setRequestId(context.requestId);
    logger.setContext(context);
  }

  // Default error response
  let statusCode = 500;
  let message = 'Internal Server Error';
  let code = 'INTERNAL_SERVER_ERROR';
  let details: Record<string, any> = {};

  // Handle known application errors
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    code = error.code || 'APP_ERROR';

    if (error instanceof ValidationError) {
      details = error.details;
    }

    if (error instanceof RateLimitError && error.retryAfter) {
      details.retryAfter = error.retryAfter;
    }

    // Log operational errors with info level
    logger.error(`Application Error: ${message}`, error, {
      type: error.constructor.name,
      statusCode,
      code,
      details,
      url: req.url,
      method: req.method,
    });
  } else {
    // Handle unexpected errors
    logger.error(`Unexpected Error: ${error.message}`, error, {
      type: 'UnexpectedError',
      url: req.url,
      method: req.method,
    });

    // In production, don't expose error details for unexpected errors
    if (process.env.NODE_ENV === 'production') {
      message = 'Internal Server Error';
    } else {
      message = error.message;
      details.stack = error.stack;
    }
  }

  // Clear logger context
  logger.clear();

  // Create error response
  const errorResponse: ErrorResponse = {
    message,
    ...(Object.keys(details).length > 0 && { details }),
    ...(process.env.NODE_ENV !== 'production' && { error: error.message }),
  };

  // Return formatted error response
  return new Response(JSON.stringify(errorResponse), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...(error instanceof RateLimitError && error.retryAfter && {
        'Retry-After': error.retryAfter.toString(),
      }),
    },
  });
};

/**
 * Async error wrapper for route handlers
 * 
 * This wrapper catches errors in async route handlers and passes them to the error handler middleware.
 * Usage: wrapAsync(async (req, res) => { ... })
 */
export const wrapAsync = (
  fn: (req: Request, ...args: any[]) => Promise<Response>
) => {
  return (req: Request, ...args: any[]): Promise<Response> => {
    return Promise.resolve(fn(req, ...args)).catch((error) => {
      // For now, we'll handle the error directly since we don't have Express-style middleware
      // In a full Express app, this would call next(error)
      return errorHandler(error, req as AuthenticatedRequest);
    });
  };
};

/**
 * 404 handler for unmatched routes
 */
export const notFoundHandler = (req: Request): Response => {
  const error = new NotFoundError(`Route ${req.method} ${req.url} not found`);
  return errorHandler(error, req as AuthenticatedRequest);
};

/**
 * Process unhandled promise rejections
 */
export const setupUnhandledRejectionHandler = (): void => {
  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    logger.error('Unhandled Promise Rejection', new Error(String(reason)), {
      promise: promise.toString(),
      reason: String(reason),
    });
  });

  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception', error, {
      type: 'UncaughtException',
    });
    
    // Exit the process after logging
    process.exit(1);
  });
};

/**
 * Create a standardized error response for manual error handling
 */
export const createErrorResponse = (
  message: string,
  statusCode: number = 500,
  code?: string,
  details?: Record<string, any>
): Response => {
  const errorResponse: ErrorResponse = {
    message,
    ...(code && { code }),
    ...(details && { details }),
  };

  return new Response(JSON.stringify(errorResponse), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Helper function to check if an error is operational
 */
export const isOperationalError = (error: Error): boolean => {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
};

/**
 * Helper function to determine if an error should be retried
 */
export const isRetryableError = (error: Error): boolean => {
  if (error instanceof DatabaseError || error instanceof ExternalServiceError) {
    return true;
  }
  return false;
};
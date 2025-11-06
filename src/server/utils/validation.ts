import { z } from 'zod';
import { ValidationError } from '@/server/middleware/errorHandler';
import type { ValidationResult, ValidationError as ValidationErrorType } from '@/types';

/**
 * Common validation schemas
 */
export const commonSchemas = {
  // Email validation
  email: z
    .string()
    .email('Invalid email format')
    .max(255, 'Email must be less than 255 characters'),

  // Password validation
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(128, 'Password must be less than 128 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),

  // Username validation
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(50, 'Username must be less than 50 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, underscores, and hyphens'
    ),

  // Name validation
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters')
    .optional(),

  // ID validation
  id: z
    .number()
    .int('ID must be an integer')
    .positive('ID must be a positive number'),

  // Pagination validation
  page: z
    .number()
    .int('Page must be an integer')
    .min(1, 'Page must be at least 1')
    .default(1),

  limit: z
    .number()
    .int('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(10),

  // UUID validation
  uuid: z
    .string()
    .uuid('Invalid UUID format'),

  // URL validation
  url: z
    .string()
    .url('Invalid URL format'),

  // Date validation
  date: z
    .string()
    .datetime('Invalid datetime format'),

  // Boolean validation
  boolean: z
    .boolean()
    .default(false),

  // String validation
  string: z
    .string()
    .min(1, 'String cannot be empty'),

  // Optional string validation
  optionalString: z
    .string()
    .optional(),
};

/**
 * Authentication related schemas
 */
export const authSchemas = {
  // Sign up schema
  signUp: z.object({
    email: commonSchemas.email,
    name: commonSchemas.name,
    username: commonSchemas.username,
    password: commonSchemas.password,
  }),

  // Sign in schema
  signIn: z.object({
    username: commonSchemas.username,
    password: z.string().min(1, 'Password is required'),
  }),

  // Password reset schema
  passwordReset: z.object({
    email: commonSchemas.email,
  }),

  // Password update schema
  passwordUpdate: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: commonSchemas.password,
  }),

  // Token verification schema
  tokenVerify: z.object({
    token: z.number().int('Token must be an integer'),
  }),
};

/**
 * User related schemas
 */
export const userSchemas = {
  // User update schema
  update: z.object({
    email: commonSchemas.email.optional(),
    name: commonSchemas.name,
    username: commonSchemas.username.optional(),
  }),

  // User ID schema
  userId: z.object({
    userId: commonSchemas.id,
  }),
};

/**
 * Post related schemas
 */
export const postSchemas = {
  // Create post schema
  create: z.object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(255, 'Title must be less than 255 characters'),
    content: z
      .string()
      .min(1, 'Content is required')
      .max(10000, 'Content must be less than 10,000 characters'),
  }),

  // Update post schema
  update: z.object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(255, 'Title must be less than 255 characters')
      .optional(),
    content: z
      .string()
      .min(1, 'Content is required')
      .max(10000, 'Content must be less than 10,000 characters')
      .optional(),
  }),

  // Post ID schema
  postId: z.object({
    postId: commonSchemas.id,
  }),

  // Pagination schema for posts
  pagination: z.object({
    page: commonSchemas.page,
    limit: commonSchemas.limit,
  }),
};

/**
 * Payment related schemas
 */
export const paymentSchemas = {
  // Create payment intent schema
  createIntent: z.object({
    productId: z.string().min(1, 'Product ID is required'),
    idempotencyKey: commonSchemas.uuid.optional(),
  }),

  // Product ID schema
  productId: z.object({
    productId: z.string().min(1, 'Product ID is required'),
  }),
};

/**
 * Query parameter schemas
 */
export const querySchemas = {
  // Pagination query
  pagination: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),

  // Search query
  search: z.object({
    q: z.string().min(1, 'Search query is required'),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),

  // Date range query
  dateRange: z.object({
    startDate: commonSchemas.date.optional(),
    endDate: commonSchemas.date.optional(),
  }),
};

/**
 * Validation utility functions
 */
export class ValidationUtils {
  /**
   * Validate data against a Zod schema
   */
  static validate<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult {
    try {
      const result = schema.parse(data);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: ValidationErrorType[] = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));
        return {
          success: false,
          errors,
        };
      }
      return {
        success: false,
        errors: [{
          field: 'unknown',
          message: 'Unknown validation error',
          code: 'UNKNOWN_ERROR',
        }],
      };
    }
  }

  /**
   * Validate and throw ValidationError if invalid
   */
  static validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
    const result = this.validate(schema, data);
    if (!result.success) {
      const details: Record<string, string> = {};
      result.errors?.forEach((error) => {
        details[error.field] = error.message;
      });
      throw new ValidationError('Validation failed', details);
    }
    return result.data as T;
  }

  /**
   * Validate request body
   */
  static validateBody<T>(schema: z.ZodSchema<T>, req: Request): Promise<T> {
    return req.json().then((data) => this.validateOrThrow(schema, data));
  }

  /**
   * Validate query parameters
   */
  static validateQuery<T>(schema: z.ZodSchema<T>, url: string): T {
    const urlObj = new URL(url);
    const queryParams: Record<string, string> = {};
    
    urlObj.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });
    
    return this.validateOrThrow(schema, queryParams);
  }

  /**
   * Validate path parameters
   */
  static validateParams<T>(schema: z.ZodSchema<T>, params: Record<string, string>): T {
    return this.validateOrThrow(schema, params);
  }

  /**
   * Sanitize string input
   */
  static sanitizeString(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score += 1;
    else feedback.push('Password should be at least 8 characters long');

    if (password.length >= 12) score += 1;
    else feedback.push('Password should be at least 12 characters long for better security');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Password should contain lowercase letters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Password should contain uppercase letters');

    if (/\d/.test(password)) score += 1;
    else feedback.push('Password should contain numbers');

    if (/[^a-zA-Z\d]/.test(password)) score += 1;
    else feedback.push('Password should contain special characters');

    return {
      isValid: score >= 4,
      score,
      feedback,
    };
  }
}

/**
 * Middleware-style validation functions
 */
export const validate = {
  /**
   * Validate request body
   */
  body: <T>(schema: z.ZodSchema<T>) => {
    return async (req: Request): Promise<T> => {
      return ValidationUtils.validateBody(schema, req);
    };
  },

  /**
   * Validate query parameters
   */
  query: <T>(schema: z.ZodSchema<T>) => {
    return (url: string): T => {
      return ValidationUtils.validateQuery(schema, url);
    };
  },

  /**
   * Validate path parameters
   */
  params: <T>(schema: z.ZodSchema<T>) => {
    return (params: Record<string, string>): T => {
      return ValidationUtils.validateParams(schema, params);
    };
  },
};

/**
 * Export all schemas for easy access
 */
export const schemas = {
  common: commonSchemas,
  auth: authSchemas,
  user: userSchemas,
  post: postSchemas,
  payment: paymentSchemas,
  query: querySchemas,
};
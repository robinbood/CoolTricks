import { LogLevel } from '@/types';
import type { LogEntry } from '@/types';

/**
 * Structured Logger Utility
 * 
 * Provides structured logging with different log levels, context information,
 * and consistent formatting for better debugging and monitoring.
 */
class Logger {
  private context: Record<string, any> = {};
  private requestId?: string;
  private userId?: number;

  /**
   * Set default context for all log entries
   */
  setContext(context: Record<string, any>): void {
    this.context = { ...this.context, ...context };
  }

  /**
   * Set request ID for tracing requests through the system
   */
  setRequestId(requestId: string): void {
    this.requestId = requestId;
  }

  /**
   * Set user ID for user-specific logging
   */
  setUserId(userId: number): void {
    this.userId = userId;
  }

  /**
   * Clear all context, request ID, and user ID
   */
  clear(): void {
    this.context = {};
    this.requestId = undefined;
    this.userId = undefined;
  }

  /**
   * Create a log entry with timestamp and structured data
   */
  private createLogEntry(level: LogLevel, message: string, error?: Error, additionalContext?: Record<string, any>): LogEntry {
    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: { ...this.context, ...additionalContext },
    };

    if (this.requestId) {
      logEntry.requestId = this.requestId;
    }

    if (this.userId) {
      logEntry.userId = this.userId;
    }

    if (error) {
      logEntry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    return logEntry;
  }

  /**
   * Write log entry to console with appropriate formatting
   */
  private writeLog(logEntry: LogEntry): void {
    const { level, message, timestamp, context, requestId, userId, error } = logEntry;
    
    // Build the log message
    let logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    // Add request and user context if available
    if (requestId || userId) {
      const contextParts = [];
      if (requestId) contextParts.push(`req=${requestId}`);
      if (userId) contextParts.push(`user=${userId}`);
      logMessage += ` (${contextParts.join(', ')})`;
    }

    // Add context if available
    if (context && Object.keys(context).length > 0) {
      logMessage += ` Context: ${JSON.stringify(context)}`;
    }

    // Add error details if available
    if (error) {
      logMessage += ` Error: ${error.name}: ${error.message}`;
      if (error.stack) {
        logMessage += `\nStack: ${error.stack}`;
      }
    }

    // Write to appropriate console method based on log level
    switch (level) {
      case LogLevel.ERROR:
        console.error(logMessage);
        break;
      case LogLevel.WARN:
        console.warn(logMessage);
        break;
      case LogLevel.INFO:
        console.info(logMessage);
        break;
      case LogLevel.DEBUG:
        console.debug(logMessage);
        break;
      default:
        console.log(logMessage);
    }
  }

  /**
   * Log an error message
   */
  error(message: string, error?: Error, context?: Record<string, any>): void {
    const logEntry = this.createLogEntry(LogLevel.ERROR, message, error, context);
    this.writeLog(logEntry);
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: Record<string, any>): void {
    const logEntry = this.createLogEntry(LogLevel.WARN, message, undefined, context);
    this.writeLog(logEntry);
  }

  /**
   * Log an info message
   */
  info(message: string, context?: Record<string, any>): void {
    const logEntry = this.createLogEntry(LogLevel.INFO, message, undefined, context);
    this.writeLog(logEntry);
  }

  /**
   * Log a debug message
   */
  debug(message: string, context?: Record<string, any>): void {
    const logEntry = this.createLogEntry(LogLevel.DEBUG, message, undefined, context);
    this.writeLog(logEntry);
  }

  /**
   * Log HTTP request information
   */
  logRequest(method: string, url: string, statusCode: number, responseTime?: number, context?: Record<string, any>): void {
    const message = `${method} ${url} - ${statusCode}`;
    const requestContext = {
      method,
      url,
      statusCode,
      responseTime,
      ...context,
    };
    
    if (statusCode >= 400) {
      this.error(message, undefined, requestContext);
    } else {
      this.info(message, requestContext);
    }
  }

  /**
   * Log database operations
   */
  logDatabase(operation: string, table: string, duration?: number, context?: Record<string, any>): void {
    const message = `DB ${operation} on ${table}`;
    const dbContext = {
      operation,
      table,
      duration,
      ...context,
    };
    
    this.debug(message, dbContext);
  }

  /**
   * Log authentication events
   */
  logAuth(event: string, userId?: number, success?: boolean, context?: Record<string, any>): void {
    const message = `Auth ${event}${success !== undefined ? (success ? ' succeeded' : ' failed') : ''}`;
    const authContext = {
      event,
      userId,
      success,
      ...context,
    };
    
    if (success === false) {
      this.warn(message, authContext);
    } else {
      this.info(message, authContext);
    }
  }

  /**
   * Log security events
   */
  logSecurity(event: string, severity: 'low' | 'medium' | 'high' = 'medium', context?: Record<string, any>): void {
    const message = `Security: ${event}`;
    const securityContext = {
      event,
      severity,
      ...context,
    };
    
    if (severity === 'high') {
      this.error(message, undefined, securityContext);
    } else if (severity === 'medium') {
      this.warn(message, securityContext);
    } else {
      this.info(message, securityContext);
    }
  }

  /**
   * Create a child logger with inherited context
   */
  child(additionalContext: Record<string, any>): Logger {
    const childLogger = new Logger();
    childLogger.setContext({ ...this.context, ...additionalContext });
    childLogger.setRequestId(this.requestId || '');
    if (this.userId) {
      childLogger.setUserId(this.userId);
    }
    return childLogger;
  }
}

// Create and export a default logger instance
export const logger = new Logger();

// Export the Logger class for creating custom instances
export { Logger };

// Export convenience functions for quick logging
export const logError = (message: string, error?: Error, context?: Record<string, any>) => 
  logger.error(message, error, context);

export const logWarn = (message: string, context?: Record<string, any>) => 
  logger.warn(message, context);

export const logInfo = (message: string, context?: Record<string, any>) => 
  logger.info(message, context);

export const logDebug = (message: string, context?: Record<string, any>) => 
  logger.debug(message, context);
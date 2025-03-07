// /apps/web/app/(ai)/lib/error-handling/api-error-handler.ts

import { NextRequest, NextResponse } from "next/server";
import { logger } from "./logger";
import { withLogtail } from '@logtail/next';
import { v4 as uuidv4 } from 'uuid';

// Standard error codes
export type ErrorCode =
  | "rate_limit_exceeded"
  | "moderation_flagged"
  | "validation_error"
  | "unauthorized"
  | "not_found"
  | "bad_request"
  | "internal_error"
  | string;

// Error severity levels
export type ErrorSeverity = "error" | "warning" | "info";

// Interface for structured API errors
export interface ApiError {
  code: ErrorCode;
  message: string;
  severity: ErrorSeverity;
  details?: Record<string, any>;
  requestId: string;
}

/**
 * Creates a wrapped API handler with Logtail integration and request ID tracking
 */
export function createApiHandler(handler: (req: NextRequest) => Promise<Response>) {
  return withLogtail(async (req: NextRequest) => {
    // Generate a unique request ID
    const requestId = uuidv4();
    
    try {
      // Log the start of request processing
      logger.info('API request started', {
        path: req.nextUrl.pathname,
        method: req.method,
        requestId
      });
      
      // Set requestId in request headers so handler functions can access it
      const reqWithId = new NextRequest(req.url, {
        headers: new Headers(req.headers),
        method: req.method,
        body: req.body,
        cache: req.cache,
        credentials: req.credentials,
        integrity: req.integrity,
        keepalive: req.keepalive,
        mode: req.mode,
        redirect: req.redirect,
        referrer: req.referrer,
        referrerPolicy: req.referrerPolicy,
        signal: req.signal,
      });
      reqWithId.headers.set('X-Request-ID', requestId);
      
      // Call the handler with the modified request
      const response = await handler(reqWithId);
      
      // Add request ID to response headers
      if (response instanceof NextResponse) {
        response.headers.set('X-Request-ID', requestId);
      }
      
      // Log successful completion
      logger.info('API request completed', {
        path: req.nextUrl.pathname,
        method: req.method,
        requestId,
        status: response.status
      });
      
      return response;
    } catch (error) {
      // Handle the error with request ID
      return handleApiError(error, {
        path: req.nextUrl.pathname,
        method: req.method,
        requestId
      });
    }
  });
}

/**
 * Handle API errors and return a structured response
 */
export function handleApiError(
  error: unknown,
  context: { path?: string; method?: string; requestId: string }
): NextResponse {
  // Default error
  let apiError: ApiError = {
    code: "internal_error",
    message: "An unexpected error occurred",
    severity: "error",
    details: {},
    requestId: context.requestId
  };

  // Extract error information
  if (error instanceof Error) {
    try {
      // Try to parse as a structured error
      const parsedError = JSON.parse(error.message) as Partial<ApiError>;
      if (parsedError.code && parsedError.message) {
        apiError = {
          ...parsedError,
          requestId: context.requestId,
          severity: parsedError.severity || "error",
          details: parsedError.details || {}
        } as ApiError;
      } else {
        apiError.message = error.message;
        apiError.details = { stack: error.stack };
      }
    } catch {
      apiError.message = error.message;
      apiError.details = { stack: error.stack };
    }
  } else if (typeof error === "string") {
    apiError.message = error;
  } else if (error && typeof error === "object") {
    const errorObj = error as Record<string, any>;
    apiError.message = errorObj.message || apiError.message;
    apiError.code = errorObj.code || apiError.code;
    apiError.details = { ...apiError.details, ...errorObj };
  }

  // Log the error
  logger.error(`API Error: ${apiError.code}`, {
    ...context,
    errorMessage: apiError.message,
    errorDetails: apiError.details
  });

  // Map severity to HTTP status code
  const statusCode = (() => {
    switch (apiError.code) {
      case "rate_limit_exceeded": return 429;
      case "unauthorized": return 401;
      case "not_found": return 404;
      case "validation_error":
      case "bad_request": return 400;
      default: return apiError.severity === "error" ? 500 : 400;
    }
  })();

  // Create response with request ID header
  const response = NextResponse.json(apiError, { status: statusCode });
  response.headers.set('X-Request-ID', context.requestId);
  
  return response;
}

/**
 * Create a typed API error
 */
export function createApiError(
  code: ErrorCode,
  message: string,
  severity: ErrorSeverity = "error",
  details?: Record<string, any>
): Error {
  const error: Omit<ApiError, 'requestId'> = {
    code,
    message,
    severity,
    details
  };
  
  return new Error(JSON.stringify(error));
}
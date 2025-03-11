/**
 * Error handling utilities
 *
 * This file centralizes error handling logic for consistent behavior throughout the app.
 */
import { useState, useCallback } from "react";

export interface AppError {
  message: string;
  originalError?: any;
  code?: string;
  context?: Record<string, any>;
}

/**
 * Custom hook for error handling
 *
 * @returns Error state and utility functions
 */
export function useErrorHandling() {
  const [error, setError] = useState<AppError | null>(null);

  /**
   * Log and set an error for UI display
   *
   * @param message - User-friendly error message
   * @param originalError - Original error object
   * @param context - Additional context for debugging
   */
  const handleError = useCallback(
    (message: string, originalError?: any, context?: Record<string, any>) => {
      const errorObj: AppError = {
        message,
        originalError,
        context,
      };

      console.error("Application error:", errorObj);

      setError(errorObj);

      return errorObj;
    },
    []
  );

  /**
   * Clear the current error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError,
    hasError: !!error,
  };
}

/**
 * Format an error for display in UI
 *
 * @param error - Error object
 * @returns Formatted string
 */
export function formatErrorForDisplay(error: AppError): string {
  return JSON.stringify(
    {
      message: error.message,
      originalError: error.originalError,
      context: error.context,
    },
    null,
    2
  );
}

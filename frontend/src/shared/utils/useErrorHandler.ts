"use client";

import { useState, useCallback } from "react";

interface ErrorResponse {
  errorCode?: string;
  message?: string;
  path?: string;
  timestamp?: string;
}

interface ValidationErrorResponse extends ErrorResponse {
  errors?: Array<{
    field: string;
    message: string;
    rejectedValue?: unknown;
  }>;
}

export const useErrorHandler = () => {
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((err: unknown) => {
    let errorMessage = "Произошла ошибка";

    if (err instanceof Error) {
      errorMessage = err.message;
    } else if (typeof err === "object" && err !== null) {
      const errorObj = err as ErrorResponse | ValidationErrorResponse;

      if (errorObj.message) {
        errorMessage = errorObj.message;
      } else if (
        "errors" in errorObj &&
        Array.isArray(errorObj.errors) &&
        errorObj.errors.length > 0
      ) {
        const validationErrors = errorObj.errors
          .map((e) => `${e.field}: ${e.message}`)
          .join(", ");
        errorMessage = `Ошибки валидации: ${validationErrors}`;
      } else if (errorObj.errorCode) {
        errorMessage = `Ошибка: ${errorObj.errorCode}`;
      }
    } else if (typeof err === "string") {
      errorMessage = err;
    }

    console.error("Error:", err);
    setError(errorMessage);

    setTimeout(() => {
      setError(null);
    }, 5000);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError,
  };
};

export default useErrorHandler;

"use client";

import { useState, useCallback } from "react";
import { parseError, logError, getUserFriendlyMessage, type ParsedError } from "./error-handler";

export const useErrorHandler = () => {
  const [error, setError] = useState<string | null>(null);
  const [parsedError, setParsedError] = useState<ParsedError | null>(null);

  const handleError = useCallback((error: unknown, context?: string, statusCode?: number) => {
    const parsed = parseError(error, statusCode);
    logError(parsed, context);
    setParsedError(parsed);
    setError(getUserFriendlyMessage(parsed));
    
    setTimeout(() => {
      setError(null);
      setParsedError(null);
    }, 5000);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setParsedError(null);
  }, []);

  return {
    error,
    parsedError,
    handleError,
    clearError,
  };
};

export default useErrorHandler;


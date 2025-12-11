import type { ErrorResponse, ValidationErrorResponse } from "@/shared/types/api";

export enum ErrorType {
  NETWORK_ERROR = "NETWORK_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  SERVER_ERROR = "SERVER_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export interface ParsedError {
  type: ErrorType;
  message: string;
  originalError: unknown;
  statusCode?: number;
  validationErrors?: Array<{
    field: string;
    message: string;
    rejectedValue?: unknown;
  }>;
}

export const parseError = (error: unknown, statusCode?: number): ParsedError => {
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return {
      type: ErrorType.NETWORK_ERROR,
      message: "Нет соединения с сервером. Проверьте подключение к интернету.",
      originalError: error,
      statusCode,
    };
  }

  if (statusCode === 401) {
    return {
      type: ErrorType.UNAUTHORIZED,
      message: "Необходима авторизация. Пожалуйста, войдите в систему.",
      originalError: error,
      statusCode: 401,
    };
  }

  if (statusCode === 403) {
    return {
      type: ErrorType.FORBIDDEN,
      message: "У вас нет доступа к этому ресурсу.",
      originalError: error,
      statusCode: 403,
    };
  }

  if (statusCode === 404) {
    return {
      type: ErrorType.NOT_FOUND,
      message: "Запрашиваемый ресурс не найден.",
      originalError: error,
      statusCode: 404,
    };
  }

  if (statusCode === 409) {
    return {
      type: ErrorType.CONFLICT,
      message: "Конфликт данных. Возможно, ресурс уже существует или был изменен.",
      originalError: error,
      statusCode: 409,
    };
  }

  if (statusCode && statusCode >= 500) {
    return {
      type: ErrorType.SERVER_ERROR,
      message: "Ошибка сервера. Пожалуйста, попробуйте позже.",
      originalError: error,
      statusCode,
    };
  }

  if (statusCode === 400 || (error && typeof error === "object" && "errors" in error)) {
    const validationError = error as ValidationErrorResponse;
    if (validationError.errors && validationError.errors.length > 0) {
      return {
        type: ErrorType.VALIDATION_ERROR,
        message: validationError.message || "Ошибка валидации данных",
        originalError: error,
        statusCode: 400,
        validationErrors: validationError.errors.map((err) => ({
          field: err.field,
          message: err.message,
          rejectedValue: err.rejectedValue,
        })),
      };
    }
  }

  if (error && typeof error === "object") {
    const errorResponse = error as ErrorResponse;
    if (errorResponse.message) {
      return {
        type: ErrorType.UNKNOWN_ERROR,
        message: errorResponse.message,
        originalError: error,
        statusCode,
      };
    }
  }

  if (error instanceof Error) {
    return {
      type: ErrorType.UNKNOWN_ERROR,
      message: error.message || "Произошла неизвестная ошибка",
      originalError: error,
      statusCode,
    };
  }

  return {
    type: ErrorType.UNKNOWN_ERROR,
    message: "Произошла неизвестная ошибка",
    originalError: error,
    statusCode,
  };
};

export const logError = (parsedError: ParsedError, context?: string): void => {
  const logData = {
    type: parsedError.type,
    message: parsedError.message,
    statusCode: parsedError.statusCode,
    validationErrors: parsedError.validationErrors,
    context,
    timestamp: new Date().toISOString(),
    originalError: parsedError.originalError,
  };

  if (process.env.NODE_ENV === "development") {
    console.error("Error logged:", logData);
  }
};

export const getUserFriendlyMessage = (parsedError: ParsedError): string => {
  if (parsedError.validationErrors && parsedError.validationErrors.length > 0) {
    const messages = parsedError.validationErrors.map((err) => {
      const fieldName = err.field
        .split(/(?=[A-Z])/)
        .join(" ")
        .toLowerCase();
      return `${fieldName}: ${err.message}`;
    });
    return messages.join("\n");
  }

  return parsedError.message;
};

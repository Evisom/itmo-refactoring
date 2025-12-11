package com.example.shared.exception;

public class ValidationException extends BaseException {
  public ValidationException(String message) {
    super(message, "VALIDATION_ERROR");
  }

  public ValidationException(String message, Throwable cause) {
    super(message, "VALIDATION_ERROR", cause);
  }
}


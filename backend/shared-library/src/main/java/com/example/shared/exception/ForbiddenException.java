package com.example.shared.exception;

public class ForbiddenException extends BaseException {
  public ForbiddenException(String message) {
    super(message, "FORBIDDEN");
  }

  public ForbiddenException(String message, Throwable cause) {
    super(message, "FORBIDDEN", cause);
  }
}

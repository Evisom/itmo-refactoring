package com.example.shared.exception;

public class UnauthorizedException extends BaseException {
  public UnauthorizedException(String message) {
    super(message, "UNAUTHORIZED");
  }

  public UnauthorizedException(String message, Throwable cause) {
    super(message, "UNAUTHORIZED", cause);
  }
}


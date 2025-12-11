package com.example.shared.exception;

public class ConflictException extends BaseException {
  public ConflictException(String message) {
    super(message, "CONFLICT");
  }

  public ConflictException(String message, Throwable cause) {
    super(message, "CONFLICT", cause);
  }
}


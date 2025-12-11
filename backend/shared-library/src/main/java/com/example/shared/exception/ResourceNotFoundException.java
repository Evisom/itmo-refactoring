package com.example.shared.exception;

public class ResourceNotFoundException extends BaseException {
  public ResourceNotFoundException(String message) {
    super(message, "RESOURCE_NOT_FOUND");
  }

  public ResourceNotFoundException(String message, Throwable cause) {
    super(message, "RESOURCE_NOT_FOUND", cause);
  }
}

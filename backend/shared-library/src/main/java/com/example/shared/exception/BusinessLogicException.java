package com.example.shared.exception;

public class BusinessLogicException extends BaseException {
  public BusinessLogicException(String message) {
    super(message, "BUSINESS_LOGIC_ERROR");
  }

  public BusinessLogicException(String message, Throwable cause) {
    super(message, "BUSINESS_LOGIC_ERROR", cause);
  }
}

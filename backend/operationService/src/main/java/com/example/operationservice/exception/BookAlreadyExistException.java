package com.example.operationservice.exception;

public class BookAlreadyExistException extends RuntimeException {
  public BookAlreadyExistException(String message) {
    super(message);
  }
}

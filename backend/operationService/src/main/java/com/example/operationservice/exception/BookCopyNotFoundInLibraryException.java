package com.example.operationservice.exception;

public class BookCopyNotFoundInLibraryException extends RuntimeException {
  public BookCopyNotFoundInLibraryException(String message) {
    super(message);
  }
}

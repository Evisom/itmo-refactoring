package com.example.operationservice.context.book.exception;

public class BookCopyNotFoundInLibraryException extends RuntimeException {
    public BookCopyNotFoundInLibraryException(String message) {
        super(message);
    }
}
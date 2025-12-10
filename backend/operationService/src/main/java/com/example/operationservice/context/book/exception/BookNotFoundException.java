package com.example.operationservice.context.book.exception;

public class BookNotFoundException  extends RuntimeException {
    public BookNotFoundException(String message) {
        super(message);
    }
}
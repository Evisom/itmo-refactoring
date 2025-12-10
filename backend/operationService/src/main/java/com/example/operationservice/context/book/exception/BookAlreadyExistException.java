package com.example.operationservice.context.book.exception;

public class BookAlreadyExistException extends RuntimeException {
    public BookAlreadyExistException(String message) {
        super(message);
    }
}
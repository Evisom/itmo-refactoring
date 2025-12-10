package com.example.bookservice.context.book.exception;

public class BookAlreadyExistException extends RuntimeException {
    public BookAlreadyExistException(String message) {
        super(message);
    }
}
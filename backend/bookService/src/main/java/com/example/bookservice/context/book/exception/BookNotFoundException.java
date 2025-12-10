package com.example.bookservice.context.book.exception;

public class BookNotFoundException  extends RuntimeException {
    public BookNotFoundException(String message) {
        super(message);
    }
}
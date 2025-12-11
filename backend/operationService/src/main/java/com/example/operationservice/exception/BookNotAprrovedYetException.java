package com.example.operationservice.exception;

public class BookNotAprrovedYetException extends RuntimeException {
    public BookNotAprrovedYetException(String message) {
        super(message);
    }
}
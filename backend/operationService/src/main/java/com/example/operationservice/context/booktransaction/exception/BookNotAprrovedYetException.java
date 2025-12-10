package com.example.operationservice.context.booktransaction.exception;

public class BookNotAprrovedYetException extends RuntimeException {
    public BookNotAprrovedYetException(String message) {
        super(message);
    }
}
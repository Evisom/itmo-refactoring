package com.example.operationservice.context.book.exception;

import com.example.operationservice.context.booktransaction.exception.BookNotAprrovedYetException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BookNotFoundException.class)
    public ResponseEntity<String> handleBookNotFound(BookNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ex.getMessage());
    }
    @ExceptionHandler(BookCopyNotFoundInLibraryException.class)
    public ResponseEntity<String> handleBookCopyNotFound(BookCopyNotFoundInLibraryException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ex.getMessage());
    }
    @ExceptionHandler(BookNotAprrovedYetException.class)
    public ResponseEntity<String> handleBookCopyNotFound(BookNotAprrovedYetException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ex.getMessage());
    }

    @ExceptionHandler(BookAlreadyExistException.class)
    public ResponseEntity<String> handleBookExist(BookAlreadyExistException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGlobalException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("An unexpected error occurred: " + ex.getMessage());
    }

    @ExceptionHandler(NumberFormatException.class)
    public ResponseEntity<String> handleNumberFormatException(NumberFormatException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Invalid book id format.");
    }
}

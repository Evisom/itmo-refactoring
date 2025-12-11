package com.example.shared.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class ValidationErrorResponse extends ErrorResponse {
    private List<FieldError> fieldErrors;

    public ValidationErrorResponse(String errorCode, String message, String path) {
        super(errorCode, message, path);
        this.fieldErrors = new ArrayList<>();
    }

    @Getter
    @Setter
    public static class FieldError {
        private String field;
        private String message;
        private Object rejectedValue;

        public FieldError(String field, String message, Object rejectedValue) {
            this.field = field;
            this.message = message;
            this.rejectedValue = rejectedValue;
        }
    }
}

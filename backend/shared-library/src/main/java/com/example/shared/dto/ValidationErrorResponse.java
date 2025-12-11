package com.example.shared.dto;

import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

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

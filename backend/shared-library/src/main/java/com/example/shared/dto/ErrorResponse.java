package com.example.shared.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
  private String errorCode;
  private String message;
  private LocalDateTime timestamp;
  private String path;

  public ErrorResponse(String errorCode, String message, String path) {
    this.errorCode = errorCode;
    this.message = message;
    this.path = path;
    this.timestamp = LocalDateTime.now();
  }
}

package com.example.bookservice.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LibraryCreateRequest {
  @NotBlank(message = "Name is required")
  private String name;

  @NotBlank(message = "Address is required")
  private String address;

  private LocalTime openingTime;

  private LocalTime closingTime;
}

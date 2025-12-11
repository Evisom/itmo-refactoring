package com.example.bookservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PublisherCreateRequest {
  @NotBlank(message = "Name is required")
  private String name;

  private String website;

  @Email(message = "Email must be valid")
  private String email;
}

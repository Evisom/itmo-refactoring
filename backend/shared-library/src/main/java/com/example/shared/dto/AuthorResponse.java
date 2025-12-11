package com.example.shared.dto;

import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthorResponse {
  private Long id;
  private String name;
  private String surname;
  private LocalDate birthDate;
}

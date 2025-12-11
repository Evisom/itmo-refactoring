package com.example.shared.dto;

import java.time.LocalTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LibraryResponse {
  private Long id;
  private String name;
  private String address;
  private LocalTime openingTime;
  private LocalTime closingTime;
}

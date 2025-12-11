package com.example.shared.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GenreResponse {
  private Long id;
  private String name;
  private Short popularity;
}

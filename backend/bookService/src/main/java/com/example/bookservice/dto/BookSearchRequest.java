package com.example.bookservice.dto;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookSearchRequest {
  private List<String> authors;
  private List<String> genres;
  private List<String> themes;
  private List<String> publishers;
  private Integer minCopies;
  private Integer maxCopies;
  private Boolean available;
  private String name;
  private String popularity;
  private Float ratingMIN;
  private Float ratingMAX;
}

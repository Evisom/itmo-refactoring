package com.example.bookservice.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookUpdateRequest {
  @NotBlank(message = "Title is required")
  private String title;

  private Integer yearPublished;

  @NotBlank(message = "ISBN is required")
  private String ISBN;

  private Long genreId;

  private Long themeId;

  private Long publisherId;

  private List<Long> authorIds;
}

package com.example.bookservice.dto;

import com.example.shared.dto.AuthorResponse;
import com.example.shared.model.Genre;
import com.example.shared.model.Publisher;
import com.example.shared.model.Theme;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookResponse {
  private Long id;
  private String title;
  private Integer yearPublished;
  private String ISBN;
  private List<AuthorResponse> authors;
  private Genre genre;
  private Theme theme;
  private Publisher publisher;
  private Float rating;
  private List<BookCopyResponse> copies;
}

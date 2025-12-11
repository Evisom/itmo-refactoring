package com.example.bookservice.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookCopyResponse {
  private Long id;
  private Long bookId;
  private Long libraryId;
  private String inventoryNumber;
  private Boolean available;
}

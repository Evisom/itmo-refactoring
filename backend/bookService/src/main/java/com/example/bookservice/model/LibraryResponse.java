package com.example.bookservice.model;

import com.example.shared.model.Library;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LibraryResponse {
  private Library library;
  private Boolean available;

  public static LibraryResponse fromBookCopyToResponse(BookCopy copy) {
    LibraryResponse response = new LibraryResponse();
    response.setLibrary(copy.getLibrary());
    response.setAvailable(copy.getAvailable());
    return response;
  }
}

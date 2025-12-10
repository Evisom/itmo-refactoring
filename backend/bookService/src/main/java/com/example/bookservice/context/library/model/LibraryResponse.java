package com.example.bookservice.context.library.model;

import com.example.bookservice.context.book.model.BookCopy;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LibraryResponse {
    private Library library;
    private Boolean available;

    public static LibraryResponse fromBookCopyToResponse(BookCopy copy){
        LibraryResponse response = new LibraryResponse();
        response.setLibrary(copy.getLibrary());
        response.setAvailable(copy.getAvailable());
        return response;
    }

}

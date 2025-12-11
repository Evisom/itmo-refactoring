package com.example.bookservice.dto;

import com.example.shared.model.Library;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
public class LibraryResponse {
    private Long id;
    private String name;
    private String address;
    private LocalTime openingTime;
    private LocalTime closingTime;
    private Boolean available;

    public static LibraryResponse fromLibrary(Library library) {
        LibraryResponse response = new LibraryResponse();
        response.setId(library.getId());
        response.setName(library.getName());
        response.setAddress(library.getAddress());
        response.setOpeningTime(library.getOpeningTime());
        response.setClosingTime(library.getClosingTime());
        return response;
    }

    public static LibraryResponse fromBookCopy(com.example.bookservice.model.BookCopy copy) {
        LibraryResponse response = new LibraryResponse();
        Library library = copy.getLibrary();
        response.setId(library.getId());
        response.setName(library.getName());
        response.setAddress(library.getAddress());
        response.setOpeningTime(library.getOpeningTime());
        response.setClosingTime(library.getClosingTime());
        response.setAvailable(copy.getAvailable());
        return response;
    }
}


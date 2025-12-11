package com.example.bookservice.dto.mapper;

import com.example.bookservice.dto.LibraryResponse;
import com.example.shared.model.Library;
import org.springframework.stereotype.Component;

@Component
public class LibraryMapper {

    public LibraryResponse toResponse(Library library) {
        LibraryResponse response = new LibraryResponse();
        response.setId(library.getId());
        response.setName(library.getName());
        response.setAddress(library.getAddress());
        response.setOpeningTime(library.getOpeningTime());
        response.setClosingTime(library.getClosingTime());
        return response;
    }
}


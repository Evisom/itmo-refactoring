package com.example.bookservice.dto.mapper;

import com.example.bookservice.dto.BookCopyResponse;
import com.example.bookservice.model.BookCopy;
import org.springframework.stereotype.Component;

@Component
public class BookCopyMapper {

    public BookCopyResponse toResponse(BookCopy bookCopy) {
        BookCopyResponse response = new BookCopyResponse();
        response.setId(bookCopy.getId());
        response.setBookId(bookCopy.getBook().getId());
        response.setLibraryId(bookCopy.getLibrary().getId());
        response.setInventoryNumber(bookCopy.getInventoryNumber());
        response.setAvailable(bookCopy.getAvailable());
        return response;
    }
}


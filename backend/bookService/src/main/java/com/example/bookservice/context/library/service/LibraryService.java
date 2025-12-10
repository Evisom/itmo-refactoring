package com.example.bookservice.context.library.service;

import com.example.bookservice.context.book.model.BookCopy;
import com.example.bookservice.context.book.repository.CopiesRepository;
import com.example.bookservice.context.library.model.Library;
import com.example.bookservice.context.library.model.LibraryResponse;
import com.example.bookservice.context.library.repository.LibraryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LibraryService {
    private final CopiesRepository copiesRepository;
    private final LibraryRepository libraryRepository;


    @Transactional
    public Page<LibraryResponse> findCopies(Long bookId, Pageable pageable) {
        Page<BookCopy> copies = copiesRepository.findByBookId(bookId, pageable);
        return copies.map(LibraryResponse::fromBookCopyToResponse);
    }


    @Transactional
    public List<Library> getLibrary() {
        return libraryRepository.findAll();
    }

    @Transactional
    public Library create(Library library) {
        return libraryRepository.save(library);
    }
}

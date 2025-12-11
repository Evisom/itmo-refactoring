package com.example.bookservice.service;

import com.example.bookservice.dto.LibraryCreateRequest;
import com.example.bookservice.dto.LibraryResponse;
import com.example.bookservice.dto.mapper.LibraryMapper;
import com.example.bookservice.model.BookCopy;
import com.example.bookservice.repository.CopiesRepository;
import com.example.shared.model.Library;
import com.example.bookservice.repository.LibraryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LibraryService {
    private final CopiesRepository copiesRepository;
    private final LibraryRepository libraryRepository;
    private final LibraryMapper libraryMapper;

    @Transactional(readOnly = true)
    public Page<LibraryResponse> findCopies(Long bookId, Pageable pageable) {
        Page<BookCopy> copies = copiesRepository.findByBookId(bookId, pageable);
        return copies.map(LibraryResponse::fromBookCopy);
    }

    @Transactional(readOnly = true)
    public List<LibraryResponse> getLibrary() {
        return libraryRepository.findAll().stream()
                .map(libraryMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public LibraryResponse create(LibraryCreateRequest request) {
        Library library = new Library();
        library.setName(request.getName());
        library.setAddress(request.getAddress());
        library.setOpeningTime(request.getOpeningTime());
        library.setClosingTime(request.getClosingTime());
        return libraryMapper.toResponse(libraryRepository.save(library));
    }
}

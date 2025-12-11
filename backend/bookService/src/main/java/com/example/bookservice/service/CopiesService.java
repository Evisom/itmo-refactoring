package com.example.bookservice.service;

import com.example.bookservice.dto.BookCopyCreateRequest;
import com.example.bookservice.dto.BookCopyResponse;
import com.example.bookservice.dto.BookCopyUpdateRequest;
import com.example.bookservice.dto.mapper.BookCopyMapper;
import com.example.bookservice.exception.BookAlreadyExistException;
import com.example.bookservice.exception.BookNotFoundException;
import com.example.bookservice.model.BookCopy;
import com.example.bookservice.repository.BookRepository;
import com.example.bookservice.repository.CopiesRepository;
import com.example.bookservice.repository.LibraryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CopiesService {
    private final CopiesRepository copiesRepository;
    private final BookRepository bookRepository;
    private final LibraryRepository libraryRepository;
    private final BookCopyMapper bookCopyMapper;

    @Transactional(readOnly = true)
    public Page<BookCopyResponse> findBooks(Long bookId, Long libraryId, Pageable pageable) {
        Page<BookCopy> copiesPage;

        if (bookId != null && libraryId != null) {
            copiesPage = copiesRepository.findByBookIdAndLibraryId(bookId, libraryId, pageable);
        } else if (bookId != null) {
            copiesPage = copiesRepository.findByBookId(bookId, pageable);
        } else if (libraryId != null) {
            copiesPage = copiesRepository.findByLibraryId(libraryId, pageable);
        } else {
            copiesPage = copiesRepository.findAll(pageable);
        }

        return copiesPage.map(bookCopyMapper::toResponse);
    }

    @Transactional
    public boolean deleteBook(Long id) {
        BookCopy book = copiesRepository.findById(id).orElse(null);

        if (book == null) {
            return false;
        }

        copiesRepository.deleteById(id);

        return true;
    }

    @Transactional
    public BookCopyResponse createBook(BookCopyCreateRequest request) {
        BookCopy bookFromIN = copiesRepository.findByInventoryNumber(request.getInventoryNumber());
        if (bookFromIN != null) {
            throw new BookAlreadyExistException("Book copy already exist");
        }
        BookCopy newBook = new BookCopy();
        newBook.setAvailable(request.getAvailable());
        newBook.setBook(bookRepository.findById(request.getBookId()).orElseThrow());
        newBook.setLibrary(libraryRepository.findById(request.getLibraryId()).orElseThrow());
        newBook.setInventoryNumber(request.getInventoryNumber());
        return bookCopyMapper.toResponse(copiesRepository.save(newBook));
    }

    @Transactional
    public BookCopyResponse updateCopy(Long id, BookCopyUpdateRequest request) {
        BookCopy oldBook = copiesRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + id));

        oldBook.setAvailable(request.getAvailable());
        oldBook.setBook(bookRepository.findById(request.getBookId()).orElseThrow());
        oldBook.setLibrary(libraryRepository.findById(request.getLibraryId()).orElseThrow());
        oldBook.setInventoryNumber(request.getInventoryNumber());
        return bookCopyMapper.toResponse(copiesRepository.save(oldBook));
    }
}

package com.example.bookservice.service;

import com.example.bookservice.exception.BookAlreadyExistException;
import com.example.bookservice.exception.BookNotFoundException;
import com.example.bookservice.model.BookCopy;
import com.example.bookservice.model.BookCopyModel;
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

    @Transactional
    public Page<BookCopyModel> findBooks(Long bookId, Long libraryId, Pageable pageable) {
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

        return copiesPage.map(BookCopyModel::toModel);
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
    public BookCopyModel createBook(BookCopyModel book) {
        BookCopy bookFromIN = copiesRepository.findByInventoryNumber(book.getInventoryNumber());
        if (bookFromIN != null) {
            throw new BookAlreadyExistException("Book copy already exist");
        }
        BookCopy newBook = new BookCopy();


        newBook.setAvailable(book.getAvailable());
        newBook.setBook(bookRepository.findById(book.getBookId()).orElseThrow());
        newBook.setLibrary(libraryRepository.findById(book.getLibraryId()).orElseThrow());
        newBook.setInventoryNumber(book.getInventoryNumber());
        return BookCopyModel.toModel(copiesRepository.save(newBook));


    }

    @Transactional
    public BookCopyModel updateCopy(Long id, BookCopyModel bookCopy) {
        BookCopy oldBook = copiesRepository.findById(id).orElseThrow(() -> new BookNotFoundException("Book not found with id: " + id));

        oldBook.setAvailable(bookCopy.getAvailable());
        oldBook.setBook(bookRepository.findById(bookCopy.getBookId()).orElseThrow());
        oldBook.setLibrary(libraryRepository.findById(bookCopy.getLibraryId()).orElseThrow());
        oldBook.setInventoryNumber(bookCopy.getInventoryNumber());
        return BookCopyModel.toModel(copiesRepository.save(oldBook));

    }
}

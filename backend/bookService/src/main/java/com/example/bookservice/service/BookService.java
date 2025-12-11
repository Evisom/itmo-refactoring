package com.example.bookservice.service;

import com.example.bookservice.dto.*;
import com.example.bookservice.dto.mapper.BookMapper;
import com.example.bookservice.exception.BookAlreadyExistException;
import com.example.bookservice.exception.BookNotFoundException;
import com.example.shared.model.Author;
import com.example.shared.model.Book;
import com.example.shared.model.Genre;
import com.example.shared.model.Publisher;
import com.example.shared.model.Theme;
import com.example.bookservice.repository.AuthorRepository;
import com.example.bookservice.repository.BookRepository;
import com.example.bookservice.repository.GenreRepository;
import com.example.bookservice.repository.PublisherRepository;
import com.example.bookservice.repository.ThemeRepository;
import com.example.bookservice.specification.BookSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final GenreRepository genreRepository;
    private final ThemeRepository themeRepository;
    private final PublisherRepository publisherRepository;
    private final BookMapper bookMapper;


    @Transactional(readOnly = true)
    public Page<BookResponse> findBooks(BookSearchRequest request, Pageable pageable) {
        Specification<Book> spec = Specification.where(null);

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            spec = spec.and(BookSpecifications.hasTitleLike(request.getName()));
        }
        if (request.getAuthors() != null) {
            spec = spec.and(BookSpecifications.hasAuthors(request.getAuthors()));
        }

        if (request.getMinCopies() != null) {
            spec = spec.and(BookSpecifications.hasMinCopies(request.getMinCopies()));
        }

        if (request.getMaxCopies() != null) {
            spec = spec.and(BookSpecifications.hasMaxCopies(request.getMaxCopies()));
        }

        if (request.getGenres() != null) {
            spec = spec.and(BookSpecifications.hasGenre(request.getGenres()));
        }

        if (request.getThemes() != null) {
            spec = spec.and(BookSpecifications.hasTheme(request.getThemes()));
        }

        if (request.getPublishers() != null) {
            spec = spec.and(BookSpecifications.hasPublisher(request.getPublishers()));
        }

        if (request.getAvailable() != null && request.getAvailable()) {
            spec = spec.and(BookSpecifications.hasAvailableCopies());
        } else if (request.getAvailable() != null) {
            spec = spec.and(BookSpecifications.hasNoAvailableCopies());
        }
        if (request.getRatingMIN() != null && request.getRatingMAX() != null) {
            spec = spec.and(BookSpecifications.hasRatingBetween(request.getRatingMIN(), request.getRatingMAX()));
        }

        return bookRepository.findAll(spec, pageable)
                .map(bookMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public BookResponse findBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + id));
        return bookMapper.toResponse(book);
    }

    @Transactional
    public BookResponse createBook(BookCreateRequest request) {
        Book bookFromISBN = bookRepository.findBookByISBN(request.getISBN());
        if (bookFromISBN != null) {
            throw new BookAlreadyExistException("Book already exist");
        }

        Book book = toEntity(request);
        return bookMapper.toResponse(bookRepository.save(book));
    }

    @Transactional
    public BookResponse updateBook(Long id, BookUpdateRequest request) {
        Book oldBook = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + id));

        updateEntity(oldBook, request);
        return bookMapper.toResponse(bookRepository.save(oldBook));
    }

    private Book toEntity(BookCreateRequest request) {
        Book book = new Book();
        book.setTitle(request.getTitle());
        book.setYearPublished(request.getYearPublished());
        book.setISBN(request.getISBN());

        if (request.getGenreId() != null) {
            Genre genre = genreRepository.findById(request.getGenreId())
                    .orElseThrow(() -> new RuntimeException("Genre not found"));
            book.setGenre(genre);
        }

        if (request.getThemeId() != null) {
            Theme theme = themeRepository.findById(request.getThemeId())
                    .orElseThrow(() -> new RuntimeException("Theme not found"));
            book.setTheme(theme);
        }

        if (request.getPublisherId() != null) {
            Publisher publisher = publisherRepository.findById(request.getPublisherId())
                    .orElseThrow(() -> new RuntimeException("Publisher not found"));
            book.setPublisher(publisher);
        }

        if (request.getAuthorIds() != null && !request.getAuthorIds().isEmpty()) {
            List<Author> authors = new ArrayList<>();
            for (Long authorId : request.getAuthorIds()) {
                Author author = authorRepository.findById(authorId)
                        .orElseThrow(() -> new RuntimeException("Author not found"));
                authors.add(author);
            }
            book.setAuthors(authors);
        }

        return book;
    }

    private void updateEntity(Book book, BookUpdateRequest request) {
        book.setTitle(request.getTitle());
        book.setYearPublished(request.getYearPublished());
        book.setISBN(request.getISBN());

        if (request.getGenreId() != null) {
            Genre genre = genreRepository.findById(request.getGenreId())
                    .orElseThrow(() -> new RuntimeException("Genre not found"));
            book.setGenre(genre);
        }

        if (request.getThemeId() != null) {
            Theme theme = themeRepository.findById(request.getThemeId())
                    .orElseThrow(() -> new RuntimeException("Theme not found"));
            book.setTheme(theme);
        }

        if (request.getPublisherId() != null) {
            Publisher publisher = publisherRepository.findById(request.getPublisherId())
                    .orElseThrow(() -> new RuntimeException("Publisher not found"));
            book.setPublisher(publisher);
        }

        if (request.getAuthorIds() != null) {
            List<Author> authors = new ArrayList<>();
            for (Long authorId : request.getAuthorIds()) {
                Author author = authorRepository.findById(authorId)
                        .orElseThrow(() -> new RuntimeException("Author not found"));
                authors.add(author);
            }
            book.setAuthors(authors);
        }
    }

    @Transactional
    public boolean deleteBook(Long id) {
        Book book = bookRepository.findById(id).orElse(null);

        if (book == null) {
            return false;
        }

        bookRepository.deleteById(id);

        return true;
    }
}

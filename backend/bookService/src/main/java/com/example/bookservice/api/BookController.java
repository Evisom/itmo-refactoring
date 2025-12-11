package com.example.bookservice.api;

import com.example.bookservice.api.Endpoints;
import com.example.bookservice.dto.*;
import com.example.bookservice.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(Endpoints.LIBRARY)
public class BookController {

    private final BookService bookService;

    @GetMapping("/find")
    public ResponseEntity<Page<BookResponse>> findBooks(
            @ModelAttribute BookSearchRequest request,
            Pageable pageable) {
        return ResponseEntity.ok(bookService.findBooks(request, pageable));
    }

    @GetMapping("/books/{id}")
    public ResponseEntity<BookResponse> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.findBookById(id));
    }

    @PreAuthorize("hasRole('LIBRARIAN')")
    @PostMapping("/newBook")
    public ResponseEntity<BookResponse> createBook(@Valid @RequestBody BookCreateRequest request) {
        return ResponseEntity.ok(bookService.createBook(request));
    }

    @PreAuthorize("hasRole('LIBRARIAN')")
    @PutMapping("/books/{id}")
    public ResponseEntity<BookResponse> updateBook(@PathVariable Long id, @Valid @RequestBody BookUpdateRequest request) {
        return ResponseEntity.ok(bookService.updateBook(id, request));
    }

    @PreAuthorize("hasRole('LIBRARIAN')")
    @DeleteMapping("/books/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        if (bookService.deleteBook(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}

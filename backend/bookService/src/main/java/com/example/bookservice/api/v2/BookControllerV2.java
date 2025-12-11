package com.example.bookservice.api.v2;

import com.example.bookservice.dto.*;
import com.example.bookservice.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(EndpointsV2.BOOKS)
@RequiredArgsConstructor
public class BookControllerV2 {

  private final BookService bookService;

  @GetMapping
  public ResponseEntity<Page<BookResponse>> findBooks(
      @ModelAttribute BookSearchRequest request, Pageable pageable) {
    return ResponseEntity.ok(bookService.findBooks(request, pageable));
  }

  @GetMapping("/{id}")
  public ResponseEntity<BookResponse> getBook(@PathVariable Long id) {
    return ResponseEntity.ok(bookService.findBookById(id));
  }

  @PreAuthorize("hasRole('LIBRARIAN')")
  @PostMapping
  public ResponseEntity<BookResponse> createBook(@Valid @RequestBody BookCreateRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(bookService.createBook(request));
  }

  @PreAuthorize("hasRole('LIBRARIAN')")
  @PutMapping("/{id}")
  public ResponseEntity<BookResponse> updateBook(
      @PathVariable Long id, @Valid @RequestBody BookUpdateRequest request) {
    return ResponseEntity.ok(bookService.updateBook(id, request));
  }

  @PreAuthorize("hasRole('LIBRARIAN')")
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
    if (bookService.deleteBook(id)) {
      return ResponseEntity.noContent().build();
    } else {
      return ResponseEntity.notFound().build();
    }
  }
}


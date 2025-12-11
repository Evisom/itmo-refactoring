package com.example.bookservice.api;

import com.example.bookservice.dto.BookCopyCreateRequest;
import com.example.bookservice.dto.BookCopyResponse;
import com.example.bookservice.dto.BookCopyUpdateRequest;
import com.example.bookservice.service.CopiesService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(Endpoints.COPIES)
public class CopiesController {
  private final CopiesService copiesService;

  @PreAuthorize("hasRole('LIBRARIAN')")
  @GetMapping
  public ResponseEntity<Page<BookCopyResponse>> findBooks(
      @RequestParam(required = false) Long bookId,
      @RequestParam(required = false) Long libraryId,
      Pageable pageable) {
    return ResponseEntity.ok(copiesService.findBooks(bookId, libraryId, pageable));
  }

  @PreAuthorize("hasRole('LIBRARIAN')")
  @PostMapping
  public ResponseEntity<BookCopyResponse> createBook(
      @Valid @RequestBody BookCopyCreateRequest request) {
    return ResponseEntity.ok(copiesService.createBook(request));
  }

  @PreAuthorize("hasRole('LIBRARIAN')")
  @PutMapping("/{id}")
  public ResponseEntity<BookCopyResponse> updateCopies(
      @PathVariable Long id, @Valid @RequestBody BookCopyUpdateRequest request) {
    return ResponseEntity.ok(copiesService.updateCopy(id, request));
  }

  @PreAuthorize("hasRole('LIBRARIAN')")
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteCopies(@PathVariable Long id) {
    if (copiesService.deleteBook(id)) {
      return ResponseEntity.noContent().build();
    } else {
      return ResponseEntity.notFound().build();
    }
  }
}

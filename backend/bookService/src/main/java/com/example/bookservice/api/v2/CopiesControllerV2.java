package com.example.bookservice.api.v2;

import com.example.bookservice.dto.BookCopyCreateRequest;
import com.example.bookservice.dto.BookCopyResponse;
import com.example.bookservice.dto.BookCopyUpdateRequest;
import com.example.bookservice.service.CopiesService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(EndpointsV2.COPIES)
@RequiredArgsConstructor
public class CopiesControllerV2 {
    private final CopiesService copiesService;

    @PreAuthorize("hasRole('LIBRARIAN')")
    @GetMapping
    public ResponseEntity<Page<BookCopyResponse>> getCopies(
            @RequestParam(required = false) Long bookId,
            @RequestParam(required = false) Long libraryId,
            Pageable pageable) {
        return ResponseEntity.ok(copiesService.findBooks(bookId, libraryId, pageable));
    }

    @PreAuthorize("hasRole('LIBRARIAN')")
    @PostMapping
    public ResponseEntity<BookCopyResponse> createCopy(@Valid @RequestBody BookCopyCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(copiesService.createBook(request));
    }

    @PreAuthorize("hasRole('LIBRARIAN')")
    @PutMapping("/{id}")
    public ResponseEntity<BookCopyResponse> updateCopy(
            @PathVariable Long id,
            @Valid @RequestBody BookCopyUpdateRequest request) {
        return ResponseEntity.ok(copiesService.updateCopy(id, request));
    }

    @PreAuthorize("hasRole('LIBRARIAN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCopy(@PathVariable Long id) {
        if (copiesService.deleteBook(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

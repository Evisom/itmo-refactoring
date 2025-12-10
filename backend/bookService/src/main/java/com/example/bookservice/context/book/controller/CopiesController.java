package com.example.bookservice.context.book.controller;

import com.example.bookservice.api.Endpoints;
import com.example.bookservice.context.book.model.BookCopyModel;
import com.example.bookservice.context.book.service.CopiesService;
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
    public ResponseEntity<Page<BookCopyModel>> findBooks(@RequestParam(required = false) Long bookId, @RequestParam(required = false) Long libraryId, Pageable pageable) {
        return ResponseEntity.ok(copiesService.findBooks(bookId, libraryId,pageable));
    }


    @PreAuthorize("hasRole('LIBRARIAN')")
    @PostMapping
    public ResponseEntity<BookCopyModel> createBook(@RequestBody BookCopyModel bookCopyook) {
        return ResponseEntity.ok(copiesService.createBook(bookCopyook));
    }
    @PreAuthorize("hasRole('LIBRARIAN')")

    @PutMapping("/{id}")
    public ResponseEntity<BookCopyModel> updateCopies(@PathVariable Long id, @RequestBody BookCopyModel bookCopy) {
        return ResponseEntity.ok(copiesService.updateCopy(id, bookCopy));
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

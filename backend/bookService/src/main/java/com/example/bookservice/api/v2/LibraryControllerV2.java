package com.example.bookservice.api.v2;

import com.example.bookservice.dto.LibraryCreateRequest;
import com.example.bookservice.dto.LibraryResponse;
import com.example.bookservice.service.LibraryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(EndpointsV2.LIBRARIES)
@RequiredArgsConstructor
public class LibraryControllerV2 {
    private final LibraryService libraryService;

    @GetMapping
    public ResponseEntity<List<LibraryResponse>> getAllLibraries() {
        return ResponseEntity.ok(libraryService.getLibrary());
    }

    @GetMapping("/{bookId}/copies")
    public ResponseEntity<Page<LibraryResponse>> getBookCopiesInLibraries(
            @PathVariable Long bookId,
            Pageable pageable) {
        return ResponseEntity.ok(libraryService.findCopies(bookId, pageable));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<LibraryResponse> createLibrary(@Valid @RequestBody LibraryCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(libraryService.create(request));
    }
}

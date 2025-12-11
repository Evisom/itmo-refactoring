package com.example.bookservice.api;

import com.example.bookservice.dto.LibraryCreateRequest;
import com.example.bookservice.dto.LibraryResponse;
import com.example.bookservice.service.BookCopyCsvService;
import com.example.bookservice.service.LibraryService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping(Endpoints.LIBRARY)
public class LibraryController {
  private final LibraryService libraryService;
  private final BookCopyCsvService bookCopyCsvService;

  @GetMapping("/allLibraries")
  public ResponseEntity<List<LibraryResponse>> getAllLibraries() {
    return ResponseEntity.ok(libraryService.getLibrary());
  }

  @GetMapping("/allLibraries/{bookId}")
  public ResponseEntity<Page<LibraryResponse>> findBookCopyInlabrary(
      @PathVariable Long bookId, Pageable pageable) {
    return ResponseEntity.ok(libraryService.findCopies(bookId, pageable));
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping("/new")
  public ResponseEntity<LibraryResponse> createLibrary(
      @Valid @RequestBody LibraryCreateRequest request) {
    return ResponseEntity.ok(libraryService.create(request));
  }

  @PreAuthorize("hasRole('LIBRARIAN')")
  @PostMapping("/upload")
  public ResponseEntity<String> importBookCopies(@RequestParam("file") MultipartFile file) {
    try {
      bookCopyCsvService.importBookCopiesFromCsv(file.getInputStream());
      return ResponseEntity.ok("Book copies imported successfully");
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body("Error importing book copies: " + e.getMessage());
    }
  }
}

package com.example.bookservice.api;

import com.example.bookservice.dto.AuthorCreateRequest;
import com.example.bookservice.service.AuthorService;
import com.example.shared.dto.AuthorResponse;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(Endpoints.AUTHORS)
public class AuthorController {
  private final AuthorService authorService;

  @GetMapping
  public ResponseEntity<List<AuthorResponse>> allAuthors() {
    return ResponseEntity.status(HttpStatus.OK).body(authorService.findAllAuthors());
  }

  @PreAuthorize("hasRole('LIBRARIAN')")
  @PostMapping
  public ResponseEntity<AuthorResponse> createAuthor(
      @Valid @RequestBody AuthorCreateRequest request) {
    return ResponseEntity.ok(authorService.createAuthor(request));
  }

  @PreAuthorize("hasRole('LIBRARIAN')")
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteAuthor(@PathVariable Long id) {
    if (authorService.deleteAuthor(id)) {
      return ResponseEntity.noContent().build();
    } else {
      return ResponseEntity.notFound().build();
    }
  }
}

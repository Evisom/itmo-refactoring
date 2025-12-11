package com.example.bookservice.api.v2;

import com.example.bookservice.dto.GenreCreateRequest;
import com.example.bookservice.service.GenreService;
import com.example.shared.dto.GenreResponse;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(EndpointsV2.GENRES)
@RequiredArgsConstructor
public class GenreControllerV2 {
  private final GenreService genreService;

  @GetMapping
  public ResponseEntity<List<GenreResponse>> getAllGenres() {
    return ResponseEntity.ok(genreService.findAllGenres());
  }

  @PreAuthorize("hasRole('LIBRARIAN')")
  @PostMapping
  public ResponseEntity<GenreResponse> createGenre(@Valid @RequestBody GenreCreateRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(genreService.createGenre(request));
  }

  @PreAuthorize("hasRole('LIBRARIAN')")
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteGenre(@PathVariable Long id) {
    if (genreService.deleteGenre(id)) {
      return ResponseEntity.noContent().build();
    } else {
      return ResponseEntity.notFound().build();
    }
  }
}


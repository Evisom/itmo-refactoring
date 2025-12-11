package com.example.bookservice.api;

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
@RequiredArgsConstructor
@RequestMapping(Endpoints.GENRES)
public class GenreController {
  private final GenreService genreService;

  @GetMapping
  public ResponseEntity<List<GenreResponse>> allGenres() {
    return ResponseEntity.status(HttpStatus.OK).body(genreService.findAllGenres());
  }

  @PreAuthorize("hasRole('LIBRARIAN')")
  @PostMapping
  public ResponseEntity<GenreResponse> createGenre(@Valid @RequestBody GenreCreateRequest request) {
    return ResponseEntity.ok(genreService.createGenre(request));
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

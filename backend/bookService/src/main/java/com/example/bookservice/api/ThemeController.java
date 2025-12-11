package com.example.bookservice.api;

import com.example.bookservice.dto.ThemeCreateRequest;
import com.example.bookservice.service.ThemeService;
import com.example.shared.dto.ThemeResponse;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(Endpoints.THEME)
public class ThemeController {
  private final ThemeService themeService;

  @GetMapping
  public ResponseEntity<List<ThemeResponse>> allThemes() {
    return ResponseEntity.status(HttpStatus.OK).body(themeService.findAllThemes());
  }

  @PreAuthorize("hasRole('LIBRARIAN')")
  @PostMapping
  public ResponseEntity<ThemeResponse> createTheme(@Valid @RequestBody ThemeCreateRequest request) {
    return ResponseEntity.ok(themeService.createTheme(request));
  }

  @PreAuthorize("hasRole('LIBRARIAN')")
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteTheme(@PathVariable Long id) {
    if (themeService.deleteTheme(id)) {
      return ResponseEntity.noContent().build();
    } else {
      return ResponseEntity.notFound().build();
    }
  }
}

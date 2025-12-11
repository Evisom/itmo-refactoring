package com.example.bookservice.api.v2;

import com.example.bookservice.dto.ThemeCreateRequest;
import com.example.shared.dto.ThemeResponse;
import com.example.bookservice.service.ThemeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(EndpointsV2.THEMES)
@RequiredArgsConstructor
public class ThemeControllerV2 {
    private final ThemeService themeService;

    @GetMapping
    public ResponseEntity<List<ThemeResponse>> getAllThemes() {
        return ResponseEntity.ok(themeService.findAllThemes());
    }

    @PreAuthorize("hasRole('LIBRARIAN')")
    @PostMapping
    public ResponseEntity<ThemeResponse> createTheme(@Valid @RequestBody ThemeCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(themeService.createTheme(request));
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

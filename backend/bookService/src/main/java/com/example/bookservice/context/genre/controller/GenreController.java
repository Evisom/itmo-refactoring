package com.example.bookservice.context.genre.controller;

import com.example.bookservice.api.Endpoints;
import com.example.bookservice.context.genre.model.Genre;
import com.example.bookservice.context.genre.service.GenreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(Endpoints.GENRES)
public class GenreController {
    private final GenreService genreService;

    @GetMapping
    public ResponseEntity<List<Genre>> allGenres() {
        return ResponseEntity.status(HttpStatus.OK).body(genreService.findAllGenres());
    }

    @PreAuthorize("hasRole('LIBRARIAN')")
    @PostMapping
    public ResponseEntity<Genre> createGenre(@RequestBody Genre genre) {
        return ResponseEntity.ok(genreService.createGenre(genre));
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

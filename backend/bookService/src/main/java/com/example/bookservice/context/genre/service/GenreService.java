package com.example.bookservice.context.genre.service;


import com.example.bookservice.context.genre.model.Genre;
import com.example.bookservice.context.genre.repository.GenreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GenreService {
    private final GenreRepository genreRepository;

    @Transactional
    public List<Genre> findAllGenres() {

        return genreRepository.findAll();
    }

    @Transactional
    public Genre createGenre(Genre genre) {
        return genreRepository.save(genre);
    }


    @Transactional
    public boolean deleteGenre(Long id) {
        Genre genre = genreRepository.findById(id).orElse(null);

        if (genre == null) {
            return false;
        }

        genreRepository.deleteById(id);

        return true;
    }
}

package com.example.bookservice.service;

import com.example.bookservice.dto.GenreCreateRequest;
import com.example.bookservice.dto.mapper.GenreMapper;
import com.example.bookservice.repository.GenreRepository;
import com.example.shared.dto.GenreResponse;
import com.example.shared.model.Genre;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GenreService {
  private final GenreRepository genreRepository;
  private final GenreMapper genreMapper;

  @Transactional(readOnly = true)
  public List<GenreResponse> findAllGenres() {
    return genreRepository.findAll().stream()
        .map(genreMapper::toResponse)
        .collect(Collectors.toList());
  }

  @Transactional
  public GenreResponse createGenre(GenreCreateRequest request) {
    Genre genre = new Genre();
    genre.setName(request.getName());
    genre.setPopularity(request.getPopularity());
    return genreMapper.toResponse(genreRepository.save(genre));
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

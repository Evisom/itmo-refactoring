package com.example.bookservice.service;

import com.example.bookservice.dto.ThemeCreateRequest;
import com.example.bookservice.dto.mapper.ThemeMapper;
import com.example.bookservice.repository.ThemeRepository;
import com.example.shared.dto.ThemeResponse;
import com.example.shared.model.Theme;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ThemeService {
  private final ThemeRepository themeRepository;
  private final ThemeMapper themeMapper;

  @Transactional(readOnly = true)
  public List<ThemeResponse> findAllThemes() {
    return themeRepository.findAll().stream()
        .map(themeMapper::toResponse)
        .collect(Collectors.toList());
  }

  @Transactional
  public ThemeResponse createTheme(ThemeCreateRequest request) {
    Theme theme = new Theme();
    theme.setName(request.getName());
    theme.setPopularity(request.getPopularity());
    return themeMapper.toResponse(themeRepository.save(theme));
  }

  @Transactional
  public boolean deleteTheme(Long id) {
    Theme theme = themeRepository.findById(id).orElse(null);

    if (theme == null) {
      return false;
    }

    themeRepository.deleteById(id);

    return true;
  }
}

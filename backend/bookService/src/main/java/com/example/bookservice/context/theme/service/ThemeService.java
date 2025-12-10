package com.example.bookservice.context.theme.service;

import com.example.bookservice.context.theme.model.Theme;
import com.example.bookservice.context.theme.repository.ThemeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ThemeService {
    private final ThemeRepository themeRepository;

    @Transactional
    public List<Theme> findAllThemes() {

        return themeRepository.findAll();
    }

    @Transactional
    public Theme createTheme(Theme theme) {
        return themeRepository.save(theme);
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

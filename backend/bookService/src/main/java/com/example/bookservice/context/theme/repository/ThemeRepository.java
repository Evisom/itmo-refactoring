package com.example.bookservice.context.theme.repository;

import com.example.bookservice.context.theme.model.Theme;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ThemeRepository extends JpaRepository<Theme,Long> {
}

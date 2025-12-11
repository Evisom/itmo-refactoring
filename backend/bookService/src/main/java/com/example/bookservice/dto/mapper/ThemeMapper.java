package com.example.bookservice.dto.mapper;

import com.example.shared.dto.ThemeResponse;
import com.example.shared.model.Theme;
import org.springframework.stereotype.Component;

@Component
public class ThemeMapper {

    public ThemeResponse toResponse(Theme theme) {
        ThemeResponse response = new ThemeResponse();
        response.setId(theme.getId());
        response.setName(theme.getName());
        response.setPopularity(theme.getPopularity());
        return response;
    }
}


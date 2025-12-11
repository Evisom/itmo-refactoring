package com.example.bookservice.dto.mapper;

import com.example.shared.dto.GenreResponse;
import com.example.shared.model.Genre;
import org.springframework.stereotype.Component;

@Component
public class GenreMapper {

    public GenreResponse toResponse(Genre genre) {
        GenreResponse response = new GenreResponse();
        response.setId(genre.getId());
        response.setName(genre.getName());
        response.setPopularity(genre.getPopularity());
        return response;
    }
}


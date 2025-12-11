package com.example.bookservice.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GenreCreateRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @Min(value = 1, message = "Popularity must be at least 1")
    private Short popularity;
}


package com.example.bookservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BookCreateRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private Integer yearPublished;

    @NotBlank(message = "ISBN is required")
    private String ISBN;

    @NotNull(message = "Genre ID is required")
    private Long genreId;

    private Long themeId;

    private Long publisherId;

    private List<Long> authorIds;
}


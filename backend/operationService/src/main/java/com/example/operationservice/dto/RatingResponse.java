package com.example.operationservice.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class RatingResponse {
    private Long id;
    private String userId;
    private Long bookId;
    private String bookTitle;
    private Integer ratingValue;
    private String review;
    private LocalDateTime time;
}


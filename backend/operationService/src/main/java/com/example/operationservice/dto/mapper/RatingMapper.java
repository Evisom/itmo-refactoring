package com.example.operationservice.dto.mapper;

import com.example.operationservice.dto.RatingResponse;
import com.example.operationservice.model.Rating;
import org.springframework.stereotype.Component;

@Component
public class RatingMapper {

    public RatingResponse toResponse(Rating rating) {
        RatingResponse response = new RatingResponse();
        response.setId(rating.getId());
        response.setUserId(rating.getUserId());
        response.setBookId(rating.getBook().getId());
        response.setBookTitle(rating.getBook().getTitle());
        response.setRatingValue(rating.getRatingValue().intValue());
        response.setReview(rating.getReview());
        response.setTime(rating.getTime());
        return response;
    }
}


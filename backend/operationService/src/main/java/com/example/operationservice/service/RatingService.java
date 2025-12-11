package com.example.operationservice.service;

import com.example.operationservice.dto.RatingCreateRequest;
import com.example.operationservice.dto.RatingResponse;
import com.example.operationservice.dto.mapper.RatingMapper;
import com.example.operationservice.repository.BookRepository;
import com.example.operationservice.model.Rating;
import com.example.operationservice.repository.RatingRepository;
import com.example.operationservice.config.CustomUserDetails;
import com.example.operationservice.config.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RatingService {
    private final RatingRepository ratingRepository;
    private final BookRepository bookRepository;
    private final RatingMapper ratingMapper;

    @Transactional(readOnly = true)
    public List<RatingResponse> getOneRatings(Long bookId) {
        List<Rating> ratingList = ratingRepository.findAllByBookId(bookId).orElse(Collections.emptyList());
        return ratingList.stream()
                .map(ratingMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public RatingResponse createReview(RatingCreateRequest request) {
        CustomUserDetails userDetails = null;
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() != null) {
                if (auth.getPrincipal() instanceof Jwt) {
                    Jwt jwt = (Jwt) auth.getPrincipal();
                    userDetails = JwtTokenUtil.parseToken(jwt.getTokenValue());
                } else if (auth.getPrincipal() instanceof CustomUserDetails) {
                    userDetails = (CustomUserDetails) auth.getPrincipal();
                }
            }
        } catch (Exception e) {
        }
        
        Rating newRating = new Rating();
        newRating.setRatingValue(request.getRatingValue().shortValue());
        newRating.setReview(request.getReview());
        newRating.setUserId(userDetails != null ? userDetails.getId() : "anonymous");
        newRating.setBook(bookRepository.findById(request.getBookId()).orElseThrow());
        newRating.setTime(LocalDateTime.now());
        return ratingMapper.toResponse(ratingRepository.save(newRating));
    }
}

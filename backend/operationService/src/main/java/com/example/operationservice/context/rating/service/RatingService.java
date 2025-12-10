package com.example.operationservice.context.rating.service;

import com.example.operationservice.context.book.repository.BookRepository;
import com.example.operationservice.context.rating.model.Rating;
import com.example.operationservice.context.rating.model.RatingModel;
import com.example.operationservice.context.rating.repository.RatingRepository;
import com.example.operationservice.context.user.CustomUserDetails;
import com.example.operationservice.config.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RatingService {
    private final RatingRepository ratingRepository;
    private final BookRepository bookRepository;

    @Transactional
    public List<RatingModel> getAllRatings() {
        return ratingRepository.findAll().stream().map(RatingModel::toModel).collect(Collectors.toList());
    }

    @Transactional
    public List<RatingModel> getOneRatings(Long bookId) {
        List<Rating> ratingList = ratingRepository.findAllByBookId(bookId).orElse(null);
        if (ratingList != null) {
            return ratingList.stream().map(RatingModel::toModel).collect(Collectors.toList());
        }
        return null;
    }

    @Transactional

    public RatingModel createReview(RatingModel rating) {


        // Получаем пользователя из SecurityContext (временно без аутентификации)
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
            // Игнорируем ошибки аутентификации
        }
        
        Rating newRating = new Rating();

        newRating.setRatingValue(rating.getRatingValue());
        newRating.setReview(rating.getReview());
        newRating.setUserId(userDetails != null ? userDetails.getId() : "anonymous");
        newRating.setEmail(userDetails != null ? userDetails.getEmail() : "anonymous@example.com");
        newRating.setBook(bookRepository.findById(rating.getBookId()).orElseThrow());
        newRating.setTime(LocalDateTime.now());
        return RatingModel.toModel(ratingRepository.save(newRating));
    }
}

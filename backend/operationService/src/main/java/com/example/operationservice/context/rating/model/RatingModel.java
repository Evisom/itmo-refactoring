package com.example.operationservice.context.rating.model;

import com.example.operationservice.context.book.model.BookModel;
import com.example.operationservice.context.user.CustomUserDetails;
import com.example.operationservice.config.JwtTokenUtil;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class RatingModel {

    private Long id;
    private String userId;
    private String email;
    private BookModel book;
    private Integer ratingValue;
    private String review;
    private Long bookId;
    private LocalDateTime time;

    public static RatingModel toModel(Rating rating) {

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
        
        RatingModel model = new RatingModel();
        model.setId(rating.getId());
        model.setEmail(rating.getEmail());
        model.setUserId(userDetails != null ? userDetails.getId() : rating.getUserId());
        model.setBook(BookModel.toModel(rating.getBook()));
        model.setRatingValue(rating.getRatingValue());
        model.setReview(rating.getReview());
        model.setTime(rating.getTime());
        return model;
    }

}

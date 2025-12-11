package com.example.operationservice.service;

import com.example.operationservice.dto.RatingCreateRequest;
import com.example.operationservice.dto.RatingResponse;
import com.example.operationservice.dto.mapper.RatingMapper;
import com.example.operationservice.model.Rating;
import com.example.operationservice.repository.BookRepository;
import com.example.operationservice.repository.RatingRepository;
import com.example.operationservice.util.SecurityContextUtil;
import com.example.shared.exception.ResourceNotFoundException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RatingService {
  private final RatingRepository ratingRepository;
  private final BookRepository bookRepository;
  private final RatingMapper ratingMapper;

  @Transactional(readOnly = true)
  public List<RatingResponse> getOneRatings(Long bookId) {
    List<Rating> ratingList =
        ratingRepository.findAllByBookId(bookId).orElse(Collections.emptyList());
    return ratingList.stream().map(ratingMapper::toResponse).collect(Collectors.toList());
  }

  @Transactional
  public RatingResponse createReview(RatingCreateRequest request) {
    String userId = SecurityContextUtil.getUserId();

    Rating newRating = new Rating();
    newRating.setRatingValue(request.getRatingValue().shortValue());
    newRating.setReview(request.getReview());
    newRating.setUserId(userId != null ? userId : "anonymous");
    newRating.setBook(
        bookRepository
            .findById(request.getBookId())
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        "Book not found with id: " + request.getBookId())));
    newRating.setTime(LocalDateTime.now());
    return ratingMapper.toResponse(ratingRepository.save(newRating));
  }
}

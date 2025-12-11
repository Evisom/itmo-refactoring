package com.example.operationservice.api.v2;

import com.example.operationservice.dto.RatingCreateRequest;
import com.example.operationservice.dto.RatingResponse;
import com.example.operationservice.service.RatingService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(EndpointsV2.RATINGS)
@RequiredArgsConstructor
public class RatingControllerV2 {
  private final RatingService ratingService;

  @GetMapping
  public ResponseEntity<List<RatingResponse>> getRatings(@RequestParam Long bookId) {
    return ResponseEntity.ok(ratingService.getOneRatings(bookId));
  }

  @PostMapping
  public ResponseEntity<RatingResponse> createRating(
      @Valid @RequestBody RatingCreateRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(ratingService.createReview(request));
  }
}

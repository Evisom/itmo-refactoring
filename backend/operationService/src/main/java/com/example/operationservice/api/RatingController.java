package com.example.operationservice.api;

import com.example.operationservice.dto.RatingCreateRequest;
import com.example.operationservice.dto.RatingResponse;
import com.example.operationservice.service.RatingService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(Endpoints.REVIEWS)
@RequiredArgsConstructor
public class RatingController {
  private final RatingService ratingService;

  @GetMapping("/{bookId}")
  public ResponseEntity<List<RatingResponse>> getRatingsByBook(@PathVariable Long bookId) {
    return ResponseEntity.ok(ratingService.getOneRatings(bookId));
  }

  @PostMapping
  public ResponseEntity<RatingResponse> newReview(@Valid @RequestBody RatingCreateRequest request) {
    return ResponseEntity.ok(ratingService.createReview(request));
  }
}

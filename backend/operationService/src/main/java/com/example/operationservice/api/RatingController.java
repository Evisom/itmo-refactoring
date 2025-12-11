package com.example.operationservice.api;


import com.example.operationservice.api.Endpoints;
import com.example.operationservice.model.RatingModel;
import com.example.operationservice.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(Endpoints.REVIEWS)
@RequiredArgsConstructor
public class RatingController {
    private final RatingService ratingService;

//    @GetMapping
//    public ResponseEntity<List<RatingModel>> getAllRatings() {
//        return ResponseEntity.ok(ratingService.getAllRatings());
//    }

    @GetMapping("/{bookId}")
    public ResponseEntity<List<RatingModel>> getRatingsByBook(@PathVariable Long bookId) {
        return ResponseEntity.ok(ratingService.getOneRatings(bookId));
    }

    @PostMapping
    public ResponseEntity<RatingModel> newReview(@RequestBody RatingModel rating) {
        return ResponseEntity.ok(ratingService.createReview(rating));
    }
}

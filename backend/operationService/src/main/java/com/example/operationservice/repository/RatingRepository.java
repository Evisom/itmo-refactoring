package com.example.operationservice.repository;

import com.example.operationservice.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    Optional<List<Rating>> findAllByBookId(Long bookId);


}

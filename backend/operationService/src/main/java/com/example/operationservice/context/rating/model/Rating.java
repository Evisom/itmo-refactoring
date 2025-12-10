package com.example.operationservice.context.rating.model;


import com.example.operationservice.context.book.model.Book;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "rating")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String userId;
    private String email;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Column(name = "rating_value", nullable = false)
    private Integer ratingValue;

    @Column(name = "review")
    private String review;

    private LocalDateTime time;
}
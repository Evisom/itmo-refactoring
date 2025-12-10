package com.example.operationservice.context.booktransaction.model;

import com.example.operationservice.context.book.model.BookCopy;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "book_transaction")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "book_copy_id", nullable = false)
    private BookCopy bookCopy;


    @Column(name = "user_id")
    private String userId;

    @Column(name = "borrow_date")
    private LocalDateTime borrowDate;

    @Column(name = "return_date")
    private LocalDateTime returnDate;

    @Column(name = "returned", nullable = false)
    private Boolean returned = false;

    private String email;
    private String firstName;
    private String lastName;
    private LocalDateTime creationDate;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(columnDefinition = "TEXT")
    private String comment;
}

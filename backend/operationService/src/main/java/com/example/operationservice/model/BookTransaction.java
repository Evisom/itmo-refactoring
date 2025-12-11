package com.example.operationservice.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

  @Column(name = "user_id", nullable = false)
  private String userId;

  @Column(name = "borrow_date")
  private LocalDateTime borrowDate;

  @Column(name = "return_date")
  private LocalDateTime returnDate;

  @Column(name = "returned", nullable = false)
  private Boolean returned = false;

  @Column(name = "creation_date", nullable = false)
  private LocalDateTime creationDate;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Status status;

  @Column(columnDefinition = "TEXT")
  private String comment;

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
    updatedAt = LocalDateTime.now();
  }

  @PreUpdate
  protected void onUpdate() {
    updatedAt = LocalDateTime.now();
  }
}

package com.example.operationservice.model;

import com.example.shared.model.Library;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UnifiedData {
  private Long id;
  private String type; // Тип объекта: "Rating" или "BookTransaction"
  private LocalDateTime time;

  // Поля для Rating
  private String userId;
  private String email;
  private Integer ratingValue;
  private String review;

  // Поля для BookTransaction

  private String title;
  private List<AuthorModel> author;

  private Library library;
  private LocalDateTime borrowDate;
  private String status;
  private String comment;
  private String invNumber;
}

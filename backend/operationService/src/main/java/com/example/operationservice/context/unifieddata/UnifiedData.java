package com.example.operationservice.context.unifieddata;

import com.example.operationservice.context.author.model.AuthorModel;
import com.example.operationservice.context.library.model.Library;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

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

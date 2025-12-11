package com.example.operationservice.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class BookTransactionResponse {
    private Long id;
    private Long bookCopyId;
    private String userId;
    private LocalDateTime borrowDate;
    private LocalDateTime returnDate;
    private LocalDateTime creationDate;
    private Boolean returned;
    private String status;
    private String comment;
}


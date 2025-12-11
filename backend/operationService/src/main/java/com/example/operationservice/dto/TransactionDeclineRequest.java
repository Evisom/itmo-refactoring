package com.example.operationservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransactionDeclineRequest {
    @NotBlank(message = "Comment is required")
    private String comment;
}


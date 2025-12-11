package com.example.operationservice.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransactionCreateRequest {
    @NotNull(message = "Library ID is required")
    private Long libraryId;
}


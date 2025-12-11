package com.example.operationservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransactionReturnRequest {
    @NotBlank(message = "Inventory number is required")
    private String inventoryNumber;
}


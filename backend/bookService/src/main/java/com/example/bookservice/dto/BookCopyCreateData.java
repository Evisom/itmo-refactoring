package com.example.bookservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookCopyCreateData {
    @NotNull(message = "Library ID is required")
    private Long libraryId;

    @NotBlank(message = "Inventory number is required")
    private String inventoryNumber;

    @NotNull(message = "Available status is required")
    private Boolean available = true;
}

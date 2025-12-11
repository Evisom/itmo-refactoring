package com.example.shared.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
public class LibraryResponse {
    private Long id;
    private String name;
    private String address;
    private LocalTime openingTime;
    private LocalTime closingTime;
}


package com.example.shared.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class AuthorResponse {
    private Long id;
    private String name;
    private String surname;
    private LocalDate birthDate;
}


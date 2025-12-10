package com.example.operationservice.context.book.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BookSearchRequest {
    private List<String> authors;
    private List<String> genres;
    private List<String> themes;
    private List<String> publishers;
    private Integer minCopies;
    private Integer maxCopies;
    private Boolean available;
    private String name;
    private String popularity; // "asc" или "desc"
    private Double rating;
}

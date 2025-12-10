package com.example.bookservice.context.author.model;


import com.example.bookservice.context.book.model.Book;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "author")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Author {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String surname;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @ManyToMany(mappedBy = "authors")
    private List<Book> books;
}

package com.example.bookservice.context.author.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class AuthorModel {

    private Long id;

    private String name;


    private String surname;


    private LocalDate birthDate;

//    @ManyToMany(mappedBy = "authors")
//    private List<Book> books;

    public static AuthorModel toModel(Author author) {
        AuthorModel model = new AuthorModel();
        model.setId(author.getId());
        model.setName(author.getName());
        model.setSurname(author.getSurname());
        model.setBirthDate(author.getBirthDate());
        return model;
    }
}

package com.example.operationservice.context.book.model;


import com.example.operationservice.context.author.model.AuthorModel;
import com.example.operationservice.context.genre.model.Genre;
import com.example.operationservice.context.publisher.model.Publisher;
import com.example.operationservice.context.theme.model.Theme;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
public class BookModelForReport {
    private Long id;
    private String title;
    private Integer yearPublished;
    private String ISBN;
    private List<AuthorModel> authors;
    private Genre genre;
    private Theme theme;
    private Publisher publisher;
    private Float rating;
    public static BookModelForReport toModel(BookCopy bookCopy) {
        Book book = bookCopy.getBook();
        BookModelForReport model = new BookModelForReport();
        model.setId(book.getId());
        model.setTitle(book.getTitle());
        model.setYearPublished(book.getYearPublished());
        model.setISBN(book.getISBN());
        model.setGenre(book.getGenre());
        model.setTheme(book.getTheme());
        model.setPublisher(book.getPublisher());
        model.setRating(book.getAverageRating());

        if (book.getAuthors() != null) {
            model.setAuthors(
                    book.getAuthors().stream()
                            .map(AuthorModel::toModel) // Преобразуем каждого автора в модель
                            .collect(Collectors.toList())
            );
        }



        return model;
    }
}

package com.example.bookservice.context.book.model;

import com.example.bookservice.context.author.model.AuthorModel;
import com.example.bookservice.context.genre.model.Genre;
import com.example.bookservice.context.publisher.model.Publisher;
import com.example.bookservice.context.theme.model.Theme;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
public class BookModel {
    private Long id;
    private String title;
    private Integer yearPublished;
    private String ISBN;
    private List<AuthorModel> authors;
    private List<BookCopyModel> copies;
    private Genre genre;
    private Theme theme;
    private Publisher publisher;
    private Float rating;
    public static BookModel toModel(Book book) {
        BookModel model = new BookModel();
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
        if (book.getCopies() != null) {
            model.setCopies(
                    book.getCopies().stream()
                            .map(BookCopyModel::toModel)
                            .collect(Collectors.toList())
            );
        }


        return model;
    }
}

package com.example.bookservice.model;

import com.example.shared.model.Book;
import com.example.shared.model.Genre;
import com.example.shared.model.Publisher;
import com.example.shared.model.Theme;
import java.util.List;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
          book.getAuthors().stream().map(AuthorModel::toModel).collect(Collectors.toList()));
    }

    return model;
  }
}

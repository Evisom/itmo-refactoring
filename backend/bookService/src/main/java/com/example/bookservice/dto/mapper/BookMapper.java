package com.example.bookservice.dto.mapper;

import com.example.bookservice.dto.BookResponse;
import com.example.bookservice.model.BookCopy;
import com.example.bookservice.repository.CopiesRepository;
import com.example.shared.dto.AuthorResponse;
import com.example.shared.model.Author;
import com.example.shared.model.Book;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BookMapper {

  private final CopiesRepository copiesRepository;
  private final BookCopyMapper bookCopyMapper;

  public BookResponse toResponse(Book book) {
    BookResponse response = new BookResponse();
    response.setId(book.getId());
    response.setTitle(book.getTitle());
    response.setYearPublished(book.getYearPublished());
    response.setISBN(book.getISBN());
    response.setGenre(book.getGenre());
    response.setTheme(book.getTheme());
    response.setPublisher(book.getPublisher());
    response.setRating(book.getAverageRating());

    if (book.getAuthors() != null) {
      response.setAuthors(
          book.getAuthors().stream().map(this::toAuthorResponse).collect(Collectors.toList()));
    }

    List<BookCopy> copies =
        copiesRepository
            .findByBookId(book.getId(), org.springframework.data.domain.Pageable.unpaged())
            .getContent();
    if (copies != null && !copies.isEmpty()) {
      response.setCopies(
          copies.stream().map(bookCopyMapper::toResponse).collect(Collectors.toList()));
    } else {
      response.setCopies(Collections.emptyList());
    }

    return response;
  }

  private AuthorResponse toAuthorResponse(Author author) {
    AuthorResponse response = new AuthorResponse();
    response.setId(author.getId());
    response.setName(author.getName());
    response.setSurname(author.getSurname());
    response.setBirthDate(author.getBirthDate());
    return response;
  }
}

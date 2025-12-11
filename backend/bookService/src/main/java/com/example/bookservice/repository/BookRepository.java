package com.example.bookservice.repository;

import com.example.shared.model.Book;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookRepository extends JpaRepository<Book, Long>, JpaSpecificationExecutor<Book> {
  Book findBookByISBN(String isbn);

  @Query(value = "SELECT get_average_book_rating(:bookId)", nativeQuery = true)
  Float getAverageBookRating(@Param("bookId") Long bookId);

  @Query(
      value =
          """
              SELECT b.*
              FROM books b
              WHERE get_average_book_rating(b.book_id) >= :minRating
                AND get_average_book_rating(b.book_id) <= :maxRating
          """,
      nativeQuery = true)
  List<Book> findBooksByRatingRange(
      @Param("minRating") Float minRating, @Param("maxRating") Float maxRating);

  @Query("SELECT get_average_book_rating(b.id) FROM Book b WHERE b.id = :id")
  Float findAverageRatingByBookId(@Param("id") Long id);
}

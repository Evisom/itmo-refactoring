package com.example.bookservice.context.book.specification;

import com.example.bookservice.context.author.model.Author;
import com.example.bookservice.context.book.model.Book;
import com.example.bookservice.context.book.model.BookCopy;
import com.example.bookservice.context.genre.model.Genre;
import com.example.bookservice.context.publisher.model.Publisher;
import com.example.bookservice.context.theme.model.Theme;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.stream.Collectors;

public class BookSpecifications {
    public static Specification<Book> hasTitleLike(String name) {
        return (root, query, cb) -> {
            if (name == null || name.trim().isEmpty()) {
                return cb.conjunction();
            }
            return cb.like(cb.lower(root.get("title")), "%" + name.toLowerCase() + "%");
        };
    }

    public static Specification<Book> hasAuthors(List<String> authors) {
        return (root, query, cb) -> {
            if (authors == null || authors.isEmpty()) {
                return cb.conjunction();
            }

            Join<Book, Author> authorJoin = root.join("authors");


            List<Predicate> predicates = authors.stream().map(author -> {
                String[] parts = author.split(" ", 2);
                String name = parts[0];
                String surname = parts.length > 1 ? parts[1] : "";


                return cb.and(
                        cb.equal(authorJoin.get("name"), name),
                        cb.equal(authorJoin.get("surname"), surname)
                );
            }).collect(Collectors.toList());


            return cb.or(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<Book> hasMinCopies(Integer minCopies) {
        return (root, query, cb) -> {
            if (minCopies == null) {
                return cb.conjunction();
            }
            return cb.greaterThanOrEqualTo(cb.size(root.get("copies")), minCopies);
        };
    }

    public static Specification<Book> hasMaxCopies(Integer maxCopies) {
        return (root, query, cb) -> {
            if (maxCopies == null) {
                return cb.conjunction();
            }
            return cb.lessThanOrEqualTo(cb.size(root.get("copies")), maxCopies);
        };
    }

    public static Specification<Book> hasGenre(List<String> genres) {
        return (root, query, cb) -> {
            if (genres == null || genres.isEmpty()) {
                return cb.conjunction();
            }


            Join<Book, Genre> genreJoin = root.join("genre");


            CriteriaBuilder.In<String> inClause = cb.in(genreJoin.get("name"));
            for (String genre : genres) {
                inClause.value(genre);
            }

            return inClause;
        };
    }

    public static Specification<Book> hasTheme(List<String> topic) {
        return (root, query, cb) -> {
            if (topic == null || topic.isEmpty()) {
                return cb.conjunction();
            }
            Join<Book, Theme> genreJoin = root.join("theme");


            CriteriaBuilder.In<String> inClause = cb.in(genreJoin.get("name"));
            for (String theme : topic) {
                inClause.value(theme);
            }

            return inClause;
        };
    }

    public static Specification<Book> hasPublisher(List<String> publisher) {
        return (root, query, cb) -> {
            if (publisher == null || publisher.isEmpty()) {
                return cb.conjunction();
            }
            Join<Book, Publisher> genreJoin = root.join("publisher");


            CriteriaBuilder.In<String> inClause = cb.in(genreJoin.get("name"));
            for (String theme : publisher) {
                inClause.value(theme);
            }

            return inClause;
        };
    }

    public static Specification<Book> hasAvailableCopies() {
        return (root, query, cb) -> {

            Join<Book, BookCopy> copiesJoin = root.join("copies");


            return cb.isTrue(copiesJoin.get("available"));
        };
    }

    public static Specification<Book> hasNoAvailableCopies() {
        return (root, query, cb) -> {
            Join<Book, BookCopy> copiesJoin = root.join("copies", JoinType.LEFT); // Используем LEFT JOIN


            return cb.or(
                    cb.isNull(copiesJoin.get("id")),  // Нет копий (id == null)
                    cb.isFalse(copiesJoin.get("available"))  // Копия недоступна (available = false)
            );
        };
    }

    public static Specification<Book> hasRatingBetween(Float minRating, Float maxRating) {
        return (root, query, cb) -> {

            Expression<Float> avgRating = cb.function(
                    "get_average_book_rating", Float.class, root.get("id"));


            return cb.between(avgRating, minRating, maxRating);
        };
    }


    public static Specification<Book> hasPopularity(Integer popularity) {
        return (root, query, cb) -> {
            if (popularity == null) {
                return cb.conjunction();
            }
            return cb.greaterThanOrEqualTo(root.get("popularity"), popularity);
        };
    }

    public static Specification<Book> hasRating(Double rating) {
        return (root, query, cb) -> {
            if (rating == null) {
                return cb.conjunction();
            }
            return cb.greaterThanOrEqualTo(root.get("rating"), rating);
        };
    }

    public static Specification<Book> sortByField(String field, boolean ascending) {
        return (root, query, cb) -> {
            if (field == null || field.trim().isEmpty()) {
                return cb.conjunction();
            }
            if (ascending) {
                query.orderBy(cb.asc(root.get(field)));
            } else {
                query.orderBy(cb.desc(root.get(field)));
            }
            return cb.conjunction();
        };
    }


}

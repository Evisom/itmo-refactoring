package com.example.bookservice.context.book.controller;

import com.example.bookservice.api.Endpoints;
import com.example.bookservice.context.book.model.Book;
import com.example.bookservice.context.book.model.BookModel;
import com.example.bookservice.context.book.model.BookSearchRequest;
import com.example.bookservice.context.book.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(Endpoints.LIBRARY)
public class BookController {

    private final BookService bookService;

    @GetMapping("/find")
    public ResponseEntity<Page<BookModel>> findBooks(
            @ModelAttribute BookSearchRequest request,
            Pageable pageable) {
        return ResponseEntity.ok(bookService.findBooks(request, pageable));
    }


    @GetMapping("/books/{id}")
    public ResponseEntity<BookModel> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.findBookById(id));
    }

    @PreAuthorize("hasRole('LIBRARIAN')")
    @PostMapping("/newBook")
    public ResponseEntity<BookModel> createBook(@RequestBody Book Book) {
        return ResponseEntity.ok(bookService.createBook(Book));
    }

    @PreAuthorize("hasRole('LIBRARIAN')")
    @PutMapping("/books/{id}")
    public ResponseEntity<BookModel> updateBook(@PathVariable Long id, @RequestBody Book Book) {
        return ResponseEntity.ok(bookService.updateBook(id, Book));
    }

    @PreAuthorize("hasRole('LIBRARIAN')")
    @DeleteMapping("/books/{id}")
    public ResponseEntity<Void> deleteHumanBeing(@PathVariable Long id) {
        if (bookService.deleteBook(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}

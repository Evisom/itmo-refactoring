package com.example.operationservice.context.book.model;

import com.example.operationservice.context.library.model.Library;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "book_copy")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookCopy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @ManyToOne
    @JoinColumn(name = "library_id", nullable = false)
    private Library library;

    @Column(name = "inventory_number", nullable = false)
    private String inventoryNumber;

    @Column(nullable = false)
    private Boolean available;

}

package com.example.bookservice.context.book.repository;

import com.example.bookservice.context.book.model.BookCopy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CopiesRepository extends JpaRepository<BookCopy, Long> {



    Page<BookCopy> findByBookIdAndLibraryId(Long bookId, Long libraryId, Pageable pageable);


    Page<BookCopy> findByLibraryId(Long libraryId, Pageable pageable);


    Page<BookCopy> findByBookId(Long bookId, Pageable pageable);

    BookCopy findByInventoryNumber(String inventoryNumber);

}

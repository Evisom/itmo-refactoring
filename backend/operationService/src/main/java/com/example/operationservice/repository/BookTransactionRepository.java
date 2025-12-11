package com.example.operationservice.repository;

import com.example.operationservice.model.BookTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookTransactionRepository extends JpaRepository<BookTransaction, Long> {

    @Query("SELECT bt FROM BookTransaction bt " +
            "JOIN bt.bookCopy bc " +
            "WHERE bc.library.id = :libraryId AND bt.status = 'PENDING'")
    List<BookTransaction> findUnborrowedTransactionsByLibraryId(@Param("libraryId") Long libraryId);


    @Query("SELECT bt FROM BookTransaction bt " +
            "JOIN bt.bookCopy bc " +
            "WHERE bc.id = :bookCopyId AND bt.status = 'APPROVED' " +
            "ORDER BY bt.creationDate DESC")
    List<BookTransaction> findByBookCopyIdAndStatusApproved(@Param("bookCopyId") Long bookCopyId);

    List<BookTransaction> findByUserId(String userId);

}



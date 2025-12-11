package com.example.operationservice.repository;

import com.example.operationservice.model.BookCopy;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CopiesRepository extends JpaRepository<BookCopy, Long> {

  List<BookCopy> findByBookIdAndLibraryId(Long bookId, Long libraryId);

  List<BookCopy> findByLibraryId(Long libraryId);

  List<BookCopy> findByInventoryNumber(String inventoryNumber);
}

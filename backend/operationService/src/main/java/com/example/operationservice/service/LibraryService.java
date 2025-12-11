package com.example.operationservice.service;

import com.example.operationservice.model.BookCopy;
import com.example.operationservice.model.BookModelForReport;
import com.example.operationservice.model.BookTransaction;
import com.example.operationservice.model.LibraryReportResponse;
import com.example.operationservice.repository.BookTransactionRepository;
import com.example.operationservice.repository.CopiesRepository;
import com.example.shared.exception.ResourceNotFoundException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LibraryService {
  private final CopiesRepository copiesRepository;
  private final BookTransactionRepository bookTransactionRepository;

  @Transactional
  public List<LibraryReportResponse> getReport(Long libraryId, LocalDate date) {

    List<BookCopy> bookCopies = copiesRepository.findByLibraryId(libraryId);
    List<BookTransaction> bookTransactions = bookTransactionRepository.findAll();

    Map<Long, Integer> bookCountMap = new HashMap<>();
    if (date == null) {

      for (BookCopy bookCopy : bookCopies) {
        if (bookCopy.getAvailable()) {
          Long bookId = bookCopy.getBook().getId();
          bookCountMap.put(bookId, bookCountMap.getOrDefault(bookId, 0) + 1);
        }
      }
    } else {
      for (BookCopy bookCopy : bookCopies) {
        Long bookId = bookCopy.getBook().getId();
        boolean f = Boolean.TRUE;
        for (BookTransaction bookTransaction : bookTransactions) {
          if (bookTransaction.getBookCopy() == bookCopy) {
            if (bookTransaction.getBorrowDate() != null) {
              if (bookTransaction.getBorrowDate().toLocalDate().isBefore(date)
                  && bookTransaction.getReturned() == null) {
                f = Boolean.FALSE;
                break;
              }
            }
          }
        }
        if (f) {

          bookCountMap.put(bookId, bookCountMap.getOrDefault(bookId, 0) + 1);
        }
      }
    }

    List<LibraryReportResponse> reportResponses = new ArrayList<>();

    for (Map.Entry<Long, Integer> entry : bookCountMap.entrySet()) {
      Long bookId = entry.getKey();
      Integer count = entry.getValue();

      LibraryReportResponse response = new LibraryReportResponse();
      response.setCount(count);

      BookModelForReport bookModel =
          bookCopies.stream()
              .filter(bookCopy -> bookCopy.getBook().getId().equals(bookId))
              .findFirst()
              .map(BookModelForReport::toModel)
              .orElseThrow(
                  () -> new ResourceNotFoundException("Book not found with id: " + bookId));

      response.setBookModels(bookModel);

      reportResponses.add(response);
    }

    return reportResponses;
  }
}

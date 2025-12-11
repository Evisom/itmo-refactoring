package com.example.operationservice.service;

import com.example.operationservice.dto.BookTransactionResponse;
import com.example.operationservice.dto.TransactionCreateRequest;
import com.example.operationservice.dto.TransactionDeclineRequest;
import com.example.operationservice.dto.TransactionResponse;
import com.example.operationservice.dto.TransactionReturnRequest;
import com.example.operationservice.dto.mapper.TransactionMapper;
import com.example.operationservice.kafka.EmailRequest;
import com.example.operationservice.kafka.KafkaProducer;
import com.example.operationservice.model.*;
import com.example.operationservice.model.BookCopy;
import com.example.operationservice.repository.BookTransactionRepository;
import com.example.operationservice.repository.CopiesRepository;
import com.example.operationservice.util.SecurityContextUtil;
import com.example.shared.exception.BusinessLogicException;
import com.example.shared.exception.ResourceNotFoundException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TransactionService {
  private final BookTransactionRepository bookTransactionRepository;
  private final CopiesRepository copiesRepository;
  private final KafkaProducer kafkaProducer;
  private final ObjectMapper objectMapper;
  private final TransactionMapper transactionMapper;

  @Transactional
  public BookTransactionResponse reserve(Long id, TransactionCreateRequest request) {
    BookTransaction transaction = new BookTransaction();
    List<BookCopy> bookCopyList =
        copiesRepository.findByBookIdAndLibraryId(id, request.getLibraryId()).stream()
            .filter(status -> Boolean.TRUE.equals(status.getAvailable()))
            .collect(java.util.stream.Collectors.toList());
    if (bookCopyList.isEmpty()) {
      throw new ResourceNotFoundException("Book copy not found in Library");
    }
    BookCopy book = bookCopyList.get(0);
    transaction.setBookCopy(book);

    String userId = SecurityContextUtil.getUserId();
    transaction.setUserId(userId != null ? userId : "anonymous");
    transaction.setStatus(Status.PENDING);
    transaction.setCreationDate(LocalDateTime.now());
    return transactionMapper.toBookTransactionResponse(bookTransactionRepository.save(transaction));
  }

  @Transactional(readOnly = true)
  public List<TransactionResponse> getRequests(Long libraryId) {
    List<BookTransaction> res =
        bookTransactionRepository.findUnborrowedTransactionsByLibraryId(libraryId);
    return res.stream()
        .filter(bookTransaction -> bookTransaction.getStatus() != Status.REJECTED)
        .map(transactionMapper::toTransactionResponse)
        .collect(Collectors.toList());
  }

  @Transactional
  public BookTransactionResponse approve(Long id) {
    BookTransaction transaction =
        bookTransactionRepository
            .findById(id)
            .orElseThrow(
                () -> new ResourceNotFoundException("Transaction not found with id: " + id));
    transaction.setBorrowDate(LocalDateTime.now());
    BookCopy bookCopy = transaction.getBookCopy();
    if (bookCopy != null && Boolean.TRUE.equals(bookCopy.getAvailable())) {
      bookCopy.setAvailable(false);
      transaction.setStatus(Status.APPROVED);
      copiesRepository.save(bookCopy);

    } else {
      throw new BusinessLogicException("Book copy is not available");
    }

    String userEmail = SecurityContextUtil.getEmail();
    userEmail = userEmail != null ? userEmail : "anonymous@example.com";
    try {
      String json =
          objectMapper.writeValueAsString(
              new EmailRequest(
                  userEmail,
                  "BooBook",
                  "Ваша бронь на книгу "
                      + transaction.getBookCopy().getBook().getTitle()
                      + " одобрена."));
      kafkaProducer.sendMessage(json);
    } catch (JsonProcessingException ex) {
      throw new BusinessLogicException("Failed to send email notification");
    }

    return transactionMapper.toBookTransactionResponse(bookTransactionRepository.save(transaction));
  }

  @Transactional
  public BookTransactionResponse decline(Long id, TransactionDeclineRequest request) {
    BookTransaction transaction =
        bookTransactionRepository
            .findById(id)
            .orElseThrow(
                () -> new ResourceNotFoundException("Transaction not found with id: " + id));
    transaction.setStatus(Status.REJECTED);
    transaction.setComment(request.getComment());

    String userEmail = SecurityContextUtil.getEmail();
    userEmail = userEmail != null ? userEmail : "anonymous@example.com";

    try {
      String json =
          objectMapper.writeValueAsString(
              new EmailRequest(
                  userEmail,
                  "BooBook",
                  "Ваша бронь на книгу "
                      + transaction.getBookCopy().getBook().getTitle()
                      + " отклонена. Причина: "
                      + transaction.getComment()
                      + "."));
      kafkaProducer.sendMessage(json);
    } catch (JsonProcessingException ex) {
      throw new BusinessLogicException("Failed to send email notification");
    }
    return transactionMapper.toBookTransactionResponse(bookTransactionRepository.save(transaction));
  }

  @Transactional
  public BookTransactionResponse returnBack(TransactionReturnRequest request) {
    List<BookCopy> bookCopies =
        copiesRepository.findByInventoryNumber(request.getInventoryNumber());
    if (bookCopies == null || bookCopies.isEmpty()) {
      throw new ResourceNotFoundException(
          "Book copy with inventory number " + request.getInventoryNumber() + " not found");
    }
    // Если несколько копий с одним инвентарным номером, берем первую
    BookCopy bookCopy = bookCopies.get(0);

    List<BookTransaction> transactions =
        bookTransactionRepository.findByBookCopyIdAndStatusApproved(bookCopy.getId());
    if (transactions == null || transactions.isEmpty()) {
      throw new BusinessLogicException("Book transaction not approved yet");
    }
    // Берем самую новую транзакцию (уже отсортирована по creationDate DESC)
    BookTransaction bookTransaction = transactions.get(0);
    bookTransaction.setStatus(Status.RETURNED);
    bookTransaction.setReturnDate(LocalDateTime.now());

    return transactionMapper.toBookTransactionResponse(
        bookTransactionRepository.save(bookTransaction));
  }

  @Transactional
  public Void cancel(Long id) {
    BookTransaction bookTransaction =
        bookTransactionRepository
            .findById(id)
            .orElseThrow(
                () -> new ResourceNotFoundException("Transaction not found with id: " + id));
    if (bookTransaction.getStatus() == Status.PENDING) {
      bookTransactionRepository.delete(bookTransaction);
      return null;
    } else {
      throw new BusinessLogicException("Transaction status is not PENDING");
    }
  }

  @Transactional
  public List<Status> getStatus(Long bookId) {
    List<Status> allStatus = new ArrayList<>();

    String userId = SecurityContextUtil.getUserId();
    userId = userId != null ? userId : "anonymous";

    List<BookTransaction> bookTransactionsList = bookTransactionRepository.findByUserId(userId);

    for (BookTransaction transaction : bookTransactionsList) {
      if (Objects.equals(transaction.getBookCopy().getBook().getId(), bookId)) {
        allStatus.add(transaction.getStatus());
      }
    }
    return allStatus;
  }
}

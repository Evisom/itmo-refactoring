package com.example.operationservice.api.v2;

import com.example.operationservice.dto.*;
import com.example.operationservice.model.Status;
import com.example.operationservice.service.TransactionService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(EndpointsV2.TRANSACTIONS)
@RequiredArgsConstructor
public class TransactionControllerV2 {
  private final TransactionService transactionService;

  @PreAuthorize("hasRole('LIBRARIAN')")
  @GetMapping
  public ResponseEntity<List<TransactionResponse>> getTransactions(@RequestParam Long libraryId) {
    return ResponseEntity.ok(transactionService.getRequests(libraryId));
  }

  @GetMapping("/reading-status")
  public ResponseEntity<List<Status>> getReadingStatus(@RequestParam Long bookId) {
    return ResponseEntity.ok(transactionService.getStatus(bookId));
  }

  @PostMapping
  public ResponseEntity<BookTransactionResponse> createTransaction(
      @RequestParam Long bookId, @Valid @RequestBody TransactionCreateRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(transactionService.reserve(bookId, request));
  }

  @PreAuthorize("hasRole('LIBRARIAN')")
  @PostMapping("/{id}/approve")
  public ResponseEntity<BookTransactionResponse> approveTransaction(@PathVariable Long id) {
    return ResponseEntity.ok(transactionService.approve(id));
  }

  @PreAuthorize("hasRole('LIBRARIAN')")
  @PostMapping("/{id}/decline")
  public ResponseEntity<BookTransactionResponse> declineTransaction(
      @PathVariable Long id, @Valid @RequestBody TransactionDeclineRequest request) {
    return ResponseEntity.ok(transactionService.decline(id, request));
  }

  @PreAuthorize("hasRole('LIBRARIAN')")
  @PostMapping("/return")
  public ResponseEntity<BookTransactionResponse> returnTransaction(
      @Valid @RequestBody TransactionReturnRequest request) {
    return ResponseEntity.ok(transactionService.returnBack(request));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> cancelTransaction(@PathVariable Long id) {
    transactionService.cancel(id);
    return ResponseEntity.noContent().build();
  }
}

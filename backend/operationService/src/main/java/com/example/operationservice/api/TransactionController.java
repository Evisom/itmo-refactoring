package com.example.operationservice.api;

import com.example.operationservice.api.Endpoints;
import com.example.operationservice.dto.*;
import com.example.operationservice.model.Status;
import com.example.operationservice.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(Endpoints.TRANSACTION)
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;

    @PreAuthorize("hasRole('LIBRARIAN')")
    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getAllRequests(@RequestParam Long libraryId) {
        return ResponseEntity.ok(transactionService.getRequests(libraryId));
    }

    @GetMapping("/readingStatus")
    public ResponseEntity<List<Status>> getBookStatus(@RequestParam Long bookId) {
        return ResponseEntity.ok(transactionService.getStatus(bookId));
    }

    @PostMapping("/books/{id}/reserve")
    public ResponseEntity<BookTransactionResponse> reservBook(@PathVariable Long id, @Valid @RequestBody TransactionCreateRequest request) {
        return ResponseEntity.ok(transactionService.reserve(id, request));
    }

    @PreAuthorize("hasRole('LIBRARIAN')")
    @PostMapping("/approve/{id}")
    public ResponseEntity<BookTransactionResponse> approveRequest(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.approve(id));
    }

    @PreAuthorize("hasRole('LIBRARIAN')")
    @PostMapping("/decline/{id}")
    public ResponseEntity<BookTransactionResponse> declineRequest(@PathVariable Long id, @Valid @RequestBody TransactionDeclineRequest request) {
        return ResponseEntity.ok(transactionService.decline(id, request));
    }

    @PreAuthorize("hasRole('LIBRARIAN')")
    @PostMapping("/return")
    public ResponseEntity<BookTransactionResponse> returnBook(@Valid @RequestBody TransactionReturnRequest request) {
        return ResponseEntity.ok(transactionService.returnBack(request));
    }

    @PostMapping("/transaction/cancel/{id}")
    public ResponseEntity<Void> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.cancel(id));
    }

}

package com.example.operationservice.api;

import com.example.operationservice.api.Endpoints;
import com.example.operationservice.model.*;
import com.example.operationservice.service.TransactionService;
import com.example.operationservice.model.LibraryRequest;
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
    public ResponseEntity<BookTransactionModel> reservBook(@PathVariable Long id, @RequestBody LibraryRequest library) {
        return ResponseEntity.ok(transactionService.reserve(id, library));
    }


    @PreAuthorize("hasRole('LIBRARIAN')")
    @PostMapping("/approve/{id}")
    public ResponseEntity<BookTransactionModel> approveRequest(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.approve(id));
    }
    @PreAuthorize("hasRole('LIBRARIAN')")
    @PostMapping("/decline/{id}")
    public ResponseEntity<BookTransactionModel> declineRequest(@PathVariable Long id, @RequestBody Reason reason) {
        return ResponseEntity.ok(transactionService.decline(id, reason));
    }


    @PreAuthorize("hasRole('LIBRARIAN')")
    @PostMapping("/return")
    public ResponseEntity<BookTransactionModel> returnBook(@RequestBody ReturnRequest request) {
        return ResponseEntity.ok(transactionService.returnBack(request));
    }

    @PostMapping("/transaction/cancel/{id}")
    public ResponseEntity<Void> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.cancel(id));
    }


}

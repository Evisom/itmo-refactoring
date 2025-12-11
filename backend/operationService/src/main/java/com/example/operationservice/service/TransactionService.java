package com.example.operationservice.service;

import com.example.operationservice.exception.BookCopyNotFoundInLibraryException;
import com.example.operationservice.model.BookCopy;
import com.example.operationservice.repository.CopiesRepository;
import com.example.operationservice.exception.BookNotAprrovedYetException;
import com.example.operationservice.model.*;
import com.example.operationservice.repository.BookTransactionRepository;
import com.example.operationservice.model.LibraryRequest;
import com.example.operationservice.config.CustomUserDetails;
import com.example.operationservice.config.JwtTokenUtil;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import com.example.operationservice.kafka.EmailRequest;
import com.example.operationservice.kafka.KafkaProducer;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final BookTransactionRepository bookTransactionRepository;
    private final CopiesRepository copiesRepository;

    private final KafkaProducer kafkaProducer;
    private final ObjectMapper objectMapper;

    @Transactional
    public BookTransactionModel reserve(Long id, LibraryRequest library) {
        BookTransaction transaction = new BookTransaction();
        List<BookCopy> bookCopyList = copiesRepository.findByBookIdAndLibraryId(id, library.getLibraryId())
                .stream().filter(status -> status.getAvailable() == Boolean.TRUE).toList();
        if (bookCopyList.isEmpty()) {
            throw new BookCopyNotFoundInLibraryException("Book copy not found in Library");
        }
        BookCopy book = bookCopyList.get(0);
        transaction.setBookCopy(book);
//
        // Получаем пользователя из SecurityContext
        String userId = null;
        String email = null;
        String firstName = null;
        String lastName = null;
        
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() != null) {
                if (auth.getPrincipal() instanceof Jwt) {
                    Jwt jwt = (Jwt) auth.getPrincipal();
                    userId = jwt.getClaimAsString("sub");
                    email = jwt.getClaimAsString("email");
                    firstName = jwt.getClaimAsString("given_name");
                    lastName = jwt.getClaimAsString("family_name");
                } else if (auth.getPrincipal() instanceof CustomUserDetails) {
                    CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
                    userId = userDetails.getId();
                    email = userDetails.getEmail();
                    firstName = userDetails.getFirstName();
                    lastName = userDetails.getLastName();
                }
            }
        } catch (Exception e) {
            // Игнорируем ошибки аутентификации
        }

        transaction.setUserId(userId != null ? userId : "anonymous");
        transaction.setStatus(Status.PENDING);
        transaction.setCreationDate(LocalDateTime.now());
        // createdAt и updatedAt устанавливаются автоматически через @PrePersist
        return BookTransactionModel.toModel(bookTransactionRepository.save(transaction));
    }

    @Transactional
    public List<TransactionResponse> getRequests(Long libraryId) {
        List<BookTransaction> res = bookTransactionRepository.findUnborrowedTransactionsByLibraryId(libraryId);
        return res.stream()
                .filter(bookTransaction -> bookTransaction.getStatus() != Status.REJECTED)
                .map(TransactionResponse::fromBookTransToResponse).collect(Collectors.toList());

    }

    @Transactional
    public BookTransactionModel approve(Long id) {
        BookTransaction transaction = bookTransactionRepository.findById(id).orElse(null);
        transaction.setBorrowDate(LocalDateTime.now());
        BookCopy bookCopy = transaction.getBookCopy();
        if (bookCopy != null && bookCopy.getAvailable() == Boolean.TRUE) {
            bookCopy.setAvailable(Boolean.FALSE);
            transaction.setStatus(Status.APPROVED);
            copiesRepository.save(bookCopy);

        } else {
            throw new RuntimeException();
        }

        // Получаем email из JWT для отправки уведомления
        String userEmail = null;
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() != null) {
                if (auth.getPrincipal() instanceof Jwt) {
                    Jwt jwt = (Jwt) auth.getPrincipal();
                    userEmail = jwt.getClaimAsString("email");
                } else if (auth.getPrincipal() instanceof CustomUserDetails) {
                    CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
                    userEmail = userDetails.getEmail();
                }
            }
        } catch (Exception e) {
            // Игнорируем ошибки аутентификации
        }
        userEmail = userEmail != null ? userEmail : "anonymous@example.com";
        try {
            String json = objectMapper.writeValueAsString(new EmailRequest(
                    userEmail,
                    "BooBook",
                    "Ваша бронь на книгу " + transaction.getBookCopy().getBook().getTitle() + " одобрена."

            ));
            kafkaProducer.sendMessage(json);
        } catch (JsonProcessingException ex) {
            throw new RuntimeException();
        }

        return BookTransactionModel.toModel(bookTransactionRepository.save(transaction));

    }

    @Transactional
    public BookTransactionModel decline(Long id, Reason reason) {
        BookTransaction transaction = bookTransactionRepository.findById(id).orElse(null);
        transaction.setStatus(Status.REJECTED);
        transaction.setComment(reason.getComment());

        // Получаем email из JWT для отправки уведомления
        String userEmail = null;
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() != null) {
                if (auth.getPrincipal() instanceof Jwt) {
                    Jwt jwt = (Jwt) auth.getPrincipal();
                    userEmail = jwt.getClaimAsString("email");
                } else if (auth.getPrincipal() instanceof CustomUserDetails) {
                    CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
                    userEmail = userDetails.getEmail();
                }
            }
        } catch (Exception e) {
            // Игнорируем ошибки аутентификации
        }
        userEmail = userEmail != null ? userEmail : "anonymous@example.com";

        try {
            String json = objectMapper.writeValueAsString(new EmailRequest(
                    userEmail,
                    "BooBook",
                    "Ваша бронь на книгу " + transaction.getBookCopy().getBook().getTitle() + " отклонена. Причина: " + transaction.getComment() + "."

            ));
            kafkaProducer.sendMessage(json);
        } catch (JsonProcessingException ex) {
            throw new RuntimeException();
        }
        return BookTransactionModel.toModel(bookTransactionRepository.save(transaction));
    }

    @Transactional
    public BookTransactionModel returnBack(ReturnRequest request) {
        List<BookCopy> bookCopies = copiesRepository.findByInventoryNumber(request.getInvNumber());
        if (bookCopies == null || bookCopies.isEmpty()) {
            throw new BookCopyNotFoundInLibraryException("Book copy with inventory number " + request.getInvNumber() + " not found");
        }
        // Если несколько копий с одним инвентарным номером, берем первую
        BookCopy bookCopy = bookCopies.get(0);
        
        List<BookTransaction> transactions = bookTransactionRepository.findByBookCopyIdAndStatusApproved(bookCopy.getId());
        if (transactions == null || transactions.isEmpty()) {
            throw new BookNotAprrovedYetException("book not aprroved yet");
        }
        // Берем самую новую транзакцию (уже отсортирована по creationDate DESC)
        BookTransaction bookTransaction = transactions.get(0);
        bookTransaction.setStatus(Status.RETURNED);
        bookTransaction.setReturnDate(LocalDateTime.now());

        return BookTransactionModel.toModel(bookTransactionRepository.save(bookTransaction));
    }

    @Transactional
    public Void cancel(Long id) {
        BookTransaction bookTransaction = bookTransactionRepository.findById(id).orElseThrow(() -> new BookCopyNotFoundInLibraryException("no such transaction"));
        if (bookTransaction.getStatus() == Status.PENDING) {
            bookTransactionRepository.delete(bookTransaction);
            return null;
        } else {
            throw new RuntimeException("status not pending");
        }
    }

    @Transactional
    public List<Status> getStatus(Long bookId) {
        List<Status> allStatus = new ArrayList<>();
        
        // Получаем пользователя из SecurityContext
        String userId = null;
        
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() != null) {
                if (auth.getPrincipal() instanceof Jwt) {
                    Jwt jwt = (Jwt) auth.getPrincipal();
                    userId = jwt.getClaimAsString("sub");
                } else if (auth.getPrincipal() instanceof CustomUserDetails) {
                    CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
                    userId = userDetails.getId();
                }
            }
        } catch (Exception e) {
            // Игнорируем ошибки аутентификации
        }
        
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

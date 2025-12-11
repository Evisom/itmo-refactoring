package com.example.operationservice.dto.mapper;

import com.example.operationservice.dto.BookTransactionResponse;
import com.example.operationservice.dto.TransactionResponse;
import com.example.operationservice.model.BookTransaction;
import com.example.shared.dto.AuthorResponse;
import com.example.shared.model.Author;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class TransactionMapper {

  public BookTransactionResponse toBookTransactionResponse(BookTransaction transaction) {
    BookTransactionResponse response = new BookTransactionResponse();
    response.setId(transaction.getId());
    response.setBookCopyId(transaction.getBookCopy().getId());
    response.setUserId(transaction.getUserId());
    response.setBorrowDate(transaction.getBorrowDate());
    response.setReturnDate(transaction.getReturnDate());
    response.setCreationDate(transaction.getCreationDate());
    response.setReturned(transaction.getReturned());
    response.setStatus(transaction.getStatus().toString());
    response.setComment(transaction.getComment());
    return response;
  }

  public TransactionResponse toTransactionResponse(BookTransaction transaction) {
    TransactionResponse response = new TransactionResponse();
    response.setId(transaction.getId());
    response.setInventoryId(transaction.getBookCopy().getInventoryNumber());
    response.setTitle(transaction.getBookCopy().getBook().getTitle());
    response.setStatus(transaction.getStatus().toString());

    if (transaction.getBookCopy().getBook().getAuthors() != null) {
      response.setAuthors(
          transaction.getBookCopy().getBook().getAuthors().stream()
              .map(this::toAuthorResponse)
              .collect(Collectors.toList()));
    }

    return response;
  }

  private AuthorResponse toAuthorResponse(Author author) {
    AuthorResponse response = new AuthorResponse();
    response.setId(author.getId());
    response.setName(author.getName());
    response.setSurname(author.getSurname());
    response.setBirthDate(author.getBirthDate());
    return response;
  }
}

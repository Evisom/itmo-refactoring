package com.example.operationservice.context.booktransaction.model;

import com.example.operationservice.context.author.model.AuthorModel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
public class TransactionResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String title;
    private List<AuthorModel> author;
    private String inventoryId;
    private String status;

    public static TransactionResponse fromBookTransToResponse(BookTransaction transaction) {
        TransactionResponse res = new TransactionResponse();
        // Данные пользователя теперь получаются из Keycloak по userId
        // Для отображения можно получить из JWT или оставить пустыми
        res.setFirstName(null); // Получать из Keycloak при необходимости
        res.setLastName(null); // Получать из Keycloak при необходимости
        res.setEmail(null); // Получать из Keycloak при необходимости
        res.setId(transaction.getId());
        res.setInventoryId(transaction.getBookCopy().getInventoryNumber());
        res.setAuthor(transaction.getBookCopy().getBook().getAuthors().stream().map(AuthorModel::toModel).collect(Collectors.toList()));
        res.setTitle(transaction.getBookCopy().getBook().getTitle());
        res.setStatus(transaction.getStatus().toString());
        return res;
    }
}

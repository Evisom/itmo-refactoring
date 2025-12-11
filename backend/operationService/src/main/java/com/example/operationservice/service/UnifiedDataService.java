package com.example.operationservice.service;

import com.example.operationservice.model.AuthorModel;
import com.example.operationservice.model.UnifiedData;
import com.example.operationservice.repository.BookTransactionRepository;
import com.example.operationservice.repository.RatingRepository;
import com.example.operationservice.util.SecurityContextUtil;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UnifiedDataService {
  private final RatingRepository ratingRepository;
  private final BookTransactionRepository bookTransactionRepository;

  public UnifiedDataService(
      RatingRepository ratingRepository, BookTransactionRepository bookTransactionRepository) {
    this.ratingRepository = ratingRepository;
    this.bookTransactionRepository = bookTransactionRepository;
  }

  @Transactional
  public List<UnifiedData> getUnifiedDataSortedByTime(String email) {
    List<UnifiedData> unifiedData = new ArrayList<>();

    String userId = SecurityContextUtil.getUserId();
    String userEmail = SecurityContextUtil.getEmail();

    // Используем email из параметра, если передан, иначе из токена
    final String finalEmail = (email != null && !email.isEmpty()) ? email : userEmail;
    final String finalUserId = userId;

    unifiedData.addAll(
        ratingRepository.findAll().stream()
            .map(
                rating ->
                    new UnifiedData(
                        rating.getId(),
                        "Rating",
                        rating.getTime(),
                        rating.getUserId(),
                        null, // email удален из модели - получается из Keycloak по userId
                        rating.getRatingValue().intValue(),
                        rating.getReview(),
                        rating.getBook().getTitle(),
                        rating.getBook().getAuthors().stream()
                            .map(AuthorModel::toModel)
                            .collect(Collectors.toList()), // FirstName для Rating отсутствует
                        null,
                        null,
                        null,
                        null,
                        null))
            .collect(Collectors.toList()));

    unifiedData.addAll(
        bookTransactionRepository.findAll().stream()
            .map(
                transaction ->
                    new UnifiedData(
                        transaction.getId(),
                        "BookTransaction",
                        transaction.getCreationDate(),
                        transaction.getUserId(),
                        null, // email удален из модели - получается из Keycloak по userId
                        null,
                        null,
                        transaction.getBookCopy().getBook().getTitle(),
                        transaction.getBookCopy().getBook().getAuthors().stream()
                            .map(AuthorModel::toModel)
                            .collect(Collectors.toList()),
                        transaction.getBookCopy().getLibrary(),
                        transaction.getBorrowDate(),
                        transaction.getStatus().toString(),
                        transaction.getComment(),
                        transaction.getBookCopy().getInventoryNumber()))
            .collect(Collectors.toList()));
    // Фильтруем по email (приоритет), если он указан, иначе по userId
    if (finalEmail != null && !finalEmail.isEmpty()) {
      List<UnifiedData> filteredByEmail =
          unifiedData.stream()
              .filter(unit -> Objects.equals(unit.getEmail(), finalEmail))
              .sorted(Comparator.comparing(UnifiedData::getTime).reversed())
              .collect(Collectors.toList());

      // Если нашли по email, возвращаем
      if (!filteredByEmail.isEmpty()) {
        return filteredByEmail;
      }
    }

    // Если по email не нашли, пробуем по userId
    if (finalUserId != null && !finalUserId.isEmpty()) {
      List<UnifiedData> filteredByUserId =
          unifiedData.stream()
              .filter(unit -> Objects.equals(unit.getUserId(), finalUserId))
              .sorted(Comparator.comparing(UnifiedData::getTime).reversed())
              .collect(Collectors.toList());

      if (!filteredByUserId.isEmpty()) {
        return filteredByUserId;
      }
    }

    // Если ни email, ни userId не указаны или не найдены, возвращаем пустой список
    return new ArrayList<>();
  }
}

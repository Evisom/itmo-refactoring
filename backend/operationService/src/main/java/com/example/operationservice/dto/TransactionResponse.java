package com.example.operationservice.dto;

import com.example.shared.dto.AuthorResponse;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TransactionResponse {
  private Long id;
  private String title;
  private List<AuthorResponse> authors;
  private String inventoryId;
  private String status;
}

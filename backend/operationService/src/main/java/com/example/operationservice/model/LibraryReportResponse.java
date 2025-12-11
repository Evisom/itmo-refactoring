package com.example.operationservice.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LibraryReportResponse {
  private BookModelForReport bookModels;
  private Integer count;
}

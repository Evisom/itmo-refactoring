package com.example.operationservice.context.library.model;


import com.example.operationservice.context.book.model.BookModelForReport;
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

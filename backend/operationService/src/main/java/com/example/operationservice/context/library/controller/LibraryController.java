package com.example.operationservice.context.library.controller;


import com.example.operationservice.api.Endpoints;
import com.example.operationservice.context.library.model.LibraryReportResponse;
import com.example.operationservice.context.library.service.LibraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping(Endpoints.TRANSACTION)
@RequiredArgsConstructor
public class LibraryController {
    private final LibraryService libraryService;


    @PreAuthorize("hasRole('LIBRARIAN')")
    @GetMapping("/libraryReport/{libraryId}")
    public ResponseEntity<List<LibraryReportResponse>> getAllReport(@PathVariable Long libraryId,
                                                                    @RequestParam(required = false) LocalDate date) {
        return ResponseEntity.ok(libraryService.getReport(libraryId, date));
    }
}

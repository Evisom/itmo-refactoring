package com.example.operationservice.context.unifieddata;

import com.example.operationservice.api.Endpoints;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(Endpoints.HISTORY)
@RequiredArgsConstructor
public class UnifiedDataController {
    private final UnifiedDataService unifiedDataService;


    @GetMapping
    public ResponseEntity<List<UnifiedData>> getAllRatings(@RequestParam(required = false) String email) {
        return ResponseEntity.ok(unifiedDataService.getUnifiedDataSortedByTime(email));
    }



}

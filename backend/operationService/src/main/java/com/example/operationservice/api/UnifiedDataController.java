package com.example.operationservice.api;

import com.example.operationservice.model.UnifiedData;
import com.example.operationservice.service.UnifiedDataService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(Endpoints.HISTORY)
@RequiredArgsConstructor
public class UnifiedDataController {
  private final UnifiedDataService unifiedDataService;

  @GetMapping
  public ResponseEntity<List<UnifiedData>> getAllRatings(
      @RequestParam(required = false) String email) {
    return ResponseEntity.ok(unifiedDataService.getUnifiedDataSortedByTime(email));
  }
}

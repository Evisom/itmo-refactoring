package com.example.bookservice.api;

import com.example.bookservice.dto.PublisherCreateRequest;
import com.example.bookservice.service.PublisherService;
import com.example.shared.dto.PublisherResponse;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(Endpoints.PUBLISHER)
public class PublisherController {
  private final PublisherService publisherService;

  @GetMapping
  public ResponseEntity<List<PublisherResponse>> allPublishers() {
    return ResponseEntity.status(HttpStatus.OK).body(publisherService.findAllPublishers());
  }

  @PreAuthorize("hasRole('LIBRARIAN')")
  @PostMapping
  public ResponseEntity<PublisherResponse> createPublisher(
      @Valid @RequestBody PublisherCreateRequest request) {
    return ResponseEntity.ok(publisherService.createPublisher(request));
  }

  @PreAuthorize("hasRole('LIBRARIAN')")
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deletePublisher(@PathVariable Long id) {
    if (publisherService.deletePublisher(id)) {
      return ResponseEntity.noContent().build();
    } else {
      return ResponseEntity.notFound().build();
    }
  }
}

package com.example.bookservice.context.publisher.controller;

import com.example.bookservice.api.Endpoints;
import com.example.bookservice.context.publisher.model.Publisher;
import com.example.bookservice.context.publisher.service.PublisherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(Endpoints.PUBLISHER)
public class PublisherController {
    private final PublisherService publisherService;

    @GetMapping
    public ResponseEntity<List<Publisher>> allPublishers() {
        return ResponseEntity.status(HttpStatus.OK).body(publisherService.findAllPublishers());
    }

    @PreAuthorize("hasRole('LIBRARIAN')")
    @PostMapping
    public ResponseEntity<Publisher> createPublisher(@RequestBody Publisher publisher) {
        return ResponseEntity.ok(publisherService.createPublisher(publisher));
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

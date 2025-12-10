package com.example.bookservice.context.publisher.service;

import com.example.bookservice.context.publisher.model.Publisher;
import com.example.bookservice.context.publisher.repository.PublisherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PublisherService {
    private final PublisherRepository publisherRepository;

    @Transactional
    public List<Publisher> findAllPublishers() {

        return publisherRepository.findAll();
    }


    @Transactional
    public Publisher createPublisher(Publisher publisher) {
        return publisherRepository.save(publisher);
    }

    @Transactional
    public boolean deletePublisher(Long id) {
        Publisher publisher = publisherRepository.findById(id).orElse(null);

        if (publisher == null) {
            return false;
        }

        publisherRepository.deleteById(id);

        return true;
    }
}
